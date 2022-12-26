import {
  aws_apigateway as ApiGateway,
  aws_dynamodb as Dynamo,
  aws_lambda as Lambda,
  aws_lambda_event_sources as LambdaEventSources,
  aws_sqs as SQS,
  Duration,
  RemovalPolicy,
  Stack,
  StackProps
} from "aws-cdk-lib";
import {Construct} from "constructs";
import * as path from "path";

export class CdkSamStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const queue = new SQS.Queue(this, "CdkSamQueue", {
      queueName: "CdkSamQueue",
      visibilityTimeout: Duration.seconds(300)
    });

    const inputFunction = new Lambda.Function(this, "CdkSamInputFunction", {
      functionName: "CdkSamInputFunction",
      runtime: Lambda.Runtime.JAVA_11,
      handler: "cdk.sam.lambdas.ApiEventHandler::handleRequest",
      // lambdas/app/build/archives/lambda-deployment-bundle.zip
      code: Lambda.Code.fromAsset(path.join("..", "lambdas", "app/build/archives/lambda-deployment-bundle.zip")),
      environment: {
        QUEUE_URL: queue.queueUrl
      }
    });

    queue.grantSendMessages(inputFunction);

    const api = new ApiGateway.LambdaRestApi(this, "input-api", {
      handler: inputFunction,
      proxy: false
    });

    const items = api.root.addResource("items");
    items.addMethod("POST");

    const table = new Dynamo.Table(this, "ProcessingEventsTable", {
      tableName: "ProcessingEvents",
      partitionKey: { name: "Id", type: Dynamo.AttributeType.STRING },
      tableClass: Dynamo.TableClass.STANDARD_INFREQUENT_ACCESS,
      timeToLiveAttribute: "ttl",
      removalPolicy: RemovalPolicy.DESTROY
    });

    const computeFunction = new Lambda.Function(this, "CdkSamComputeFunction", {
      functionName: "CdkSamComputeFunction",
      runtime: Lambda.Runtime.JAVA_11,
      handler: "cdk.sam.lambdas.SqsEventHandler::handleRequest",
      code: Lambda.Code.fromAsset(path.join("..", "lambdas", "app/build/archives/lambda-deployment-bundle.zip")),
      memorySize: 1024,
      environment: {
        TABLE_NAME: table.tableName
      },
      timeout: Duration.seconds(15)
    });

    queue.grantConsumeMessages(computeFunction);

    const queueEventSource = new LambdaEventSources.SqsEventSource(queue);

    computeFunction.addEventSource(queueEventSource);

    table.grantReadWriteData(computeFunction);
  }
}

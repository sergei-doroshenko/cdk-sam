import {
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
      visibilityTimeout: Duration.seconds(300)
    });

    const table = new Dynamo.Table(this, "ProcessingEventsTable", {
      tableName: "ProcessingEvents",
      partitionKey: { name: "id", type: Dynamo.AttributeType.STRING },
      tableClass: Dynamo.TableClass.STANDARD_INFREQUENT_ACCESS,
      timeToLiveAttribute: "ttl",
      removalPolicy: RemovalPolicy.DESTROY
    });

    const fn = new Lambda.Function(this, "CdkSamInputFunction", {
      functionName: "CdkSamInputFunction",
      runtime: Lambda.Runtime.JAVA_11,
      handler: "cdk.sam.lambdas.SqsEventHandler::handleRequest",
      // lambdas/app/build/archives/lambda-deployment-bundle.zip
      code: Lambda.Code.fromAsset(path.join("..", "lambdas", "app/build/archives/lambda-deployment-bundle.zip")),
      environment: {
        TABLE_NAME: table.tableName
      }
    });

    queue.grantConsumeMessages(fn);

    const queueEventSource = new LambdaEventSources.SqsEventSource(queue);

    fn.addEventSource(queueEventSource);

    table.grantReadWriteData(fn);
  }
}

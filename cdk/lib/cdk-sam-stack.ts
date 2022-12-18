import {
  aws_lambda as Lambda,
  aws_lambda_event_sources as LambdaEventSources,
  aws_s3 as S3,
  aws_sqs as SQS, Duration,
  RemovalPolicy,
  Stack,
  StackProps
} from "aws-cdk-lib";
import {Construct} from 'constructs';
import * as path from "path";

export class CdkSamStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const queue = new SQS.Queue(this, 'CdkSamQueue', {
      visibilityTimeout: Duration.seconds(300)
    });

    const fn = new Lambda.Function(this, "CdkSamInputFunction", {
      functionName: "CdkSamInputFunction",
      runtime: Lambda.Runtime.JAVA_11,
      handler: "cdk.sam.lambdas.SqsEventHandler::handleRequest",
      code: Lambda.Code.fromAsset(path.join("..", "lambdas", "lambdas-kotlin.zip"))
    });

    queue.grantConsumeMessages(fn);

    const queueEventSource = new LambdaEventSources.SqsEventSource(queue);

    fn.addEventSource(queueEventSource);
  }
}

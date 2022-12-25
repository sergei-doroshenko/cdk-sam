import {
  aws_lambda as Lambda,
  aws_lambda_event_sources as LambdaEventSources,
  aws_sqs as SQS, Duration,
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
      // lambdas/app/build/archives/lambda-deployment-bundle.zip
      code: Lambda.Code.fromAsset(path.join("..", "lambdas", "app/build/archives/lambda-deployment-bundle.zip"))
    });

    queue.grantConsumeMessages(fn);

    const queueEventSource = new LambdaEventSources.SqsEventSource(queue);

    fn.addEventSource(queueEventSource);
  }
}

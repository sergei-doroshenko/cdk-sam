package cdk.sam.lambdas

import com.amazonaws.services.lambda.runtime.RequestHandler
import com.amazonaws.services.lambda.runtime.Context
import com.amazonaws.services.lambda.runtime.events.SQSEvent

class SqsEventHandler: RequestHandler<SQSEvent, Unit> {
  override fun handleRequest(sqsEvent: SQSEvent, context: Context) {
    println("Example lambda with SQS Event")
    sqsEvent.records.forEach {
      println(it.body)
    }
  }
}

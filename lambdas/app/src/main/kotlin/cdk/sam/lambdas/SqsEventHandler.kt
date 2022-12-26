package cdk.sam.lambdas

import com.amazonaws.services.lambda.runtime.RequestHandler
import com.amazonaws.services.lambda.runtime.Context
import com.amazonaws.services.lambda.runtime.events.SQSEvent
import com.fasterxml.jackson.databind.ObjectMapper

class SqsEventHandler: RequestHandler<SQSEvent, Unit> {
  private val mapper = ObjectMapper()
  private val itemsHandler = ItemsHandler()
  override fun handleRequest(sqsEvent: SQSEvent, context: Context) {
    println("Example lambda with SQS Event")
    val dynamoTableName = System.getenv("TABLE_NAME")
    println("Dynamo table: $dynamoTableName")

    sqsEvent.records.forEach {
      println(it.body)
      val item = mapper.readValue(it.body, Item::class.java)
      itemsHandler.save(item)
      println("Saved item id: ${item.id}, content: ${item.content}")
    }
  }
}

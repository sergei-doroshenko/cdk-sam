package cdk.sam.lambdas

import com.amazonaws.services.lambda.runtime.RequestHandler
import com.amazonaws.services.lambda.runtime.Context
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent

class ApiEventHandler: RequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {
  override fun handleRequest(apiEvent: APIGatewayProxyRequestEvent, context: Context): APIGatewayProxyResponseEvent {
    println("Example lambda with Api Event")
    val body = apiEvent.body
    println("Got event body: $body")
    val queueName = System.getenv("QUEUE_URL")
    println("SQS: $queueName")
    println("Environment variables:")
    val allEnvs = System.getenv()
    allEnvs.forEach { (k, v) -> println("$k => $v") }

//    return mapOf("status" to "200")
    val response = APIGatewayProxyResponseEvent()
    response.statusCode = 200
    response.body = "Hello from Lambda!"
    return response
  }
}

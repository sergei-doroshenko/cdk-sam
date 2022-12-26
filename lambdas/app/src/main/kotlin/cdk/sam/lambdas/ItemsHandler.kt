package cdk.sam.lambdas

import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBQueryExpression

class ItemsHandler {
  private val client = AmazonDynamoDBClientBuilder.standard().build()
  private val mapper = DynamoDBMapper(client)

  fun save(item: Item) {
    mapper.save(item)
  }

  fun get(id: Int) : List<Item> {
    val partitionKey = Item()
    partitionKey.id = id
    val queryExpression: DynamoDBQueryExpression<Item> =
      DynamoDBQueryExpression<Item>()
        .withHashKeyValues(partitionKey)

    return mapper.query(Item::class.java, queryExpression)
  }
}

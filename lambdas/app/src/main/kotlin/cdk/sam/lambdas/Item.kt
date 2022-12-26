package cdk.sam.lambdas

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable
@DynamoDBTable(tableName="ProcessingEvents")
class Item {
  @DynamoDBHashKey(attributeName="Id")
  var id: String = "1"
  @DynamoDBAttribute(attributeName="content")
  var content: String = "DUMMY"
}

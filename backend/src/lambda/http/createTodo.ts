import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk' 
import 'source-map-support/register'
import { createTodo } from '../../businessLogic/todos'

const XAWS = AWSXRay.captureAWS(AWS)
const docClient = new XAWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    
    console.log("EVENT:", event);

    const parsedBody = JSON.parse(event.body)

    const authHeader = event.headers.Authorization
    const authSplit = authHeader.split(" ")
    const token = authSplit[1]

    console.log("test",token)
    const newTodo = await createTodo(parsedBody, token)

    return {
        statusCode: 201,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          newTodo
        })
    }
}
import {
  APIGatewayProxyEventV2,
  APIGatewayProxyStructuredResultV2,
} from "aws-lambda";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import * as cheerio from "cheerio";
import axios from "axios";

export interface Input {
  url: string;
  name: string;
}

export interface Output {
  title: string;
  s3Url: string;
}

export const storeInBucket = async (
  content: string,
  name: string
): Promise<string> => {
  const BUCKET = "simple-lambda-storage";
  const s3Client = new S3Client({ region: "ca-central-1" });
  const key = `${name}.html`;
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ContentType: "text/html",
    Body: Buffer.from(content),
  });
  await s3Client.send(command);
  return `https://${BUCKET}.s3.amazonaws.com/${key}`;
};

export const handler = async (
  event: APIGatewayProxyEventV2 | any
): Promise<APIGatewayProxyStructuredResultV2 | any> => {
  let output: Output = {
    title: "",
    s3Url: "",
  };

  try {
    const body = event.queryStringParameters as unknown as Input;
    const res = await axios.get(body.url);
    output.title = cheerio.load(res.data)("head > title").text();
    output.s3Url = await storeInBucket(res.data, body.name);
  } catch (error) {
    console.log(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(output),
  };
};

import { handler, Input, Output, storeInBucket } from "../index";
import { describe, it, jest, expect } from "@jest/globals";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

import axios from "axios";
import { beforeEach } from "node:test";

const invokeHandler = async (
  url: string,
  name: string
): Promise<Output | null> => {
  const output = await handler({
    queryStringParameters: { url, name },
  });

  let outputBody: Output | null = null;
  if (output) {
    outputBody = JSON.parse(output.body);
  }

  return outputBody;
};

// mock the axios module
jest.mock("axios");
// create the typed mocked function
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("url to title handler", () => {
  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    jest.clearAllMocks();
  });
  it("should return the title of html", async () => {
    const title = "Mock Title";
    // define the mock behavior
    mockedAxios.get.mockResolvedValue({
      data: `<html><head><title>${title}</title></head><body></body></html>`,
    });
    const output = await invokeHandler("https://news.ycombinator.com/", "");
    expect(output?.title).toEqual(title);
  });
});

//mock the s3 client

jest.mock("@aws-sdk/client-s3", () => {
  const actualModule: Object = jest.requireActual("@aws-sdk/client-s3");

  return {
    ...actualModule,
    S3Client: jest.fn(() => ({
      send: jest.fn(),
    })),
    PutObjectCommand: jest.fn(),
  };
});

describe("store in bucket", () => {
  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    jest.clearAllMocks();
  });
  const mockContent = "This is content";
  const mockName = "mock_name";

  const expectedKey = `${mockName}.html`;

  const expectedBucketName = "simple-lambda-storage";
  const expectedUrl = `https://${expectedBucketName}.s3.amazonaws.com/${expectedKey}`;

  it("should store bucket and return correct url", async () => {
    const result = await storeInBucket(mockContent, mockName);

    expect(S3Client).toHaveBeenCalledTimes(2);
    expect(PutObjectCommand).toHaveBeenCalledWith({
      Bucket: expectedBucketName,
      Key: expectedKey,
      ContentType: "text/html",
      Body: Buffer.from(mockContent),
    });

    expect(result).toBe(expectedUrl);
  });
});

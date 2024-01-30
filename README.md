# Simple Lambda Function

This repository contains a simple AWS Lambda function for fetching and storing web page data in an S3 bucket. Additionally, the `lambda-build` tool from [alexkrkn's repository](https://github.com/alexkrkn/lambda-build) is utilized for deployment from local to AWS.

## Functionality

- Fetches HTML content from a specified URL.
- Extracts the title of the web page.
- Stores the HTML content in an AWS S3 bucket.

## Environment

- AWS Lambda
- Node.js

## Usage

- The Lambda function is triggered with an event containing `url` and `name` parameters.
- The `handler` function processes the event and performs the fetching and storing operations.

## Testing

- Tests are written using Jest.
- Mocks are used for testing network requests and AWS S3 interactions.
- To run tests: `npm test`

## Deployment

- Uses `lambda-build` for deploying the Lambda function to AWS from the local environment.
- Run `npm run deploy` to deploy using `lambda-build`.

## Dependencies

- AWS SDK for JavaScript (v3)
- Axios for HTTP requests
- Cheerio for HTML parsing
- `lambda-build` for deployment

## Setup

- Ensure AWS credentials are configured.
- Install dependencies: `npm install`
- Deploy the function to AWS Lambda using `lambda-build`: `npm run deploy`

## Notes

- Ensure proper configuration of AWS S3 bucket and access permissions.
- The Lambda function should have necessary permissions to access S3.

import serverlessExpress from '@codegenie/serverless-express';
import type { Handler } from 'aws-lambda';
import { app } from './index.js';

let serverlessExpressInstance: Handler;

async function setup() {
  serverlessExpressInstance = serverlessExpress({ app });
  return serverlessExpressInstance;
}

export const handler: Handler = async (event, context, callback) => {
  if (!serverlessExpressInstance) {
    await setup();
  }
  return serverlessExpressInstance(event, context, callback);
};

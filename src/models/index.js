// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Bid } = initSchema(schema);

export {
  Bid
};
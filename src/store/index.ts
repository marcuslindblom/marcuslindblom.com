import { DocumentStore } from 'ravendb';
import { Posts_ByName } from './indexes/index';
import { templates } from '../data/templates.json';
import { MetadataDictionary } from 'ravendb/dist/Mapping/MetadataAsDictionary';
const certificate = import.meta.env.STRIFE_CERTIFICATE;

let authOptions = {
  certificate: Buffer.from(certificate, 'base64'),
  type: 'pfx',
  password: import.meta.env.STRIFE_CERTIFICATE_PASSWORD,
};

const store = new DocumentStore(
  import.meta.env.STRIFE_DATABASE_URLS.split(','),
  import.meta.env.STRIFE_DATABASE,
  authOptions
);

store.initialize();

await new Posts_ByName().execute(store);

// Create a bulk insert instance from the DocumentStore
const bulkInsert = store.bulkInsert();

// Store multiple documents
for (const template of templates) {
    await bulkInsert.store(template, `templates/${template.collection}`, MetadataDictionary.create({ '@collection': 'Templates' }));
}

// Persist the data - call finish
await bulkInsert.finish();

export default store;

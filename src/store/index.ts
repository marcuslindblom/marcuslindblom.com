import { DocumentStore } from 'ravendb';

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

export default store.initialize();
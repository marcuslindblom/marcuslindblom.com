import {
  AbstractJavaScriptIndexCreationTask,
  AbstractJavaScriptMultiMapIndexCreationTask,
} from 'ravendb';
import { templates } from '../../data/templates.json';
export class Content_ByUrl extends AbstractJavaScriptMultiMapIndexCreationTask {
  constructor() {
    super();

    for (const template of templates) {
      this.map(template.collection, (doc) => {
        const collection = doc['@metadata']['@collection'];
        if (doc.archived || template.disableURL) {
          return;
        }
        const visited = {};
        const slugs = [];
        let c = doc;
        let origin = doc.origin.id;
        let publishedDate = doc.publishedDate;
        do {
          if (c.slug) {
            slugs.unshift(c.slug);
          }
          if (visited[c.origin.id]) {
            break;
          }
          visited[c.origin.id] = true;
          c = load(c.origin.id, c.origin.collection);
        } while (c);
        const labels = [];
        if (doc.labels) {
          doc.labels.forEach((label) => {
            labels.push(load(label, 'Labels').name);
          });
        }
        return {
          name: doc.displayName,
          url: slugs.shift() + slugs.join('/'),
          origin: origin,
          collection: collection,
          publishedDate: publishedDate,
          published: publishedDate !== null,
          labels: labels,
        };
      });
    }

    // Will store the fields in the index
    this.store('url', 'Yes');
    this.store('origin', 'Yes');
    this.store('collection', 'Yes');
    this.store('publishedDate', 'Yes');
    this.store('published', 'Yes');

    // Enable the suggestion feature on index-field 'name'
    // this.suggestion("name");
  }
}
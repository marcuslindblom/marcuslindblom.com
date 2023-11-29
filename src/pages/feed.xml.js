import rss from '@astrojs/rss';
import sanitizeHtml from 'sanitize-html';
import store from '../store';

const session = store.openSession();

// Define an output param for getting the query stats
let stats;

const notes = await session
  .query({ indexName: 'Content/ByUrl' })
  .whereStartsWith('url', '/journal/')
  .whereEquals('published', true)
  .orderByDescending('publishedDate')
  .selectFields(['heading', 'summary', 'text', 'publishedDate', 'url'])
  .statistics(s => stats = s)
  .all();

// Get the query duration from the stats
const queryDuration = stats.durationInMs;
const lastQueryTime = stats.lastQueryTime;

fetch('https://in.logs.betterstack.com', {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer A7KB9aGyb4mzyWohkx7dbJkP'
  },
  method: 'POST',
  body: JSON.stringify({
    dt: lastQueryTime,
    queryDuration: queryDuration,
    message: 'Query duration for feed.xml is ' + queryDuration + ' ms'
  })
});

export async function GET(context) {

  return rss({
    title: 'Marcus Lindblom',
    description: 'RSS Feed for Marcus Lindblom',
    site: context.site,
    items: notes.map((post) => ({
      title: post.heading,
      pubDate: post.publishedDate,
      description: sanitizeHtml(post.summary),
      content: sanitizeHtml(post.text),
      // customData: post.data.customData,
      // Compute RSS link from post `slug`
      // This example assumes all posts are rendered as `/blog/[slug]` routes
      link: post.url,
    })),
  });
}
import rss from '@astrojs/rss';
import sanitizeHtml from 'sanitize-html';
import store from '../store';

const session = store.openSession();

const notes = await session
  .query({ indexName: 'Content/ByUrl' })
  .whereStartsWith('url', '/journal/')
  .whereEquals('published', true)
  .orderByDescending('publishedDate')
  .selectFields(['heading', 'summary', 'text', 'publishedDate', 'url'])
  .all();


export async function GET(context) {
  return rss({
    trailingSlash: false,
    title: 'Marcus Lindblom',
    description: 'RSS Feed for Marcus Lindblom',
    site: context.site,
    items: notes.filter(post => post.publishedDate).map((post) => ({
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

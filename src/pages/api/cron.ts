export async function GET({params, request}) {
  if (request.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return request.status(401).end('Unauthorized');
  }
  return new Response('Hello Cron!');
}
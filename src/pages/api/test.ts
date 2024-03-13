/* ssr server or hybrid required */
// export const prerender = false;
/**
 * @param {import('astro').APIContext} context
 * @returns {Response}
 */
export function POST({ request, params, context }) {
  return new Response(JSON.stringify({
    message: "This was a POST!"
  }));
}
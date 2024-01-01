import store from '../../store';

export async function GET({params, request}) {

  const session = store.openSession();
  let home = await session.load('fcc2e4e2-b7ce-443f-8da6-faac59919f46');
  console.log(home);

  const response = await fetch("https://vercel.com/api/web/insights/stats/path?projectId=prj_28rIVArb3nNoE9JewhDlUpF7wU2r&from=2023-12-24&to=2024-01-01", {
    headers: {Authorization: 'Bearer Q76DWcgS8vTsiQq7VQGhy4Nk'}
  });

  const data = await response.json();
  console.log(data);

  return new Response('Hello Cron!');
}
import store from '../../store';

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

export async function GET({ params, request }) {
  // Get today's date
  const today = new Date();

  const date1DaysAgo = new Date(today);
  date1DaysAgo.setDate(today.getDate() - 1);

  fetch(
    `https://vercel.com/api/web/insights/stats/path?projectId=prj_28rIVArb3nNoE9JewhDlUpF7wU2r&from=${formatDate(
      date1DaysAgo
    )}&to=${formatDate(today)}`,
    {
      headers: { Authorization: 'Bearer Q76DWcgS8vTsiQq7VQGhy4Nk' },
    }
  )
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
    })
    .then((stats) => {
      const session = store.openSession();
      stats.data.forEach(async (stat) => {
        const page = await session.query({ indexName: 'Content/ByUrl'}).whereEquals('url', stat.key).firstOrNull();
        if (page) {
          const tsf = session.timeSeriesFor(page.id, "Stats");
          tsf.append(today, [stat.total, stat.devices]);
          // page.analytics = {
          //   views: stat.total,
          //   visitors: stat.devices,
          //   date: `${formatDate(today)}T00:00:00.0000000`,
          //   pathName: stat.key
          // };
          console.log('Page updated:', [stat.total, stat.devices]);
          await session.saveChanges();
        }
      });
    });

  return new Response('OK');
}

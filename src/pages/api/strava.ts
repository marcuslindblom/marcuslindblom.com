import https from 'https';
import { stringify as querystringStringify } from 'querystring';
// import fs from 'fs';
import fs from 'node:fs/promises';
import store from '../../store';

const client_id = '130399';
const client_secret = 'c507f93e679ee890d99467574e22e1beb49ae97d';
// const refresh_token_file = 'src/scripts/refresh_token.json';
const refresh_token_file = new URL('../../scripts/refresh_token.json', import.meta.url);
let access_token = '';
let refresh_token = '';

try {
  await fs.access(refresh_token_file);
  const tokenData = JSON.parse(await fs.readFile(refresh_token_file, 'utf8'));
  refresh_token = tokenData.refresh_token;
} catch (err) {
  if (err.code === 'ENOENT') {
    console.error('No refresh token found. Obtain a refresh token first.');
    process.exit(1);
  } else {
    throw err;
  }
}

// console.log(data.refresh_token);
// if (fs.existsSync(refresh_token_file)) {
//   const tokenData = JSON.parse(fs.readFileSync(refresh_token_file, 'utf8'));
//   refresh_token = tokenData.refresh_token;
// } else {
//   console.error('No refresh token found. Obtain a refresh token first.');
//   process.exit(1);
// }

// Function to exchange refresh token for access token
const getAccessToken = async () => {
  const postData = querystringStringify({
    client_id,
    client_secret,
    refresh_token,
    grant_type: 'refresh_token',
  });

  const options = {
    hostname: 'www.strava.com',
    path: '/oauth/token',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': postData.length,
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        const parsedData = JSON.parse(data);
        access_token = parsedData.access_token;
        refresh_token = parsedData.refresh_token;

        // Save the new refresh token to file
        fs.writeFile(refresh_token_file, JSON.stringify({ refresh_token }));
        console.log('Access token obtained and saved.');
        resolve();
      });
    });

    req.on('error', (e) => {
      console.error(`Error obtaining access token: ${e.message}`);
      reject(e);
    });

    req.write(postData);
    req.end();
  });
};

// Function to fetch athlete activities
const fetchActivities = async () => {
  const options = {
    hostname: 'www.strava.com',
    path: '/api/v3/athlete/activities',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${access_token}`,
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', async () => {
        //console.log('Athlete Activities:', JSON.parse(data));
        const activities = JSON.parse(data);
        const session = store.openSession();
        activities.forEach(async (activity) => {
          console.log(`Saving activity: ${activity.name}`);
          activity['@metadata'] = { '@collection': 'Activities' };
          await session.store(activity, `Activities/${activity.id}`);
        });
        await session.saveChanges();
        resolve();
      });
    });

    req.on('error', (e) => {
      console.error(`Error fetching activities: ${e.message}`);
      reject(e);
    });

    req.end();
  });
};

// export default async function handler(request, response) {
//   await getAccessToken();
//   await fetchActivities();
//   response.status(200).json({ message: 'Activities fetched and saved.' });
// }

// Initial fetch
export async function GET({params, request}) {
  await getAccessToken();
  await fetchActivities();
  return new Response('Activities fetched and saved.');
}


import store from '../../store';

const client_id = import.meta.env.STRAVA_CLIENT_ID;
const client_secret = import.meta.env.STRAVA_CLIENT_SECRET;

async function getConfig(session) {
    const config = await session.load('Global/Config');
    if (!config || !config.refresh_token) {
        throw new Error('No refresh token found. Obtain a refresh token first.');
    }
    return config;
}

async function refreshStravaToken(client_id, client_secret, refresh_token) {
    const url = new URL('https://www.strava.com/oauth/token');
    const params = {
        client_id,
        client_secret,
        refresh_token,
        grant_type: 'refresh_token'
    };

    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Failed to refresh token');
    }

    const data = await response.json();
    return { access_token: data.access_token, refresh_token: data.refresh_token };
}

async function fetchStravaActivities(access_token) {
    const url = 'https://www.strava.com/api/v3/athlete/activities';

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'application/json'
        }
    }).catch(error => {
        console.error('Error:', error);
    });

    if (!response.ok) {
        throw new Error('Failed to fetch activities');
    }

    return await response.json();
}

async function fetchStravaDetailedActivity(access_token, activity_id) {
    const url = `https://www.strava.com/api/v3/activities/${activity_id}`;

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'application/json'
        }
    }).catch(error => {
        console.error('Error:', error);
    });

    if (!response.ok) {
        throw new Error('Failed to fetch detailed activity');
    }

    return await response.json();
}

export async function GET() {
    const session = store.openSession();
    try {
        const config = await getConfig(session);
        const { access_token, refresh_token: new_refresh_token } = await refreshStravaToken(client_id, client_secret, config.refresh_token);
        // Save the new refresh token
        config.refresh_token = new_refresh_token;
        await session.store(config, 'Global/Config');

        const activities = await fetchStravaActivities(access_token);
        const detailedActivities = await Promise.all(activities.map(activity => fetchStravaDetailedActivity(access_token, activity.id)));
        detailedActivities.forEach(async (activity) => {
            activity['@metadata'] = { '@collection': 'Activities' };
            await session.store(activity, `Activities/${activity.id}`);
        });
        await session.saveChanges();

        return new Response('Activities fetched and saved.');
    } catch (error) {
        console.error('Error:', error);
        return new Response(`Error: ${error.message}`, { status: 500 });
    }
}

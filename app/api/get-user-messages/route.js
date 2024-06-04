import axios from 'axios';

const DATA_API_URL = process.env.DATA_API_URL;
const API_KEY = process.env.API_KEY;
const DATABASE = process.env.DATABASE;
const COLLECTION = process.env.COLLECTION_ROOMS;

export const GET = async (req) => {
  const nickname = req.headers.get('nickname');

  if (!nickname) {
    return new Response(JSON.stringify({ message: 'Nickname is required' }), { status: 400 });
  }

  try {
    // console.log(`Fetching rooms for nickname: ${nickname}`);

    // Find rooms where messages array contains the user's nickname
    const response = await axios.post(`${DATA_API_URL}/action/find`, {
      dataSource: 'Cluster0',
      database: DATABASE,
      collection: COLLECTION,
      filter: { "messages.sender": nickname }
    }, {
      headers: {
        'Content-Type': 'application/json',
        'api-key': API_KEY
      }
    });

    const rooms = response.data.documents;
    // console.log(`Rooms found: ${JSON.stringify(rooms)}`);

    return new Response(JSON.stringify({ rooms }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
  }
};
export const fetchCache = 'force-no-store';
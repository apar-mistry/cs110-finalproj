import axios from 'axios';

const DATA_API_URL = process.env.DATA_API_URL;
const API_KEY = process.env.API_KEY;
const DATABASE = process.env.DATABASE;
const COLLECTION = process.env.COLLECTION_ROOMS;

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const roomId = searchParams.get('roomId');
  console.log(roomId);
  try {
    const response = await axios.post(`${DATA_API_URL}/action/findOne`, {
      dataSource: 'Cluster0',
      database: DATABASE,
      collection: COLLECTION,
      filter: { "roomId": roomId},
    }, {
      headers: {
        'Content-Type': 'application/json',
        'api-key': API_KEY,
      },
    });

    const data = response.data;

    if (data.document) {
      return new Response(JSON.stringify({ messages: data.document.messages }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } else {
      return new Response(JSON.stringify({ messages: [] }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
  } catch (error) {
    console.error('Error fetching messages:', error);
    return new Response(JSON.stringify({ success: false, error: 'Internal Server Error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

export const runtime = 'experimental-edge';


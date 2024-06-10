import axios from 'axios';

const DATA_API_URL = process.env.DATA_API_URL;
const API_KEY = process.env.API_KEY;
const DATABASE = process.env.DATABASE;
const COLLECTION = process.env.COLLECTION_ROOMS;

export async function POST(req) {
  try {
    const { roomId, message, nickname, messageId } = await req.json();

    const newMessage = {
      messageId,
      message,
      sender: nickname,
      timestamp: new Date().toISOString(),
    };

    const response = await axios.post(`${DATA_API_URL}/action/updateOne`, {
      dataSource: 'Cluster0',
      database: DATABASE,
      collection: COLLECTION,
      filter: { roomId: roomId },
      update: {
        $push: { messages: newMessage },
      },
    }, {
      headers: {
        'Content-Type': 'application/json',
        'api-key': API_KEY,
      },
    });

    if (response.data.matchedCount > 0) {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      });
    } else {
      return new Response(JSON.stringify({ success: false, error: 'Room not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      });
    }
  } catch (error) {
    console.error('Error posting message:', error);
    return new Response(JSON.stringify({ success: false, error: 'Internal Server Error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  }
}

export const runtime = 'experimental-edge';
export const fetchCache = 'force-no-store';

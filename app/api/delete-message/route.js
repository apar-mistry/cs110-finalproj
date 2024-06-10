import axios from 'axios';

const DATA_API_URL = process.env.DATA_API_URL;
const API_KEY = process.env.API_KEY;
const DATABASE = process.env.DATABASE;
const COLLECTION = process.env.COLLECTION_ROOMS;

export async function POST(req) {
try {
    const { roomId, messageId } = await req.json();

    const roomResponse = await axios.post(`${DATA_API_URL}/action/findOne`, {
    dataSource: 'Cluster0',
    database: DATABASE,
    collection: COLLECTION,
    filter: { roomId: roomId },
    }, {
    headers: {
        'Content-Type': 'application/json',
        'api-key': API_KEY,
    },
    });

    const room = roomResponse.data.document;
    if (!room || !room.messages) {
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

    const updatedMessages = room.messages.filter(msg => msg.messageId !== messageId);

    const updateResponse = await axios.post(`${DATA_API_URL}/action/updateOne`, {
        dataSource: 'Cluster0',
        database: DATABASE,
        collection: COLLECTION,
        filter: { roomId: roomId },
        update: {
        $set: {
            messages: updatedMessages,
        },
      },
    }, {
      headers: {
        'Content-Type': 'application/json',
        'api-key': API_KEY,
      },
    });

    if (updateResponse.data.matchedCount > 0) {
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
      return new Response(JSON.stringify({ success: false, error: 'Update failed' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      });
    }
  } catch (error) {
    console.error('Error deleting message:', error);
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

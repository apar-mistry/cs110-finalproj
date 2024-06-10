import axios from 'axios';

const DATA_API_URL = process.env.DATA_API_URL;
const API_KEY = process.env.API_KEY;
const DATABASE = process.env.DATABASE;
const COLLECTION = process.env.COLLECTION_ROOMS;

export async function DELETE(req) {
  try {
    const { roomId } = await req.json();

    const response = await axios.post(`${DATA_API_URL}/action/deleteOne`, {
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

    if (response.data.deletedCount > 0) {
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
    console.error('Error deleting room:', error);
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

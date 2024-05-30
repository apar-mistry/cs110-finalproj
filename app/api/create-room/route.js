import generateRoomIdentifier from '../../../utils/roomIdGenerator';

const DATA_API_URL = process.env.NEXT_PUBLIC_DATA_API_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
const DATABASE = process.env.DATABASE;
const COLLECTION = process.env.COLLECTION_ROOMS;

export async function POST(req) {
  try {
    const { roomName } = await req.json();
    const roomId = generateRoomIdentifier();

    const newRoom = {
      roomId,
      roomName,
      messages: [],
    };

    const response = await fetch(`${DATA_API_URL}/action/insertOne`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': API_KEY,
      },
      body: JSON.stringify({
        dataSource: 'Cluster0',
        database: DATABASE,
        collection: COLLECTION,
        document: newRoom,
      }),
    });

    const data = await response.json();

    if (data.insertedId) {
      return new Response(JSON.stringify({ success: true, roomId }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } else {
      return new Response(JSON.stringify({ success: false, error: 'Failed to create room' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
  } catch (error) {
    console.error('Error creating room:', error);
    return new Response(JSON.stringify({ success: false, error: 'Internal Server Error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

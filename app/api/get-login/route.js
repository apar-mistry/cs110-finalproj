import axios from 'axios';
import validator from 'validator';

const DATA_API_URL = process.env.DATA_API_URL;
const API_KEY = process.env.API_KEY;
const DATABASE = process.env.DATABASE;
const COLLECTION = process.env.COLLECTION_ROOMS;

export const POST = async (req) => {
  const { nickname, password } = await req.json();

  // Input sanitization and validation
  // if (!validator.isAlphanumeric(nickname) || !validator.isStrongPassword(password)) {
  //   return new Response(JSON.stringify({ message: 'Invalid input' }), { status: 400 });
  // }

  try {
    // Check if user exists with the provided nickname and password
    const findResponse = await axios.post(`${DATA_API_URL}/action/find`, {
      dataSource: 'Cluster0',
      database: DATABASE,
      collection: COLLECTION,
      filter: {
        nickname: { $eq: nickname },
        password: { $eq: password }
      }
    }, {
      headers: {
        'Content-Type': 'application/json',
        'api-key': API_KEY
      }
    });

    if (findResponse.data.documents.length === 0) {
      return new Response(JSON.stringify({ message: 'Invalid nickname or password' }), { status: 401 });
    }

    return new Response(JSON.stringify({ message: 'Login successful' }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
  }
};
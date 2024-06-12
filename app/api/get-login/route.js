import axios from 'axios';
import bcrypt from 'bcrypt';
import validator from 'validator';

const DATA_API_URL = process.env.DATA_API_URL;
const API_KEY = process.env.API_KEY;
const DATABASE = process.env.DATABASE;
const COLLECTION = process.env.COLLECTION_USERS;

export const POST = async (req) => {
  const { nickname, password } = await req.json();

  // Input sanitization and validation
  // if (!validator.isAlphanumeric(nickname) || !validator.isStrongPassword(password)) {
  //   return new Response(JSON.stringify({ message: 'Invalid input' }), { status: 400 });
  // }

  try {
    // Check if user exists with the provided nickname
    const findResponse = await axios.post(`${DATA_API_URL}/action/find`, {
      dataSource: 'Cluster0',
      database: DATABASE,
      collection: COLLECTION,
      filter: {
        nickname: { $eq: nickname }
      }
    }, {
      headers: {
        'Content-Type': 'application/json',
        'api-key': API_KEY
      }
    });

    const user = findResponse.data.documents[0];

    if (!user) {
      return new Response(JSON.stringify({ message: 'Invalid nickname or password' }), { status: 401 });
    }

    // Compare the entered password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return new Response(JSON.stringify({ message: 'Invalid nickname or password' }), { status: 401 });
    }

    return new Response(JSON.stringify({ message: 'Login successful' }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
  }
};

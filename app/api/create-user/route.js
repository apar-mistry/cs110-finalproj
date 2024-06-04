import axios from 'axios';
import validator from 'validator';

const DATA_API_URL = process.env.NEXT_PUBLIC_DATA_API_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
const DATABASE = process.env.DATABASE;
const COLLECTION = process.env.COLLECTION_USERS;

export const POST = async (req) => {
    const { nickname, email, password } = await req.json();
  
    // Input sanitization and validation
    // if (!validator.isAlphanumeric(nickname) || !validator.isEmail(email) || !validator.isStrongPassword(password)) {
    //   return new Response(JSON.stringify({ message: 'Invalid input' }), { status: 400 });
    // }
  
    try {
      // Check if nickname or email already exists
      const findResponse = await axios.post(`${DATA_API_URL}/action/find`, {
        dataSource: 'Cluster0',
        database: DATABASE,
        collection: COLLECTION,
        filter: {
          $or: [
            { nickname: { $eq: nickname } },
            { email: { $eq: email } }
          ]
        }
      }, {
        headers: {
          'Content-Type': 'application/json',
          'api-key': API_KEY
        }
      });
  
      if (findResponse.data.documents.length > 0) {
        return new Response(JSON.stringify({ message: 'Nickname or email already exists' }), { status: 409 });
      }
  
      // Create new user
      const createResponse = await axios.post(`${DATA_API_URL}/action/insertOne`, {
        dataSource: 'Cluster0',
        database: DATABASE,
        collection: COLLECTION,
        document: { nickname, email, password }
      }, {
        headers: {
          'Content-Type': 'application/json',
          'api-key': API_KEY
        }
      });
  
      return new Response(JSON.stringify({ message: 'User created successfully', user: createResponse.data.document }), { status: 201 });
    } catch (err) {
      console.error(err);
      return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
    }
  };
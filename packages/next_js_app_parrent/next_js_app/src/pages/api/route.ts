// src/pages/api/route.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { db, ensureDbInitialized } from '../../app/lib/db/index';
import { user } from '../../app/lib/db/schema';


interface User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
}

interface ResponseData {
  users?: User[];
  message?: string;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  switch (req.method) {
    case 'GET':
      return handleGetRequest(req, res);
    case 'POST':
      return handlePostRequest(req, res);
    default:
      return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
async function handleGetRequest(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  try {
    await ensureDbInitialized();
    
    if (!db) {
      throw new Error('Database not initialized');
    }

    const result = await db.select().from(user);
    
    if (!result.length) {
      return res.status(404).json({ message: 'No data found' });
    }
    
    // Convert result to ResponseData format
    const responseData: ResponseData = {
      users: result.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      })),
      message: 'Data retrieved successfully'
    };
    
    return res.status(200).json(responseData);
  } catch (error) {
    console.error('Error in GET request:', error);
    return res.status(500).json({ 
      message: 'An error occurred', 
    });
  }
}

async function handlePostRequest(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  try {
    const body = await req.body;

    if (!Array.isArray(body)) {
      throw new Error('Invalid input format. Expected an array of user objects.');
    }

    const usersToInsert = [];

    for (const userData of body) {
      if (!userData.name || !userData.email) {
        throw new Error(`Incomplete user data: ${JSON.stringify(userData)}`);
      }

      const user = {
        name: userData.name,
        email: userData.email,
        createdAt: new Date()
      };

      usersToInsert.push(user);
    }

    await ensureDbInitialized();

    if (!db) {
      throw new Error('Database not initialized');
    }

    const result = await db.insert(user).values(usersToInsert);

    return res.status(201).json({
      message: 'Users inserted successfully',

    });
  } catch (error) {
    console.error('Error inserting data:', error);
    return res.status(500).json({ message: 'An error occurred', });
  }
}
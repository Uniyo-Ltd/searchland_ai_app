import { eq } from 'drizzle-orm';
import { NextApiRequest, NextApiResponse } from 'next';
import { db, ensureDbInitialized } from '../../app/lib/db/index';
import { user } from '../../app/lib/db/schema';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'DELETE') {
      return res.status(405).json({ message: 'Method Not Allowed' });
    }
  
    await handleDeleteRequest(req, res);
  }

interface ResponseData {
  users: {
    id: number;
    name: string;
    email: string;
    createdAt: Date;
  }[];
  message: string;
}



interface User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
}

interface DeleteUserData {
    userId: number;
  }

  // ... (previous imports)
  
  async function handleDeleteRequest(req: NextApiRequest, res: NextApiResponse) {
    try {
      const { userId } = req.body as DeleteUserData;
  
      if (!userId || typeof userId !== 'number' || userId <= 0) {
        throw new Error('Invalid request. Invalid userId parameter.');
      }
  
      await ensureDbInitialized();
  
      if (!db) {
        throw new Error('Database not initialized');
      }
  
      const result = await db.delete(user).where(eq(user.id, userId));
  
      if (result) {
        res.status(200).json({ message: 'User deleted successfully', userId: userId });
      } else {
        res.status(404).json({ message: 'User not found', userId: userId });
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error in DELETE request:', error);
        res.status(500).json({ message: 'An error occurred', error: error.message });
      } else {
        console.error('Unknown error:', error);
        res.status(500).json({ message: 'An unknown error occurred' });
      }
    }
  }
  
  // ... (rest of the file remains the same)


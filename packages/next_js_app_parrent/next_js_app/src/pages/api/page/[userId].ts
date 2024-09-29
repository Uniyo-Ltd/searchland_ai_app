// pages/api/page/[userId].ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getUserById } from '../../../app/lib/services/users';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userId = req.query.userId;

  console.log('Received userId:', userId);

  if (!userId || typeof userId !== 'string' || isNaN(Number(userId))) {
    console.log('Invalid userId');
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  try {
    const user = await getUserById(Number(userId));
    console.log('Found user:', user);
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
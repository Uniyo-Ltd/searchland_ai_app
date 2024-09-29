// src/pages/api/users.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { db, ensureDbInitialized } from '../../app/lib/db/index';
import { user } from '../../app/lib/db/schema';
import { sql } from 'drizzle-orm';



interface User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
}

interface ResponseData {
  users?: User[];
  totalCount?: number;
  limit?: number;
  offset?: number;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    await ensureDbInitialized();
    
    if (!db) {
      throw new Error('Database not initialized');
    }

    let limit = 10;
    let offset = parseInt(req.query.offset as string) || 0;

    // Fetch total count using raw SQL
    const totalCountQuery = sql`
      SELECT COUNT(*) as count
      FROM ${sql.identifier("users")}
    `;
    const totalCountResult = await db.execute(totalCountQuery);
    const totalCount = totalCountResult.rows[0]?.count || 0;

    // Fetch paginated results
    const result = await db
      .select()
      .from(user)
      .limit(limit)
      .offset(offset);

    return res.status(200).json({
      users: result.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      })),
      totalCount: totalCountResult.rows[0]?.count as number,
      limit,
      offset
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
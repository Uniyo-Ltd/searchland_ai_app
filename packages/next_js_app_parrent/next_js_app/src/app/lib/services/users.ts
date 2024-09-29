   // lib/services/users.ts
   import { asc, gt } from 'drizzle-orm';
import { getDb } from '../db/index';
import { user } from '../db/schema';

   const db = await getDb();
   
   export async function createUser(name: string, email: string) {
    return await db?.insert(user).values({name, email}).returning();
  }

   export async function getAllUsers(page: number, limit: number) {
     const offset = (page - 1) * limit;
     return await db?.select().from(user).limit(limit).offset(offset);
   }

   export async function deleteUser(id: number) {
     return await db?.delete(user).where(eq(user.id, id));
   }

 export const nextUserPage = async (cursor?: number, pageSize = 3) => {
 return await db
 ?.select()
 .from(user)
 .where(cursor ? gt(user.id, cursor) : undefined)
 .limit(pageSize)
 .orderBy(asc(user.id));
};

import { eq } from 'drizzle-orm';

interface User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
}


export async function getUserById(id: number): Promise<User | null> {
  
  console.log('Searching for user with ID:', id);
  
  try {
    const query = db?.select().from(user).where(eq(user.id, id));
    if (!query) {
      throw new Error('Database connection is not established');
    }
    console.log('Query:', query.toString());
    
    const result = await query.then((rows) => rows);
    console.log('Result:', result);
    
    if (result.length === 0) {
      console.log('No rows found');
      return null;
    }
    
    const row = result[0];
    console.log('Found user:', row);
    
    return row as User;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

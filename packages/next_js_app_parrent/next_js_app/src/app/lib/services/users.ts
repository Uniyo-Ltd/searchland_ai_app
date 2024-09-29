   // lib/services/users.ts
   import { asc, eq, gt } from 'drizzle-orm';
import db from '../db/index';
import { user } from '../db/schema';

   export async function createUser(name: string, email: string) {
    return await db.insert(user).values({name, email}).returning();
  }

   export async function getAllUsers(page: number, limit: number) {
     const offset = (page - 1) * limit;
     return await db.select().from(user).limit(limit).offset(offset);
   }

   export async function deleteUser(id: number) {
     return await db.delete(user).where(eq(user.id, id));
   }

 export const nextUserPage = async (cursor?: number, pageSize = 3) => {
 return await db
 .select()
 .from(user)
 .where(cursor ? gt(user.id, cursor) : undefined)
 .limit(pageSize)
 .orderBy(asc(user.id));
};




import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const user = pgTable('users', {
    id: serial('id').primaryKey(),
    name: text('first_name').notNull(),
    email: text('last_name').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
   });


export type User = typeof user.$inferSelect; 
export type NewUser = typeof user.$inferInsert; 


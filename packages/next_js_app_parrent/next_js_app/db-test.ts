   // db-test.ts
   import { sql } from "drizzle-orm";
import { db, ensureDbInitialized } from './src/app/lib/db/index';

   async function testDBConnection() {
     try {
       await ensureDbInitialized();
       console.log('Database initialized:', !!db);

       if (db) {
         const result = await db.execute(sql`SELECT 1`);
         console.log('Database connection successful:', result);
       } else {
         console.error('Failed to initialize database');
       }
     } catch (error) {
       console.error('Error testing database connection:', error);
     }
   }

   testDBConnection();
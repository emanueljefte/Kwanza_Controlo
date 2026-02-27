import * as schema from "@/db/schema";
import { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';

import { eq } from 'drizzle-orm';

export const NotificationRepo = {
  save: async (db: ExpoSQLiteDatabase<typeof schema>, data: schema.NewNotification) => {
    return await db.insert(schema.notifications)
      .values(data)
      .onConflictDoUpdate({
        target: schema.notifications.id,
        set: data
      });
  },

  getAll: async (db: ExpoSQLiteDatabase<typeof schema>): Promise<schema.NotificationRecord[]> => {
    return await db.select().from(schema.notifications);
  },

  updateStatus: async (db: ExpoSQLiteDatabase<typeof schema>, id: string, enabled: boolean) => {
    return await db.update(schema.notifications)
      .set({ enabled })
      .where(eq(schema.notifications.id, id));
  }
};
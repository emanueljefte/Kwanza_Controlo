import * as schema from "@/db/schema";

import { eq } from "drizzle-orm";
import { db } from ".";

export const NotificationRepo = {
  save: async (data: schema.NewNotification) => {
    return await db
      .insert(schema.notifications)
      .values(data)
      .onConflictDoUpdate({
        target: schema.notifications.id,
        set: data,
      });
  },

  getAll: async (): Promise<schema.NotificationRecord[]> => {
    return await db.select().from(schema.notifications);
  },

  updateStatus: async (id: string, enabled: boolean) => {
    return await db
      .update(schema.notifications)
      .set({ enabled })
      .where(eq(schema.notifications.id, id));
  },
};

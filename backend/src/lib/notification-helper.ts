import { db, notificationsTable } from "@workspace/db";

export async function createNotification(
  userId: number,
  title: string,
  message: string,
  type: "info" | "success" | "warning" | "payment" | "result" | "enrollment" = "info"
) {
  try {
    await db.insert(notificationsTable).values({ userId, title, message, type, isRead: false });
  } catch {
    // Non-critical
  }
}

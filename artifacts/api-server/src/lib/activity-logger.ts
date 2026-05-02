import { db, activityLogsTable } from "@workspace/db";

export async function logActivity(
  userId: number | null,
  action: string,
  model: string,
  modelId: number | null,
  oldData: unknown,
  newData: unknown
) {
  try {
    await db.insert(activityLogsTable).values({
      userId,
      action,
      model,
      modelId,
      oldData: oldData as any,
      newData: newData as any,
    });
  } catch {
    // Non-critical — never throw
  }
}

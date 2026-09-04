// mobile/src/lib/offlineQueue.ts
//
// Quiz content itself is already fully local (mobile/src/data/mock.ts's
// getQuizQuestions runs with no network call), so a child can take a
// full quiz with zero connectivity already — the one part that wasn't
// offline-safe was recordQuizResult (childProgress.ts), which just
// lost that session's XP/score with an error toast if the device had
// no connection the moment the quiz finished. This queues that one
// write locally instead of dropping it, and PendingSyncHost
// (src/components/PendingSyncHost.tsx) replays the queue once
// connectivity returns.

import AsyncStorage from "@react-native-async-storage/async-storage";
import { getDeviceId } from "./deviceBinding";
import { getSupabaseClient } from "./supabase";

const QUEUE_KEY = "mkw.pendingQuizResults";

export type PendingQuizResult = {
  correct: number;
  total: number;
  xpEarned: number;
  category?: string;
  isBonus?: boolean;
  queuedAt: string;
};

async function readQueue(): Promise<PendingQuizResult[]> {
  try {
    const raw = await AsyncStorage.getItem(QUEUE_KEY);
    return raw ? (JSON.parse(raw) as PendingQuizResult[]) : [];
  } catch {
    return [];
  }
}

async function writeQueue(queue: PendingQuizResult[]): Promise<void> {
  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}

export async function enqueuePendingQuizResult(
  entry: Omit<PendingQuizResult, "queuedAt">,
): Promise<void> {
  const queue = await readQueue();
  queue.push({ ...entry, queuedAt: new Date().toISOString() });
  await writeQueue(queue);
}

export async function pendingQuizResultCount(): Promise<number> {
  return (await readQueue()).length;
}

let flushing = false;

/**
 * Replays every queued quiz result in order, oldest first. Stops at
 * the first one that still fails to reach the server (still offline,
 * or a genuine flakiness) and leaves it and everything after it
 * queued for next time — never drops or reorders a session's result.
 */
export async function flushPendingQuizResults(): Promise<void> {
  if (flushing) return;
  flushing = true;
  try {
    let queue = await readQueue();
    if (queue.length === 0) return;
    const deviceId = await getDeviceId();
    while (queue.length > 0) {
      const entry = queue[0];
      try {
        const { error } = await getSupabaseClient().functions.invoke("record-quiz-result", {
          body: {
            deviceId,
            correct: entry.correct,
            total: entry.total,
            xpEarned: entry.xpEarned,
            category: entry.category,
            isBonus: entry.isBonus,
          },
        });
        if (error) break;
      } catch {
        break;
      }
      queue = queue.slice(1);
      await writeQueue(queue);
    }
  } finally {
    flushing = false;
  }
}

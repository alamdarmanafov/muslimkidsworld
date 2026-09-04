// mobile/src/lib/contact.ts
//
// Parent-side "contact us" — a signed-in parent writes directly under
// their own RLS-scoped session (same shape as ./children.ts), and an
// admin replies from admin/index.html. Replaces the privacy policy's
// old, unconfigured "support email" line (see app/parent/privacy.tsx)
// with something a parent can actually use and check back on.

import { getSupabaseClient } from "./supabase";

export type ContactMessage = {
  id: string;
  subject: string | null;
  message: string;
  status: "open" | "answered" | "closed";
  adminReply: string | null;
  repliedAt: string | null;
  createdAt: string;
};

/** Sends a new contact message as the signed-in parent. Returns false on any failure. */
export async function sendContactMessage(message: string, subject?: string): Promise<boolean> {
  try {
    const {
      data: { user },
    } = await getSupabaseClient().auth.getUser();
    if (!user) return false;

    const { error } = await getSupabaseClient().from("contact_messages").insert({
      parent_id: user.id,
      subject: subject?.trim() || null,
      message: message.trim(),
    });
    return !error;
  } catch {
    return false;
  }
}

/** Fetches the signed-in parent's own contact messages, newest first. Returns null on any failure. */
export async function fetchContactMessages(): Promise<ContactMessage[] | null> {
  try {
    const { data, error } = await getSupabaseClient()
      .from("contact_messages")
      .select("id, subject, message, status, admin_reply, replied_at, created_at")
      .order("created_at", { ascending: false });
    if (error || !data) return null;

    return data.map((row) => ({
      id: row.id,
      subject: row.subject,
      message: row.message,
      status: row.status,
      adminReply: row.admin_reply,
      repliedAt: row.replied_at,
      createdAt: row.created_at,
    }));
  } catch {
    return null;
  }
}

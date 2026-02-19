import { supabase } from "./supabase";

function generateSlug() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function createEvent(title: string, youthName: string) {
  const slug = generateSlug();
  const { data, error } = await supabase
    .from("events")
    .insert({ title, youth_name: youthName, slug })
    .select("id, slug")
    .single();

  if (error) throw error;
  return { eventId: data.id, slug: data.slug };
}

export async function getEvent(slug: string) {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data;
}

export async function getEventById(id: string) {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data;
}

export async function getEventsBySlugs(slugs: string[]) {
  if (slugs.length === 0) return [];
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .in("slug", slugs)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

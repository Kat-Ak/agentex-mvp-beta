import { supabase } from "@/integrations/supabase/client";

export function getSessionId() {
  if (typeof window === "undefined") return "ssr";
  let id = localStorage.getItem("agentex_session");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("agentex_session", id);
  }
  return id;
}

export async function track(recurso: string, perfil: string | null) {
  try {
    await supabase.from("interactions").insert({ session_id: getSessionId(), recurso, perfil });
  } catch (e) {
    console.error(e);
  }
}

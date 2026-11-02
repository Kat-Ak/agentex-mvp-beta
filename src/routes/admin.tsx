import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Painel de Administração | AGENTEX" },
      { name: "description", content: "Leads e interações do AGENTEX (versão BETA)." },
      { property: "og:title", content: "Painel de Administração | AGENTEX" },
      { property: "og:description", content: "Leads e interações do AGENTEX (versão BETA)." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Admin,
});

type Lead = { id: string; session_id: string; nome: string | null; contato: string | null; perfil: string | null; status: string; entregas_pendentes: string | null; lembrete_retorno: string | null; created_at: string };
type Inter = { id: string; session_id: string; perfil: string | null; recurso: string; created_at: string };

function Admin() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });
    return () => data.subscription.unsubscribe();
  }, []);
  if (!ready) return null;
  return (
    <div className="min-h-screen bg-background font-sans">
      <nav className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="font-bold text-primary">🌐 AGENTEX <span className="text-xs font-normal text-muted-foreground">Admin</span></Link>
          {session && <button onClick={() => supabase.auth.signOut()} className="text-sm text-muted-foreground hover:underline">Sair</button>}
        </div>
      </nav>
      {session ? <Dashboard /> : <Login />}
    </div>
  );
}

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"in" | "up">("in");
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "in") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) toast.error(error.message);
    } else {
      const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin + "/admin" } });
      if (error) toast.error(error.message);
      else toast.success("Conta criada. Confirme pelo link enviado ao seu e-mail.");
    }
  };
  return (
    <form onSubmit={submit} className="mx-auto mt-16 max-w-sm space-y-3 rounded-lg border border-border bg-card p-6 shadow-sm">
      <h1 className="text-xl font-bold text-primary">{mode === "in" ? "Entrar no painel" : "Criar conta de administrador"}</h1>
      <p className="text-xs text-muted-foreground">A primeira conta criada vira administradora.</p>
      <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-mail" className="w-full rounded-md border border-input px-3 py-2 text-sm" />
      <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Senha" className="w-full rounded-md border border-input px-3 py-2 text-sm" />
      <button className="w-full rounded-lg bg-primary px-4 py-2.5 font-medium text-primary-foreground">{mode === "in" ? "Entrar" : "Criar conta"}</button>
      <button type="button" onClick={() => setMode(mode === "in" ? "up" : "in")} className="w-full text-xs text-muted-foreground hover:underline">
        {mode === "in" ? "Não tem conta? Criar" : "Já tem conta? Entrar"}
      </button>
    </form>
  );
}

function Dashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [inters, setInters] = useState<Inter[]>([]);
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", u.user!.id);
      if (!roles?.some((r) => r.role === "admin")) return setDenied(true);
      const [l, i] = await Promise.all([
        supabase.from("leads").select("*").order("created_at", { ascending: false }),
        supabase.from("interactions").select("*").order("created_at", { ascending: false }).limit(1000),
      ]);
      setLeads((l.data as Lead[]) ?? []);
      setInters((i.data as Inter[]) ?? []);
    })();
  }, []);

  const save = async (id: string, field: "entregas_pendentes" | "lembrete_retorno", value: string) => {
    const { error } = await supabase.from("leads").update(field === "entregas_pendentes" ? { entregas_pendentes: value } : { lembrete_retorno: value }).eq("id", id);
    if (error) toast.error("Erro ao salvar");
    else toast.success("Salvo");
  };

  if (denied) return <p className="mt-16 text-center text-muted-foreground">Sua conta não tem acesso de administrador.</p>;

  const recursosDe = (sid: string) => [...new Set(inters.filter((i) => i.session_id === sid).map((i) => i.recurso))].join(", ") || "—";

  return (
    <main className="mx-auto max-w-6xl space-y-10 px-4 py-10">
      <section>
        <h1 className="mb-4 text-2xl font-bold text-primary">Leads</h1>
        <div className="overflow-x-auto rounded-lg border border-border bg-card shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left text-primary">
              <tr>{["Nome do lead", "Perfil", "Recurso clicado", "Status", "Entregas pendentes", "Lembretes de retorno"].map((h) => <th key={h} className="p-3 font-semibold">{h}</th>)}</tr>
            </thead>
            <tbody>
              {leads.length === 0 && <tr><td colSpan={6} className="p-4 text-center text-muted-foreground">Nenhum lead ainda.</td></tr>}
              {leads.map((l) => (
                <tr key={l.id} className="border-t border-border align-top">
                  <td className="p-3"><div className="font-medium">{l.nome}</div><div className="text-xs text-muted-foreground">{l.contato}</div></td>
                  <td className="p-3">{l.perfil ?? "—"}</td>
                  <td className="p-3 text-xs">{recursosDe(l.session_id)}</td>
                  <td className="p-3">{l.status}</td>
                  <td className="p-3"><input defaultValue={l.entregas_pendentes ?? ""} onBlur={(e) => save(l.id, "entregas_pendentes", e.target.value)} className="w-full rounded border border-input px-2 py-1" /></td>
                  <td className="p-3"><input defaultValue={l.lembrete_retorno ?? ""} onBlur={(e) => save(l.id, "lembrete_retorno", e.target.value)} className="w-full rounded border border-input px-2 py-1" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section>
        <h2 className="mb-4 text-xl font-bold text-primary">Interações recentes</h2>
        <div className="overflow-x-auto rounded-lg border border-border bg-card shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left text-primary"><tr><th className="p-3">Data</th><th className="p-3">Perfil</th><th className="p-3">Recurso clicado</th></tr></thead>
            <tbody>
              {inters.map((i) => (
                <tr key={i.id} className="border-t border-border">
                  <td className="p-3">{new Date(i.created_at).toLocaleString("pt-BR")}</td>
                  <td className="p-3">{i.perfil ?? "—"}</td>
                  <td className="p-3">{i.recurso}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

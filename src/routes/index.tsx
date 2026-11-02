import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { getSessionId, track } from "@/lib/track";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AGENTEX | Gerenciador de fluxo de e-mail para comércio exterior" },
      { name: "description", content: "Priorize sua caixa de entrada por fuso horário e envie respostas de contingência multilíngues." },
      { property: "og:title", content: "AGENTEX | Gerenciador de fluxo de e-mail para comércio exterior" },
      { property: "og:description", content: "Priorize sua caixa de entrada por fuso horário e envie respostas de contingência multilíngues." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

const WHATSAPP_URL =
  "https://wa.me/5511982261412?text=" +
  encodeURIComponent("Olá! Quero falar com um consultor e ativar o Plano Pro 💠 do AGENTEX.");

type Perfil = "Importador" | "Exportador";
type Item = { id: string; flag: string; sigla: string; pais: string; idioma: string; hora: string };

const BOXES: { title: string; border: string; items: Item[]; text: string }[] = [
  {
    title: "🚨 Atendimento Prioritário",
    border: "border-t-priority",
    items: [{ id: "pt", flag: "🇵🇹", sigla: "PT", pais: "Portugal", idioma: "PT-PT [padrão internacional]", hora: "16:00" }],
    text: "Expediente encerrando em breve no destino (16h). Responda agora para garantir que seu e-mail possa ser lido ainda hoje.",
  },
  {
    title: "⏳ Atendimento em Espera Padrão",
    border: "border-t-waiting",
    items: [
      { id: "cl", flag: "🇨🇱", sigla: "CL", pais: "Chile", idioma: "ES", hora: "13:00" },
      { id: "us", flag: "🇺🇸", sigla: "US", pais: "Estados Unidos", idioma: "EN", hora: "12:00" },
    ],
    text: "Expediente em horário comercial pleno. Próximo da fila de atendimento. Respondendo hoje ainda pode ser lido hoje.",
  },
  {
    title: "🌙 Atendimento em Espera Estendido",
    border: "border-t-extended",
    items: [
      { id: "qa", flag: "🇶🇦", sigla: "QA", pais: "Catar", idioma: "EN", hora: "19:00" },
      { id: "jp", flag: "🇯🇵", sigla: "JP", pais: "Japão", idioma: "EN", hora: "01:00 (Madrugada)" },
    ],
    text: "Expediente encerrado. Último da fila. Procure responder hoje para ser lido fora do seu horário de expediente ou somente amanhã, respondendo amanhã só será lido depois de amanhã.",
  },
];

function Index() {
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [showPanel, setShowPanel] = useState(false);
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [zerarOpen, setZerarOpen] = useState(false);
  const [betaOpen, setBetaOpen] = useState(false);
  const [nome, setNome] = useState("");
  const [contato, setContato] = useState("");
  const [sending, setSending] = useState(false);

  const choose = (p: Perfil) => {
    setPerfil(p);
    track(`Perfil: ${p}`, p);
  };

  const submitBeta = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !contato.trim()) { toast.error("Preencha nome e contato."); return; }
    setSending(true);
    const { error } = await supabase.from("leads").insert({
      session_id: getSessionId(),
      nome: nome.trim().slice(0, 200),
      contato: contato.trim().slice(0, 200),
      perfil,
    });
    setSending(false);
    if (error) { toast.error("Não foi possível enviar. Tente novamente."); return; }
    track("Acesso antecipado Beta (formulário enviado)", perfil);
    toast.success("Obrigado! Você está na lista de acesso antecipado.");
    setBetaOpen(false);
    setNome("");
    setContato("");
  };

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <nav className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-3">
          <span className="text-xl">🌐</span>
          <span className="text-lg font-bold text-primary">AGENTEX</span>
          <span className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">(Versão BETA) v2 29/10/2026</span>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-4 py-12">
        <section className="text-center">
          <h1 className="text-3xl font-bold leading-tight text-primary md:text-5xl">
            <span className="font-extrabold tracking-tight">AGENTEX</span>{" "}
            <span className="font-semibold">| O gerenciador de fluxo de e-mail ideal para o comércio exterior</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground md:text-xl">O software inteligente desenvolvido para otimizar sua rotina diária</p>
          <div className="mx-auto mt-4 max-w-3xl space-y-4 text-muted-foreground">
            <p>
              Experimente o 🧭 Modo Priorizar Caixa de Entrada por um período de degustação grátis de 30 dias do Plano Padrão 🔹 e melhore seu timing comercial com uma rotina inteligente, respondendo primeiro quem ainda não encerrou o expediente, pois seus e-mails serão separados em 3 blocos de atendimento por prioridade baseado no fuso horário do país de origem.
            </p>
            <p>
              E caso perceba que não será possível responder a todos, 30 minutos antes do fim do expediente, envie respostas de contingência automáticas multilíngues padronizadas no idioma do país de origem do e-mail (PT-PT [padrão internacional], EN, ES), agradecendo pelo recebimento, explicando que o e-mail está em análise e logo dará um retorno definitivo, buscando ter um bom padrão no nível de relacionamento comercial, através de um único botão inteligente chamado 0️⃣ Modo Zerar Caixa de Entrada, recurso automático avançado premium 🔼 exclusivo para assinantes do Plano Pro 💠.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {(["Importador", "Exportador"] as Perfil[]).map((p) => (
              <button
                key={p}
                onClick={() => choose(p)}
                className={`rounded-full border px-5 py-2.5 text-sm font-medium transition-colors ${
                  perfil === p ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-primary hover:bg-accent"
                }`}
              >
                {p === "Importador" ? "📥 Atendo Fornecedores (Importador)" : "📤 Atendo Clientes (Exportador)"}
              </button>
            ))}
          </div>

          <div className="mx-auto mt-8 max-w-2xl rounded-lg border border-border bg-card p-4 shadow-sm">
            <p className="text-sm text-muted-foreground">5 e-mails recebidos em 29/10/2026 às 13:00 (horário do Brasil)</p>
            <div className="mt-3 flex flex-wrap justify-center gap-4 text-base font-medium">
              {["🇵🇹 PT", "🇨🇱 CL", "🇺🇸 US", "🇶🇦 QA", "🇯🇵 JP"].map((c) => (
                <span key={c}>{c}</span>
              ))}
            </div>
          </div>

          <button
            onClick={() => {
              setShowPanel(true);
              track("Modo priorizar caixa de entrada", perfil);
              setTimeout(() => document.getElementById("painel")?.scrollIntoView({ behavior: "smooth" }), 50);
            }}
            className="mt-8 rounded-lg bg-primary px-7 py-3 text-base font-semibold text-primary-foreground shadow-md transition-colors hover:bg-primary/90"
          >
            🧭 modo priorizar caixa de entrada
          </button>
        </section>

        {showPanel && (
          <section id="painel" className="mt-14 grid animate-in fade-in slide-in-from-bottom-4 gap-5 duration-500 md:grid-cols-3">
            {BOXES.map((b) => (
              <div key={b.title} className={`rounded-lg border border-border border-t-4 ${b.border} bg-card p-4 shadow-sm`}>
                <h2 className="text-lg font-bold text-primary">{b.title}</h2>
                <div className="mt-3 space-y-3">
                  {b.items.map((it) => (
                    <label
                      key={it.id}
                      className={`flex cursor-pointer items-start gap-3 rounded-md border border-border bg-card p-3 transition-opacity ${done[it.id] ? "opacity-50" : ""}`}
                    >
                      <input
                        type="checkbox"
                        className="mt-1 h-4 w-4 accent-primary"
                        checked={!!done[it.id]}
                        onChange={(e) => setDone((d) => ({ ...d, [it.id]: e.target.checked }))}
                      />
                      <span className={`text-sm ${done[it.id] ? "line-through" : ""}`}>
                        {it.flag} {it.sigla} [{it.pais}] | Idioma: {it.idioma} | Horário Local: {it.hora}
                      </span>
                    </label>
                  ))}
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{b.text}</p>
              </div>
            ))}
          </section>
        )}

        <section className="mt-14 text-center">
          <button
            onClick={() => {
              setZerarOpen(true);
              track("Modo zerar caixa de entrada (PRO)", perfil);
            }}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-6 py-3 font-semibold text-primary shadow-sm transition-colors hover:bg-accent"
          >
            0️⃣ modo zerar caixa de entrada
            <span className="rounded-md bg-pro-soft px-2 py-0.5 text-xs font-bold text-pro">PRO 💠</span>
          </button>
        </section>
      </main>

      <footer className="mt-10 border-t border-border bg-card py-10 text-center">
        <button
          onClick={() => {
            setBetaOpen(true);
            track("Quero acesso antecipado (Beta)", perfil);
          }}
          className="rounded-lg bg-gold px-6 py-3 font-semibold text-primary shadow-md transition-opacity hover:opacity-90"
        >
          <span className="font-bold text-gold-ink">β</span> Quero acesso antecipado ao AGENTEX (versão BETA)
        </button>
        <div className="mt-6">
          <Link to="/admin" className="text-xs text-muted-foreground hover:underline">Admin</Link>
        </div>
      </footer>

      <Dialog open={zerarOpen} onOpenChange={setZerarOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-primary">0️⃣ modo zerar caixa de entrada — minutas automáticas</DialogTitle>
            <DialogDescription>Respostas de contingência multilíngues do AGENTEX</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-sm">
            {[
              ["PT-PT [padrão internacional]", "Agradecemos o contacto. Confirmamos a receção do e-mail e informamos que a sua solicitação já se encontra em análise pela nossa equipa. Devido ao elevado volume de pedidos, daremos uma resposta definitiva o mais breve possível."],
              ["EN", "Thank you for your message. We have successfully received your email and our team is currently reviewing your request. Due to high demand, we will get back to you with a detailed response as soon as possible."],
              ["ES", "Gracias por su contacto. Confirmamos la recepción de su correo electrónico e informamos que nuestro equipo ya se encuentra analizando su solicitud. Debido a la alta demanda, le responderemos formalmente lo antes posible."],
            ].map(([l, t]) => (
              <div key={l} className="rounded-md border border-border bg-muted p-3">
                <p className="mb-1 text-xs font-bold text-primary">Versão {l}</p>
                <p>{t}</p>
              </div>
            ))}
            <p className="rounded-md border border-border bg-pro-soft p-3 text-foreground">
              Esta é uma demonstração do recurso do botão inteligente chamado [0️⃣ modo zerar caixa de entrada] de resposta automática multilíngue de contingência, recurso automático avançado premium 🔼 exclusivo para assinantes do Plano Pro 💠. Com ele nenhum e-mail ficará mais sem resposta! Envio de respostas automáticas no idioma do país de origem do e-mail, faltando 30 minutos para o fim do expediente.
            </p>
            <div className="text-center">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                onClick={() => track("Falar com Consultor (WhatsApp)", perfil)}
                className="inline-flex items-center rounded-lg bg-primary px-5 py-2.5 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Falar com Consultor e Ativar Plano Pro 💠
                <span className="ml-2 inline-block h-2 w-2 rounded-full bg-online shadow-[0_0_8px_var(--online)]" />
              </a>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={betaOpen} onOpenChange={setBetaOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-primary">β Acesso antecipado ao AGENTEX</DialogTitle>
            <DialogDescription>Deixe seu contato e avisaremos quando sua vaga estiver disponível.</DialogDescription>
          </DialogHeader>
          <form onSubmit={submitBeta} className="space-y-3">
            <input value={nome} onChange={(e) => setNome(e.target.value)} maxLength={200} placeholder="Seu nome" className="w-full rounded-md border border-input bg-card px-3 py-2 text-sm" />
            <input value={contato} onChange={(e) => setContato(e.target.value)} maxLength={200} placeholder="E-mail ou WhatsApp" className="w-full rounded-md border border-input bg-card px-3 py-2 text-sm" />
            <button disabled={sending} className="w-full rounded-lg bg-gold px-4 py-2.5 font-semibold text-primary disabled:opacity-60">
              {sending ? "Enviando..." : "Quero acesso antecipado"}
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

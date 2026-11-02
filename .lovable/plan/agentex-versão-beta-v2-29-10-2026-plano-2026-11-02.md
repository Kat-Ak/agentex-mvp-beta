# AGENTEX (Versão BETA v2 29/10/2026) — Plano

Single page following the mega prompt exactly, plus an /admin page backed by Lovable Cloud.

## Página principal (/)
- **Navbar:** 🌐 **AGENTEX** + etiqueta cinza "(Versão BETA) v2 29/10/2026".
- **Visual:** fundo gelo, títulos azul marinho, cards brancos com borda fina e sombra suave, fonte Segoe UI / fontes do sistema.
- **Seção 1:** título, subtítulo e texto explicativo copiados palavra por palavra; dois seletores (📥 Importador / 📤 Exportador); lista "5 e-mails recebidos..." com 🇵🇹 PT, 🇨🇱 CL, 🇺🇸 US, 🇶🇦 QA, 🇯🇵 JP; botão "🧭 modo priorizar caixa de entrada".
- **Seção 2 (aparece após o clique, com animação suave):** 3 caixinhas no estilo Google Keep (lado a lado no computador, empilhadas no celular), com borda superior laranja / amarela / azul, cards no formato "Bandeira Sigla [País] | Idioma | Horário Local", com horários fixos e justificativas. Ao marcar uma caixinha o texto fica riscado e esmaecido.
- **Seção 3:** botão "0️⃣ modo zerar caixa de entrada" com etiqueta roxa "PRO 💠". Ele abre uma janela com as 3 minutas (PT-PT, EN, ES), a mensagem de trava comercial e o botão "Falar com Consultor e Ativar Plano Pro 💠" com ponto verde "online", que abre o WhatsApp.
- **Rodapé:** botão âmbar "β Quero acesso antecipado ao AGENTEX (versão BETA)". Ele abre um formulário curto (nome, e-mail/WhatsApp) e salva o lead. No rodapé também fica um link discreto "Admin".

## Registro de interações (Lovable Cloud)
- Cada clique importante (perfil escolhido, priorizar, zerar, consultor, acesso antecipado) fica salvo junto com o perfil selecionado.
- O nome do lead é preenchido quando a pessoa envia o formulário Beta.

## Painel /admin
- Tabela com: nome do lead, perfil, recurso clicado, status (interessado na Beta), entregas pendentes, lembretes de retorno. Os dois últimos campos são editáveis.
- Protegido por login de administrador (e-mail e senha), para os leads não ficarem públicos.

## Suposições a confirmar
- O número de WhatsApp do consultor ainda não foi informado: vou usar um provisório até você enviar o real.
- A frase em espanhol da minuta tem palavras em português ("nosso equipo já"). Vou corrigir para "nuestro equipo ya", a menos que você prefira manter como está.

## Detalhes técnicos
- Tabelas: `leads` (nome, contato, perfil, status, entregas_pendentes, lembrete_retorno) e `interactions` (lead/session id, perfil, recurso, created_at). Usuários anônimos só podem inserir dados; leitura e edição exigem a função de admin (`user_roles` + `has_role`).
- Cores dos tokens em oklch no styles.css; head() com título e metadados em PT-BR para / e /admin.

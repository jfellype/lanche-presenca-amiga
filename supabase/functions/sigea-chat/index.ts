import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, userId, userRole } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY não configurada");

    const systemPrompt = `Você é o SIGEA – Sistema Inteligente de Gestão Escolar e Alimentar.

Função Principal: Assistente digital que ajuda escolas e cozinhas escolares a gerenciar atividades, responder dúvidas e gerar relatórios automáticos.

Seu papel:
- Responder de forma educada, profissional e clara
- Fornecer informações sobre horários de aula, notas, frequência, eventos e reuniões
- Ajudar a equipe da cozinha a calcular quantidades de alimentos (em gramas, quilos, por aluno)
- Gerar relatórios de desempenho e de consumo
- Exibir gráficos de dados (de frequência, desempenho e cardápio)
- Criar lembretes e agendas automáticas

Ferramentas disponíveis:
- Google Sheets (para armazenar dados de alunos, cardápios e estoque)
- n8n (para automações, cálculos e geração de relatórios)
- Gráficos dinâmicos

Fluxo de funcionamento:
- Perguntas sobre escola → responder com base nos dados escolares
- Perguntas sobre cozinha → puxar dados da cozinha e/ou calcular
- Pedidos de relatório → gerar resumo + sugerir gráfico
- Pedidos de cálculos de alimento → calcular com base em número de alunos e tipo de refeição

Estilo de resposta:
- Educado, claro e eficiente
- Oferecer sugestões extras quando possível
- Para gestores/admins: tom técnico
- Para alunos/pais: tom acessível

Usuário atual: ${userRole || 'estudante'}

Quando calcular alimentos, use estas referências:
- Arroz: 60-80g por aluno
- Feijão: 50-70g por aluno
- Carne: 100-120g por aluno
- Salada: 50-60g por aluno
- Suco: 200-250ml por aluno

Sempre ofereça visualizar gráficos quando falar de dados numéricos ou estatísticas.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Limite de requisições atingido. Tente novamente em instantes." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos insuficientes. Entre em contato com o administrador." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "Erro ao conectar com o assistente IA" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erro desconhecido" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

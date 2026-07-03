import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Wallet, PieChart, Bell, Sparkles, TrendingUp, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/")({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session) throw redirect({ to: "/dashboard" });
  },
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl gradient-primary shadow-elegant">
            <Wallet className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-lg font-bold">Finanças Borges Souza</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/auth" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Entrar
          </Link>
          <Link
            to="/auth"
            search={{ mode: "signup" }}
            className="rounded-full gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-elegant transition hover:brightness-110"
          >
            Criar conta
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-12 pb-24 text-center">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground shadow-card">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          Feito para a sua família
        </div>
        <h1 className="mt-6 font-display text-5xl font-extrabold tracking-tight md:text-6xl">
          Controle financeiro <span className="bg-clip-text text-transparent gradient-primary">familiar</span>
          <br className="hidden md:block" /> simples e inteligente.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Cada integrante da família cadastra suas despesas. O sistema calcula parcelas automaticamente,
          organiza por mês, gera relatórios e mostra tudo em um dashboard bonito.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/auth"
            search={{ mode: "signup" }}
            className="rounded-full gradient-primary px-8 py-3 text-sm font-semibold text-primary-foreground shadow-elegant transition hover:brightness-110"
          >
            Começar agora — grátis
          </Link>
          <Link to="/auth" className="rounded-full border border-border bg-card px-8 py-3 text-sm font-semibold hover:bg-accent hover:text-accent-foreground">
            Já tenho conta
          </Link>
        </div>

        {/* Features */}
        <div className="mt-20 grid gap-6 md:grid-cols-3">
          {[
            { icon: PieChart, title: "Dashboards elegantes", desc: "Gráficos animados de gastos por categoria, mês e pessoa." },
            { icon: TrendingUp, title: "Parcelas automáticas", desc: "Cadastre uma compra 12x e o sistema distribui em 12 meses." },
            { icon: Bell, title: "Alertas inteligentes", desc: "Aviso de vencimento, parcelas que finalizam e contas atrasadas." },
            { icon: ShieldCheck, title: "Seguro por padrão", desc: "Cada usuário vê apenas seus dados; admin vê o total da família." },
            { icon: Wallet, title: "Metas financeiras", desc: "Defina objetivos e acompanhe o progresso em tempo real." },
            { icon: Sparkles, title: "Tema claro e escuro", desc: "Interface moderna inspirada em Nubank, Inter e Notion." },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl border border-border bg-card p-6 text-left shadow-card transition hover:-translate-y-1 hover:shadow-elegant">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

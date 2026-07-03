import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { toast } from "sonner";
import { Wallet, Loader2 } from "lucide-react";

const searchSchema = z.object({ mode: z.enum(["signin", "signup"]).optional() });

export const Route = createFileRoute("/auth")({
  ssr: false,
  validateSearch: searchSchema,
  component: AuthPage,
});

function AuthPage() {
  const { mode } = Route.useSearch();
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(mode === "signup");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ nome: "", sobrenome: "", email: "", senha: "" });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignup) {
        const { error } = await supabase.auth.signUp({
          email: form.email,
          password: form.senha,
          options: {
            emailRedirectTo: window.location.origin,
            data: { nome: form.nome, sobrenome: form.sobrenome, full_name: `${form.nome} ${form.sobrenome}`.trim() },
          },
        });
        if (error) throw error;
        toast.success("Conta criada! Bem-vindo(a) à família.");
        navigate({ to: "/dashboard" });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.senha });
        if (error) throw error;
        toast.success("Bem-vindo(a) de volta!");
        navigate({ to: "/dashboard" });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao autenticar");
    } finally {
      setLoading(false);
    }
  };

  const google = async () => {
    setLoading(true);
    try {
      const res = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
      if (res.error) throw res.error;
      if (!res.redirected) navigate({ to: "/dashboard" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro no Google");
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left - hero */}
      <div className="relative hidden overflow-hidden gradient-hero lg:block">
        <div className="absolute inset-0 opacity-30 [background:radial-gradient(circle_at_20%_20%,white,transparent_40%),radial-gradient(circle_at_80%_60%,white,transparent_40%)]" />
        <div className="relative flex h-full flex-col justify-between p-12 text-primary-foreground">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/15 backdrop-blur">
              <Wallet className="h-5 w-5" />
            </div>
            <span className="font-display font-bold">Finanças Borges Souza</span>
          </Link>
          <div>
            <h2 className="font-display text-4xl font-extrabold leading-tight">
              A família toda no controle das finanças.
            </h2>
            <p className="mt-4 max-w-md text-white/85">
              Parcelas automáticas, dashboards em tempo real e visão consolidada da família.
              Simples, bonito e seguro.
            </p>
          </div>
          <div className="text-sm text-white/70">© {new Date().getFullYear()} Família Borges Souza</div>
        </div>
      </div>

      {/* Right - form */}
      <div className="flex items-center justify-center bg-background p-6">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="grid h-9 w-9 place-items-center rounded-xl gradient-primary">
              <Wallet className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold">Finanças Borges Souza</span>
          </div>

          <h1 className="font-display text-3xl font-extrabold">
            {isSignup ? "Criar conta" : "Bem-vindo(a) de volta"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {isSignup ? "Junte-se à família Borges Souza." : "Entre para acompanhar suas finanças."}
          </p>

          <button
            onClick={google}
            disabled={loading}
            className="mt-8 flex w-full items-center justify-center gap-3 rounded-full border border-border bg-card py-3 text-sm font-semibold shadow-card transition hover:bg-accent hover:text-accent-foreground disabled:opacity-60"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.98.66-2.24 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"/><path fill="#FBBC05" d="M5.84 14.11A6.6 6.6 0 0 1 5.48 12c0-.73.13-1.44.36-2.11V7.05H2.18A11 11 0 0 0 1 12c0 1.77.42 3.45 1.18 4.95l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/></svg>
            Continuar com Google
          </button>

          <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="h-px flex-1 bg-border" /> ou com e-mail <div className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={submit} className="space-y-3">
            {isSignup && (
              <div className="grid grid-cols-2 gap-3">
                <input required placeholder="Nome" value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30" />
                <input required placeholder="Sobrenome" value={form.sobrenome}
                  onChange={(e) => setForm({ ...form, sobrenome: e.target.value })}
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30" />
              </div>
            )}
            <input required type="email" placeholder="E-mail" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30" />
            <input required type="password" placeholder="Senha" minLength={6} value={form.senha}
              onChange={(e) => setForm({ ...form, senha: e.target.value })}
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30" />

            <button type="submit" disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-full gradient-primary py-3 text-sm font-semibold text-primary-foreground shadow-elegant transition hover:brightness-110 disabled:opacity-60">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSignup ? "Criar conta" : "Entrar"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {isSignup ? "Já tem conta?" : "Não tem conta ainda?"}{" "}
            <button onClick={() => setIsSignup((v) => !v)} className="font-semibold text-primary hover:underline">
              {isSignup ? "Entrar" : "Criar conta"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

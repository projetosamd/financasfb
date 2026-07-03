import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { brl, formatDate } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/perfil")({
  ssr: false,
  component: ProfilePage,
});

function ProfilePage() {
  const qc = useQueryClient();
  const [form, setForm] = useState({ nome: "", sobrenome: "", foto_url: "" });

  const { data } = useQuery({
    queryKey: ["profile-me"],
    queryFn: async () => {
      const { data: auth } = await supabase.auth.getUser();
      const uid = auth.user!.id;
      const [profile, expenses, installments] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", uid).maybeSingle(),
        supabase.from("expenses").select("id, valor_total").eq("user_id", uid),
        supabase.from("installments").select("id").eq("user_id", uid),
      ]);
      return {
        profile: profile.data,
        expenseCount: expenses.data?.length ?? 0,
        totalSpent: expenses.data?.reduce((s, e: any) => s + Number(e.valor_total), 0) ?? 0,
        installCount: installments.data?.length ?? 0,
      };
    },
  });

  useEffect(() => {
    if (data?.profile) setForm({ nome: data.profile.nome, sobrenome: data.profile.sobrenome, foto_url: data.profile.foto_url ?? "" });
  }, [data]);

  const save = useMutation({
    mutationFn: async () => {
      const { data: auth } = await supabase.auth.getUser();
      const { error } = await supabase.from("profiles").update({
        nome: form.nome, sobrenome: form.sobrenome, foto_url: form.foto_url || null,
      }).eq("id", auth.user!.id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Perfil atualizado"); qc.invalidateQueries(); },
    onError: (e: any) => toast.error(e.message),
  });

  if (!data?.profile) return <div className="animate-pulse space-y-3"><div className="h-32 rounded-2xl bg-muted" /></div>;

  const initials = ((data.profile.nome?.[0] ?? "") + (data.profile.sobrenome?.[0] ?? "")).toUpperCase() || "?";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-extrabold">Perfil</h1>
        <p className="text-sm text-muted-foreground">Gerencie suas informações</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card lg:col-span-2">
          <form onSubmit={(e) => { e.preventDefault(); save.mutate(); }} className="space-y-4">
            <div className="flex items-center gap-4">
              {form.foto_url ? (
                <img src={form.foto_url} alt="" className="h-20 w-20 rounded-full border-4 border-primary/20 object-cover" />
              ) : (
                <div className="grid h-20 w-20 place-items-center rounded-full gradient-primary font-display text-2xl font-extrabold text-primary-foreground shadow-elegant">
                  {initials}
                </div>
              )}
              <div className="flex-1">
                <input placeholder="URL da foto (opcional)" value={form.foto_url}
                  onChange={(e) => setForm({ ...form, foto_url: e.target.value })}
                  className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm" />
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="space-y-1">
                <span className="text-xs font-medium text-muted-foreground">Nome</span>
                <input required value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm" />
              </label>
              <label className="space-y-1">
                <span className="text-xs font-medium text-muted-foreground">Sobrenome</span>
                <input value={form.sobrenome} onChange={(e) => setForm({ ...form, sobrenome: e.target.value })}
                  className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm" />
              </label>
            </div>
            <label className="block space-y-1">
              <span className="text-xs font-medium text-muted-foreground">E-mail</span>
              <input disabled value={data.profile.email} className="w-full rounded-xl border border-input bg-muted px-4 py-2.5 text-sm text-muted-foreground" />
            </label>
            <button type="submit" className="rounded-full gradient-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-elegant hover:brightness-110">
              Salvar alterações
            </button>
          </form>
        </div>

        <div className="space-y-3">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <p className="text-xs font-medium text-muted-foreground">Membro desde</p>
            <p className="mt-1 font-display text-lg font-bold">{formatDate(data.profile.created_at)}</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <p className="text-xs font-medium text-muted-foreground">Total gasto</p>
            <p className="mt-1 font-display text-lg font-bold">{brl(data.totalSpent)}</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <p className="text-xs font-medium text-muted-foreground">Nº despesas</p>
            <p className="mt-1 font-display text-lg font-bold">{data.expenseCount}</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <p className="text-xs font-medium text-muted-foreground">Nº parcelas</p>
            <p className="mt-1 font-display text-lg font-bold">{data.installCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

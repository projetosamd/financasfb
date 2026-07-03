import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { brl } from "@/lib/format";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Target } from "lucide-react";

export const Route = createFileRoute("/_authenticated/metas")({
  ssr: false,
  component: GoalsPage,
});

function GoalsPage() {
  const qc = useQueryClient();
  const [form, setForm] = useState({ titulo: "", valor_meta: "", valor_atual: "0" });

  const { data: goals } = useQuery({
    queryKey: ["goals"],
    queryFn: async () => {
      const { data: auth } = await supabase.auth.getUser();
      const { data } = await supabase.from("goals").select("*").eq("user_id", auth.user!.id).order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const create = useMutation({
    mutationFn: async () => {
      const { data: auth } = await supabase.auth.getUser();
      const { error } = await supabase.from("goals").insert({
        user_id: auth.user!.id,
        titulo: form.titulo,
        valor_meta: Number(form.valor_meta),
        valor_atual: Number(form.valor_atual),
      });
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Meta criada!"); qc.invalidateQueries({ queryKey: ["goals"] }); setForm({ titulo: "", valor_meta: "", valor_atual: "0" }); },
    onError: (e: any) => toast.error(e.message),
  });

  const update = useMutation({
    mutationFn: async ({ id, valor_atual }: { id: string; valor_atual: number }) => {
      const { error } = await supabase.from("goals").update({ valor_atual }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["goals"] }),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("goals").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Meta excluída"); qc.invalidateQueries({ queryKey: ["goals"] }); },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-extrabold">Metas Financeiras</h1>
        <p className="text-sm text-muted-foreground">Defina objetivos e acompanhe o progresso</p>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); create.mutate(); }}
        className="grid gap-3 rounded-2xl border border-border bg-card p-5 shadow-card md:grid-cols-[1fr_180px_180px_auto]">
        <input required placeholder="Título da meta (ex: Viagem à praia)" value={form.titulo}
          onChange={(e) => setForm({ ...form, titulo: e.target.value })}
          className="rounded-xl border border-input bg-background px-4 py-2.5 text-sm" />
        <input required type="number" step="0.01" placeholder="Valor da meta" value={form.valor_meta}
          onChange={(e) => setForm({ ...form, valor_meta: e.target.value })}
          className="rounded-xl border border-input bg-background px-4 py-2.5 text-sm" />
        <input type="number" step="0.01" placeholder="Já guardado" value={form.valor_atual}
          onChange={(e) => setForm({ ...form, valor_atual: e.target.value })}
          className="rounded-xl border border-input bg-background px-4 py-2.5 text-sm" />
        <button className="inline-flex items-center justify-center gap-2 rounded-full gradient-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-elegant hover:brightness-110">
          <Plus className="h-4 w-4" /> Criar
        </button>
      </form>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {goals?.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground md:col-span-2 lg:col-span-3">
            <Target className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-2">Nenhuma meta ainda. Crie a primeira!</p>
          </div>
        )}
        {goals?.map((g: any) => {
          const pct = Math.min(100, (Number(g.valor_atual) / Number(g.valor_meta)) * 100);
          return (
            <div key={g.id} className="rounded-2xl border border-border bg-card p-5 shadow-card">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-display text-lg font-bold">{g.titulo}</p>
                  <p className="text-xs text-muted-foreground">Meta: {brl(g.valor_meta)}</p>
                </div>
                <button onClick={() => confirm("Excluir esta meta?") && del.mutate(g.id)} className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold">{brl(g.valor_atual)}</span>
                  <span className="text-muted-foreground">{pct.toFixed(0)}%</span>
                </div>
                <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-muted">
                  <div className="h-full gradient-primary transition-all" style={{ width: `${pct}%` }} />
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <input type="number" step="0.01" defaultValue={g.valor_atual}
                  onBlur={(e) => {
                    const v = Number(e.target.value);
                    if (v !== Number(g.valor_atual)) update.mutate({ id: g.id, valor_atual: v });
                  }}
                  className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-sm" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

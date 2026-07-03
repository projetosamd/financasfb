import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { brl, formatDate, MESES } from "@/lib/format";
import { useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, Clock, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/_authenticated/parcelas")({
  ssr: false,
  component: InstallmentsPage,
});

function InstallmentsPage() {
  const qc = useQueryClient();
  const now = new Date();
  const [mes, setMes] = useState<string>(String(now.getMonth() + 1));
  const [ano, setAno] = useState<string>(String(now.getFullYear()));
  const [status, setStatus] = useState<string>("");
  const [scope, setScope] = useState<"mine" | "family">("family");

  const { data, isLoading } = useQuery({
    queryKey: ["installments-list"],
    queryFn: async () => {
      await supabase.rpc("mark_overdue_installments" as any).then(() => {}, () => {});
      const [inst, exp, cats, me] = await Promise.all([
        supabase.from("installments").select("*").order("vencimento"),
        supabase.from("expenses").select("id, descricao, category_id, user_id"),
        supabase.from("categories").select("*"),
        supabase.auth.getUser(),
      ]);
      return {
        installments: inst.data ?? [],
        expenses: exp.data ?? [],
        categories: cats.data ?? [],
        me: me.data.user?.id,
      };
    },
  });

  const setStatusMut = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "paga" | "aberta" }) => {
      const { error } = await supabase.from("installments").update({
        status,
        data_pagamento: status === "paga" ? new Date().toISOString().slice(0, 10) : null,
      }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Atualizado"); qc.invalidateQueries(); },
    onError: (e: any) => toast.error(e.message),
  });

  if (isLoading || !data) return <div className="grid gap-4">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-16 animate-pulse rounded-xl bg-muted" />)}</div>;

  const filtered = data.installments.filter((i: any) => {
    if (mes && i.mes !== Number(mes)) return false;
    if (ano && i.ano !== Number(ano)) return false;
    if (status && i.status !== status) return false;
    if (scope === "mine" && i.user_id !== data.me) return false;
    return true;
  });

  const total = filtered.reduce((s: number, i: any) => s + Number(i.valor), 0);

  const years = Array.from(new Set(data.installments.map((i: any) => i.ano as number))).sort();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-extrabold">Parcelas</h1>
        <p className="text-sm text-muted-foreground">Todas as parcelas geradas automaticamente pelo sistema</p>
      </div>

      <div className="flex flex-wrap gap-3 rounded-2xl border border-border bg-card p-4 shadow-card">
        <select value={scope} onChange={(e) => setScope(e.target.value as any)} className="rounded-xl border border-input bg-background px-3 py-2 text-sm">
          <option value="family">Família</option>
          <option value="mine">Somente eu</option>
        </select>
        <select value={mes} onChange={(e) => setMes(e.target.value)} className="rounded-xl border border-input bg-background px-3 py-2 text-sm">
          <option value="">Todos os meses</option>
          {MESES.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
        </select>
        <select value={ano} onChange={(e) => setAno(e.target.value)} className="rounded-xl border border-input bg-background px-3 py-2 text-sm">
          <option value="">Todos os anos</option>
          {years.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-xl border border-input bg-background px-3 py-2 text-sm">
          <option value="">Todos status</option>
          <option value="aberta">Em aberto</option>
          <option value="paga">Paga</option>
          <option value="atrasada">Atrasada</option>
        </select>
        <div className="ml-auto text-sm">
          <span className="text-muted-foreground">Total filtrado: </span>
          <span className="font-display text-lg font-bold text-primary">{brl(total)}</span>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-5 py-3">Descrição</th>
              <th className="px-5 py-3">Categoria</th>
              <th className="px-5 py-3">Parcela</th>
              <th className="px-5 py-3">Vencimento</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Valor</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && <tr><td colSpan={7} className="p-10 text-center text-muted-foreground">Nenhuma parcela para esse filtro</td></tr>}
            {filtered.map((i: any) => {
              const exp = data.expenses.find((e: any) => e.id === i.expense_id);
              const cat = data.categories.find((c: any) => c.id === exp?.category_id);
              return (
                <tr key={i.id} className="border-t border-border hover:bg-accent/40">
                  <td className="px-5 py-3 font-medium">{exp?.descricao ?? "-"}</td>
                  <td className="px-5 py-3">
                    <span className="inline-flex rounded-full px-2.5 py-1 text-xs font-medium"
                      style={{ backgroundColor: `${cat?.cor ?? "#8B5CF6"}20`, color: cat?.cor ?? "#8B5CF6" }}>
                      {cat?.nome ?? "-"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{i.numero}</td>
                  <td className="px-5 py-3 text-muted-foreground">{formatDate(i.vencimento)}</td>
                  <td className="px-5 py-3">
                    {i.status === "paga" && <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2.5 py-1 text-xs font-medium text-success"><CheckCircle2 className="h-3 w-3" /> Paga</span>}
                    {i.status === "aberta" && <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"><Clock className="h-3 w-3" /> Aberta</span>}
                    {i.status === "atrasada" && <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2.5 py-1 text-xs font-medium text-destructive"><AlertTriangle className="h-3 w-3" /> Atrasada</span>}
                  </td>
                  <td className="px-5 py-3 text-right font-semibold">{brl(i.valor)}</td>
                  <td className="px-5 py-3 text-right">
                    {i.user_id === data.me && (
                      i.status === "paga" ? (
                        <button onClick={() => setStatusMut.mutate({ id: i.id, status: "aberta" })} className="text-xs font-medium text-muted-foreground hover:text-primary">Marcar aberta</button>
                      ) : (
                        <button onClick={() => setStatusMut.mutate({ id: i.id, status: "paga" })} className="text-xs font-medium text-primary hover:underline">Marcar paga</button>
                      )
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

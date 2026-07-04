import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { brl, formatDate, formatBrlInput, parseBrlToNumber } from "@/lib/format";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, X, Loader2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/despesas")({
  ssr: false,
  component: ExpensesPage,
});

type ExpenseForm = {
  descricao: string;
  category_id: string;
  valor_total: string;
  data_compra: string;
  forma_pagamento: string;
  observacao: string;
  parcelado: boolean;
  quantidade_parcelas: string;
};

const initial: ExpenseForm = {
  descricao: "", category_id: "", valor_total: "",
  data_compra: new Date().toISOString().slice(0, 10),
  forma_pagamento: "credito", observacao: "",
  parcelado: false, quantidade_parcelas: "1",
};

function ExpensesPage() {
  const qc = useQueryClient();
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState<ExpenseForm>(initial);
  const [formDisplayValor, setFormDisplayValor] = useState("");

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => (await supabase.from("categories").select("*").order("nome")).data ?? [],
  });

  const { data: expenses, isLoading } = useQuery({
    queryKey: ["expenses"],
    queryFn: async () =>
      (await supabase.from("expenses").select("*, categories(nome, cor), profiles(nome, sobrenome)").order("created_at", { ascending: false })).data ?? [],
  });

  const create = useMutation({
    mutationFn: async (v: ExpenseForm) => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) throw new Error("Sem sessão");
      const { error } = await supabase.from("expenses").insert({
        user_id: auth.user.id,
        category_id: v.category_id || null,
        descricao: v.descricao,
        valor_total: parseBrlToNumber(v.valor_total),
        data_compra: v.data_compra,
        forma_pagamento: v.forma_pagamento,
        observacao: v.observacao || null,
        parcelado: v.parcelado,
        quantidade_parcelas: v.parcelado ? Math.max(1, Number(v.quantidade_parcelas)) : 1,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Despesa cadastrada! Parcelas geradas automaticamente.");
      qc.invalidateQueries();
      setModal(false);
      setForm(initial);
      setFormDisplayValor("");
    },
    onError: (e: any) => toast.error(e.message ?? "Erro ao cadastrar"),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("expenses").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Despesa excluída"); qc.invalidateQueries(); },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-extrabold">Despesas</h1>
          <p className="text-sm text-muted-foreground">Cadastre e acompanhe todas as despesas da família</p>
        </div>
        <button onClick={() => setModal(true)}
          className="inline-flex items-center gap-2 rounded-full gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-elegant hover:brightness-110">
          <Plus className="h-4 w-4" /> Nova despesa
        </button>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-3">Descrição</th>
                <th className="px-5 py-3">Categoria</th>
                <th className="px-5 py-3">Pessoa</th>
                <th className="px-5 py-3">Data</th>
                <th className="px-5 py-3">Parcelas</th>
                <th className="px-5 py-3 text-right">Valor</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr><td colSpan={7} className="p-6 text-center text-muted-foreground">Carregando...</td></tr>
              )}
              {expenses?.length === 0 && !isLoading && (
                <tr><td colSpan={7} className="p-10 text-center text-muted-foreground">Nenhuma despesa ainda. Comece cadastrando a primeira!</td></tr>
              )}
              {expenses?.map((e: any) => (
                <tr key={e.id} className="border-t border-border hover:bg-accent/40">
                  <td className="px-5 py-3 font-medium">{e.descricao}</td>
                  <td className="px-5 py-3">
                    <span className="inline-flex rounded-full px-2.5 py-1 text-xs font-medium"
                      style={{ backgroundColor: `${e.categories?.cor ?? "#8B5CF6"}20`, color: e.categories?.cor ?? "#8B5CF6" }}>
                      {e.categories?.nome ?? "Sem categoria"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{e.profiles?.nome ?? "-"}</td>
                  <td className="px-5 py-3 text-muted-foreground">{formatDate(e.data_compra)}</td>
                  <td className="px-5 py-3">{e.parcelado ? `${e.quantidade_parcelas}x` : "À vista"}</td>
                  <td className="px-5 py-3 text-right font-semibold">{brl(e.valor_total)}</td>
                  <td className="px-5 py-3">
                    <button onClick={() => { if (confirm("Excluir esta despesa? Isso removerá também suas parcelas.")) del.mutate(e.id); }}
                      className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" onClick={() => setModal(false)}>
          <div className="w-full max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-elegant" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-bold">Nova despesa</h2>
              <button onClick={() => setModal(false)} className="rounded-lg p-2 hover:bg-accent"><X className="h-4 w-4" /></button>
            </div>
            <form className="mt-4 grid gap-4 md:grid-cols-2" onSubmit={(e) => { e.preventDefault(); create.mutate(form); }}>
              <label className="md:col-span-2 space-y-1">
                <span className="text-xs font-medium text-muted-foreground">Descrição *</span>
                <input required value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                  className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring/30" />
              </label>
              <label className="space-y-1">
                <span className="text-xs font-medium text-muted-foreground">Categoria *</span>
                <select required value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                  className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring/30">
                  <option value="">Selecione</option>
                  {categories?.map((c: any) => <option key={c.id} value={c.id}>{c.nome}</option>)}
                </select>
              </label>
              <label className="space-y-1">
                <span className="text-xs font-medium text-muted-foreground">Valor total (R$) *</span>
                <input required type="text" inputMode="numeric" value={formDisplayValor}
                  onChange={(e) => {
                    const formatted = formatBrlInput(e.target.value);
                    setFormDisplayValor(formatted);
                    setForm({ ...form, valor_total: formatted });
                  }}
                  className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring/30"
                  placeholder="0,00" />
              </label>
              <label className="space-y-1">
                <span className="text-xs font-medium text-muted-foreground">Data da compra *</span>
                <input required type="date" value={form.data_compra}
                  onChange={(e) => setForm({ ...form, data_compra: e.target.value })}
                  className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring/30" />
              </label>
              <label className="space-y-1">
                <span className="text-xs font-medium text-muted-foreground">Forma de pagamento</span>
                <select value={form.forma_pagamento} onChange={(e) => setForm({ ...form, forma_pagamento: e.target.value })}
                  className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring/30">
                  <option value="credito">Cartão de crédito</option>
                  <option value="debito">Cartão de débito</option>
                  <option value="pix">Pix</option>
                  <option value="dinheiro">Dinheiro</option>
                  <option value="boleto">Boleto</option>
                  <option value="transferencia">Transferência</option>
                </select>
              </label>
              <div className="md:col-span-2 flex items-center gap-3 rounded-xl border border-border bg-muted/30 px-4 py-3">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <input type="checkbox" checked={form.parcelado}
                    onChange={(e) => setForm({ ...form, parcelado: e.target.checked })}
                    className="h-4 w-4 rounded" />
                  Parcelado?
                </label>
                {form.parcelado && (
                  <label className="ml-auto flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Quantidade de parcelas:</span>
                    <input type="number" min="1" max="120" value={form.quantidade_parcelas}
                      onChange={(e) => setForm({ ...form, quantidade_parcelas: e.target.value })}
                      className="w-20 rounded-lg border border-input bg-background px-3 py-1.5 text-sm outline-none" />
                  </label>
                )}
              </div>
              <label className="md:col-span-2 space-y-1">
                <span className="text-xs font-medium text-muted-foreground">Observação</span>
                <textarea rows={2} value={form.observacao} onChange={(e) => setForm({ ...form, observacao: e.target.value })}
                  className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring/30" />
              </label>
              <div className="md:col-span-2 flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setModal(false)}
                  className="rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold hover:bg-accent">Cancelar</button>
                <button type="submit" disabled={create.isPending}
                  className="inline-flex items-center gap-2 rounded-full gradient-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-elegant hover:brightness-110 disabled:opacity-60">
                  {create.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                  Salvar despesa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

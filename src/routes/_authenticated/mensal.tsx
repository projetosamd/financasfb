import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { brl, MESES } from "@/lib/format";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/mensal")({
  ssr: false,
  component: MonthlyPage,
});

function MonthlyPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [selected, setSelected] = useState<number | null>(now.getMonth() + 1);

  const { data } = useQuery({
    queryKey: ["monthly-all"],
    queryFn: async () => {
      const [inst, exp, cats, profiles] = await Promise.all([
        supabase.from("installments").select("*"),
        supabase.from("expenses").select("*"),
        supabase.from("categories").select("*"),
        supabase.from("profiles").select("id, nome, sobrenome"),
      ]);
      return {
        installments: inst.data ?? [],
        expenses: exp.data ?? [],
        categories: cats.data ?? [],
        profiles: profiles.data ?? [],
      };
    },
  });

  const monthTotals = MESES.map((_, i) => {
    const m = i + 1;
    return data?.installments.filter((x: any) => x.mes === m && x.ano === year).reduce((s: number, x: any) => s + Number(x.valor), 0) ?? 0;
  });

  const detail = selected && data
    ? data.installments.filter((i: any) => i.mes === selected && i.ano === year)
    : [];

  const byCat = new Map<string, { name: string; color: string; total: number }>();
  const byUser = new Map<string, number>();
  let detailTotal = 0;
  for (const i of detail as any[]) {
    detailTotal += Number(i.valor);
    const exp = data!.expenses.find((e: any) => e.id === i.expense_id);
    const cat = data!.categories.find((c: any) => c.id === exp?.category_id);
    const key = cat?.nome ?? "Sem categoria";
    const prev = byCat.get(key);
    byCat.set(key, { name: key, color: cat?.cor ?? "#8B5CF6", total: (prev?.total ?? 0) + Number(i.valor) });
    byUser.set(i.user_id, (byUser.get(i.user_id) ?? 0) + Number(i.valor));
  }

  const years = Array.from(new Set((data?.installments ?? []).map((i: any) => i.ano as number))).sort();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-extrabold">Gestão mensal</h1>
          <p className="text-sm text-muted-foreground">Veja tudo mês a mês</p>
        </div>
        <select value={year} onChange={(e) => setYear(Number(e.target.value))}
          className="rounded-xl border border-input bg-background px-4 py-2.5 text-sm">
          {(years.length ? years : [year]).map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {MESES.map((name, idx) => {
          const m = idx + 1;
          const active = selected === m;
          return (
            <button key={name} onClick={() => setSelected(m)}
              className={`rounded-2xl border p-4 text-left transition ${
                active
                  ? "gradient-primary border-transparent text-primary-foreground shadow-elegant"
                  : "border-border bg-card hover:border-primary/50 hover:shadow-card"
              }`}>
              <p className={`text-xs font-medium ${active ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{name}</p>
              <p className="mt-1 font-display text-xl font-extrabold">{brl(monthTotals[idx])}</p>
            </button>
          );
        })}
      </div>

      {selected && (
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card lg:col-span-2">
            <h3 className="font-display text-lg font-bold">{MESES[selected - 1]} / {year}</h3>
            <p className="mt-1 text-sm text-muted-foreground">Total do mês: <span className="font-semibold text-foreground">{brl(detailTotal)}</span></p>
            <div className="mt-4 space-y-2 text-sm">
              {detail.length === 0 && <p className="text-muted-foreground">Nada neste mês.</p>}
              {(detail as any[]).slice(0, 30).map((i) => {
                const exp = data!.expenses.find((e: any) => e.id === i.expense_id);
                const cat = data!.categories.find((c: any) => c.id === exp?.category_id);
                const p = data!.profiles.find((u: any) => u.id === i.user_id);
                return (
                  <div key={i.id} className="flex items-center justify-between border-b border-border/60 py-2">
                    <div>
                      <p className="font-medium">{exp?.descricao ?? "-"} <span className="text-xs text-muted-foreground">· parcela {i.numero}</span></p>
                      <p className="text-xs text-muted-foreground">
                        <span style={{ color: cat?.cor }}>● {cat?.nome ?? "-"}</span> · {p?.nome ?? "?"}
                      </p>
                    </div>
                    <p className="font-semibold">{brl(i.valor)}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <h4 className="font-display font-bold">Por categoria</h4>
              <div className="mt-3 space-y-2 text-sm">
                {Array.from(byCat.values()).sort((a, b) => b.total - a.total).map((c) => (
                  <div key={c.name} className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full" style={{ backgroundColor: c.color }} /> {c.name}</span>
                    <span className="font-semibold">{brl(c.total)}</span>
                  </div>
                ))}
                {byCat.size === 0 && <p className="text-muted-foreground">Sem dados.</p>}
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <h4 className="font-display font-bold">Por pessoa</h4>
              <div className="mt-3 space-y-2 text-sm">
                {Array.from(byUser.entries()).map(([uid, total]) => {
                  const p = data!.profiles.find((u: any) => u.id === uid);
                  return (
                    <div key={uid} className="flex items-center justify-between">
                      <span>{p?.nome ?? "?"} {p?.sobrenome ?? ""}</span>
                      <span className="font-semibold">{brl(total)}</span>
                    </div>
                  );
                })}
                {byUser.size === 0 && <p className="text-muted-foreground">Sem dados.</p>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

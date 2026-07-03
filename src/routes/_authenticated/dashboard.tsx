import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { brl, monthShort } from "@/lib/format";
import {
  Wallet, TrendingDown, CreditCard, AlertTriangle, CheckCircle2, Users, ArrowUpRight, ArrowDownRight,
} from "lucide-react";
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, LineChart, Line, CartesianGrid,
} from "recharts";

export const Route = createFileRoute("/_authenticated/dashboard")({
  ssr: false,
  component: Dashboard,
});

const CHART_COLORS = ["#8B5CF6", "#EC4899", "#F59E0B", "#10B981", "#3B82F6", "#EF4444", "#14B8A6", "#F97316", "#A855F7", "#22C55E"];

function Card({ title, value, icon: Icon, trend, tone = "default" }: any) {
  const tones: Record<string, string> = {
    default: "bg-primary/10 text-primary",
    success: "bg-success/15 text-success",
    warning: "bg-warning/15 text-warning-foreground",
    danger: "bg-destructive/10 text-destructive",
    accent: "bg-accent/15 text-accent",
  };
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-elegant">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground">{title}</p>
        <div className={`grid h-9 w-9 place-items-center rounded-xl ${tones[tone]}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="mt-3 font-display text-2xl font-extrabold tracking-tight">{value}</p>
      {trend && <p className="mt-1 text-xs text-muted-foreground">{trend}</p>}
    </div>
  );
}

function Dashboard() {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const { data: authData } = await supabase.auth.getUser();
      const userId = authData.user?.id;

      // Mark overdue before reading
      await supabase.rpc("mark_overdue_installments" as any).then(() => {}, () => {});

      const [installmentsAll, expenses, categories, profile] = await Promise.all([
        supabase.from("installments").select("*"),
        supabase.from("expenses").select("*, categories(nome, cor)").order("created_at", { ascending: false }).limit(8),
        supabase.from("categories").select("*"),
        userId ? supabase.from("profiles").select("*").eq("id", userId).maybeSingle() : Promise.resolve({ data: null } as any),
      ]);

      return {
        userId,
        profile: profile.data,
        installments: installmentsAll.data ?? [],
        expenses: expenses.data ?? [],
        categories: categories.data ?? [],
      };
    },
  });

  if (isLoading || !data) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-32 animate-pulse rounded-2xl bg-muted" />
        ))}
      </div>
    );
  }

  const { userId, profile, installments, expenses, categories } = data;

  const mine = installments.filter((i: any) => i.user_id === userId);
  const monthMine = mine.filter((i: any) => i.mes === currentMonth && i.ano === currentYear);
  const totalMonthMine = monthMine.reduce((s: number, i: any) => s + Number(i.valor), 0);
  const futuresMine = mine.filter((i: any) =>
    i.ano > currentYear || (i.ano === currentYear && i.mes > currentMonth),
  ).reduce((s: number, i: any) => s + Number(i.valor), 0);
  const overdueMine = mine.filter((i: any) => i.status === "atrasada").reduce((s: number, i: any) => s + Number(i.valor), 0);
  const paidMine = mine.filter((i: any) => i.status === "paga").reduce((s: number, i: any) => s + Number(i.valor), 0);

  // family
  const familyMonth = installments.filter((i: any) => i.mes === currentMonth && i.ano === currentYear)
    .reduce((s: number, i: any) => s + Number(i.valor), 0);

  // Pie by category (this month, mine)
  const catMap = new Map<string, { name: string; value: number; color: string }>();
  for (const inst of monthMine) {
    const exp = expenses.find((e: any) => e.id === inst.expense_id);
    const cat = categories.find((c: any) => c.id === exp?.category_id);
    const name = cat?.nome ?? "Sem categoria";
    const color = cat?.cor ?? "#8B5CF6";
    const prev = catMap.get(name);
    catMap.set(name, { name, color, value: (prev?.value ?? 0) + Number(inst.valor) });
  }
  const pieData = Array.from(catMap.values());

  // Bar by month (mine, current year)
  const monthlyData = Array.from({ length: 12 }, (_, idx) => {
    const m = idx + 1;
    const total = mine.filter((i: any) => i.mes === m && i.ano === currentYear).reduce((s: number, i: any) => s + Number(i.valor), 0);
    return { mes: monthShort(m), total };
  });

  const alerts: string[] = [];
  const nearOverdue = mine.filter((i: any) => {
    if (i.status !== "aberta") return false;
    const v = new Date(i.vencimento);
    const diff = (v.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 7;
  });
  if (nearOverdue.length) alerts.push(`${nearOverdue.length} parcela(s) vencem nos próximos 7 dias`);
  if (mine.filter((i: any) => i.status === "atrasada").length)
    alerts.push(`${mine.filter((i: any) => i.status === "atrasada").length} parcela(s) atrasada(s)`);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">Bem-vindo(a) de volta</p>
        <h1 className="font-display text-3xl font-extrabold">Olá, {profile?.nome || "Família"} 👋</h1>
      </div>

      {alerts.length > 0 && (
        <div className="rounded-2xl border border-warning/40 bg-warning/10 p-4 text-sm">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-4 w-4 text-warning-foreground" />
            <div>
              <p className="font-semibold">Atenção</p>
              <ul className="mt-1 space-y-0.5 text-muted-foreground">
                {alerts.map((a) => <li key={a}>• {a}</li>)}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card title="Meu total do mês" value={brl(totalMonthMine)} icon={Wallet} tone="default" trend="Parcelas + gastos do mês atual" />
        <Card title="Parcelas futuras" value={brl(futuresMine)} icon={ArrowUpRight} tone="accent" trend="Comprometido nos próximos meses" />
        <Card title="Despesas atrasadas" value={brl(overdueMine)} icon={AlertTriangle} tone="danger" trend="Passaram do vencimento" />
        <Card title="Quitadas" value={brl(paidMine)} icon={CheckCircle2} tone="success" trend="Já pagas" />
        <Card title="Total da família (mês)" value={brl(familyMonth)} icon={Users} tone="default" trend={`${monthShort(currentMonth)}/${currentYear}`} />
        <Card title="Nº de parcelas do mês" value={monthMine.length.toString()} icon={CreditCard} tone="accent" />
        <Card title="Total geral (minhas parcelas)" value={brl(mine.reduce((s: number, i: any) => s + Number(i.valor), 0))} icon={TrendingDown} tone="default" />
        <Card title="Parcelas em aberto" value={mine.filter((i: any) => i.status !== "paga").length.toString()} icon={ArrowDownRight} tone="warning" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <h3 className="font-display text-lg font-bold">Gastos por categoria — {monthShort(currentMonth)}</h3>
          <p className="text-xs text-muted-foreground">Distribuição das suas parcelas deste mês</p>
          <div className="mt-4 h-72">
            {pieData.length === 0 ? (
              <div className="grid h-full place-items-center text-sm text-muted-foreground">Sem dados neste mês</div>
            ) : (
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={95} paddingAngle={3}>
                    {pieData.map((e, i) => <Cell key={i} fill={e.color || CHART_COLORS[i % CHART_COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v: any) => brl(Number(v))} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <h3 className="font-display text-lg font-bold">Gastos por mês — {currentYear}</h3>
          <p className="text-xs text-muted-foreground">Suas parcelas ao longo do ano</p>
          <div className="mt-4 h-72">
            <ResponsiveContainer>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="mes" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip formatter={(v: any) => brl(Number(v))} />
                <Bar dataKey="total" fill="var(--color-primary)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
        <h3 className="font-display text-lg font-bold">Evolução dos gastos</h3>
        <div className="mt-4 h-64">
          <ResponsiveContainer>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="mes" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip formatter={(v: any) => brl(Number(v))} />
              <Line type="monotone" dataKey="total" stroke="var(--color-primary)" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-bold">Últimas despesas</h3>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-muted-foreground">
              <tr>
                <th className="pb-3 pr-4">Descrição</th>
                <th className="pb-3 pr-4">Categoria</th>
                <th className="pb-3 pr-4">Parcelas</th>
                <th className="pb-3 pr-4 text-right">Valor</th>
              </tr>
            </thead>
            <tbody>
              {expenses.length === 0 && (
                <tr><td colSpan={4} className="py-8 text-center text-muted-foreground">Nenhuma despesa ainda</td></tr>
              )}
              {expenses.map((e: any) => (
                <tr key={e.id} className="border-t border-border">
                  <td className="py-3 pr-4 font-medium">{e.descricao}</td>
                  <td className="py-3 pr-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
                      style={{ backgroundColor: `${e.categories?.cor ?? "#8B5CF6"}20`, color: e.categories?.cor ?? "#8B5CF6" }}>
                      {e.categories?.nome ?? "Sem categoria"}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-muted-foreground">{e.parcelado ? `${e.quantidade_parcelas}x` : "À vista"}</td>
                  <td className="py-3 pr-4 text-right font-semibold">{brl(e.valor_total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

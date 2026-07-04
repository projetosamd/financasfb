import { t as supabase } from "./client-Dul7amwi.mjs";
import { a as require_jsx_runtime, n as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { O as ArrowUpRight, S as CreditCard, a as TriangleAlert, k as ArrowDownRight, n as Wallet, r as Users, s as TrendingDown, w as CircleCheck } from "../_libs/lucide-react.mjs";
import { i as monthShort, n as brl } from "./format-IgBs9PLo.mjs";
import { a as XAxis, c as Bar, d as ResponsiveContainer, f as Tooltip, i as YAxis, l as Pie, n as BarChart, o as Line, r as LineChart, s as CartesianGrid, t as PieChart, u as Cell } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-D95ps2HA.js
var import_jsx_runtime = require_jsx_runtime();
var CHART_COLORS = [
	"#8B5CF6",
	"#EC4899",
	"#F59E0B",
	"#10B981",
	"#3B82F6",
	"#EF4444",
	"#14B8A6",
	"#F97316",
	"#A855F7",
	"#22C55E"
];
function Card({ title, value, icon: Icon, trend, tone = "default" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-elegant",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium text-muted-foreground",
					children: title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `grid h-9 w-9 place-items-center rounded-xl ${{
						default: "bg-primary/10 text-primary",
						success: "bg-success/15 text-success",
						warning: "bg-warning/15 text-warning-foreground",
						danger: "bg-destructive/10 text-destructive",
						accent: "bg-accent/15 text-accent"
					}[tone]}`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 font-display text-2xl font-extrabold tracking-tight",
				children: value
			}),
			trend && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-muted-foreground",
				children: trend
			})
		]
	});
}
function Dashboard() {
	const now = /* @__PURE__ */ new Date();
	const currentMonth = now.getMonth() + 1;
	const currentYear = now.getFullYear();
	const { data, isLoading } = useQuery({
		queryKey: ["dashboard"],
		queryFn: async () => {
			const { data: authData } = await supabase.auth.getUser();
			const userId = authData.user?.id;
			await supabase.rpc("mark_overdue_installments").then(() => {}, () => {});
			const [installmentsAll, expenses, categories, profile] = await Promise.all([
				supabase.from("installments").select("*"),
				supabase.from("expenses").select("*, categories(nome, cor)").order("created_at", { ascending: false }).limit(8),
				supabase.from("categories").select("*"),
				userId ? supabase.from("profiles").select("*").eq("id", userId).maybeSingle() : Promise.resolve({ data: null })
			]);
			return {
				userId,
				profile: profile.data,
				installments: installmentsAll.data ?? [],
				expenses: expenses.data ?? [],
				categories: categories.data ?? []
			};
		}
	});
	if (isLoading || !data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid gap-4 md:grid-cols-2 lg:grid-cols-4",
		children: Array.from({ length: 8 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-32 animate-pulse rounded-2xl bg-muted" }, i))
	});
	const { userId, profile, installments, expenses, categories } = data;
	const mine = installments.filter((i) => i.user_id === userId);
	const monthMine = mine.filter((i) => i.mes === currentMonth && i.ano === currentYear);
	const totalMonthMine = monthMine.reduce((s, i) => s + Number(i.valor), 0);
	const futuresMine = mine.filter((i) => i.ano > currentYear || i.ano === currentYear && i.mes > currentMonth).reduce((s, i) => s + Number(i.valor), 0);
	const overdueMine = mine.filter((i) => i.status === "atrasada").reduce((s, i) => s + Number(i.valor), 0);
	const paidMine = mine.filter((i) => i.status === "paga").reduce((s, i) => s + Number(i.valor), 0);
	const familyMonth = installments.filter((i) => i.mes === currentMonth && i.ano === currentYear).reduce((s, i) => s + Number(i.valor), 0);
	const catMap = /* @__PURE__ */ new Map();
	for (const inst of monthMine) {
		const exp = expenses.find((e) => e.id === inst.expense_id);
		const cat = categories.find((c) => c.id === exp?.category_id);
		const name = cat?.nome ?? "Sem categoria";
		const color = cat?.cor ?? "#8B5CF6";
		const prev = catMap.get(name);
		catMap.set(name, {
			name,
			color,
			value: (prev?.value ?? 0) + Number(inst.valor)
		});
	}
	const pieData = Array.from(catMap.values());
	const monthlyData = Array.from({ length: 12 }, (_, idx) => {
		const m = idx + 1;
		const total = mine.filter((i) => i.mes === m && i.ano === currentYear).reduce((s, i) => s + Number(i.valor), 0);
		return {
			mes: monthShort(m),
			total
		};
	});
	const alerts = [];
	const nearOverdue = mine.filter((i) => {
		if (i.status !== "aberta") return false;
		const diff = (new Date(i.vencimento).getTime() - now.getTime()) / (1e3 * 60 * 60 * 24);
		return diff >= 0 && diff <= 7;
	});
	if (nearOverdue.length) alerts.push(`${nearOverdue.length} parcela(s) vencem nos próximos 7 dias`);
	if (mine.filter((i) => i.status === "atrasada").length) alerts.push(`${mine.filter((i) => i.status === "atrasada").length} parcela(s) atrasada(s)`);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Bem-vindo(a) de volta"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
				className: "font-display text-3xl font-extrabold",
				children: [
					"Olá, ",
					profile?.nome || "Família",
					" 👋"
				]
			})] }),
			alerts.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-2xl border border-warning/40 bg-warning/10 p-4 text-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "mt-0.5 h-4 w-4 text-warning-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-semibold",
						children: "Atenção"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-1 space-y-0.5 text-muted-foreground",
						children: alerts.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: ["• ", a] }, a))
					})] })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 md:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						title: "Meu total do mês",
						value: brl(totalMonthMine),
						icon: Wallet,
						tone: "default",
						trend: "Parcelas + gastos do mês atual"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						title: "Parcelas futuras",
						value: brl(futuresMine),
						icon: ArrowUpRight,
						tone: "accent",
						trend: "Comprometido nos próximos meses"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						title: "Despesas atrasadas",
						value: brl(overdueMine),
						icon: TriangleAlert,
						tone: "danger",
						trend: "Passaram do vencimento"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						title: "Quitadas",
						value: brl(paidMine),
						icon: CircleCheck,
						tone: "success",
						trend: "Já pagas"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						title: "Total da família (mês)",
						value: brl(familyMonth),
						icon: Users,
						tone: "default",
						trend: `${monthShort(currentMonth)}/${currentYear}`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						title: "Nº de parcelas do mês",
						value: monthMine.length.toString(),
						icon: CreditCard,
						tone: "accent"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						title: "Total geral (minhas parcelas)",
						value: brl(mine.reduce((s, i) => s + Number(i.valor), 0)),
						icon: TrendingDown,
						tone: "default"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						title: "Parcelas em aberto",
						value: mine.filter((i) => i.status !== "paga").length.toString(),
						icon: ArrowDownRight,
						tone: "warning"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card p-6 shadow-card",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "font-display text-lg font-bold",
							children: ["Gastos por categoria — ", monthShort(currentMonth)]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Distribuição das suas parcelas deste mês"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 h-72",
							children: pieData.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-full place-items-center text-sm text-muted-foreground",
								children: "Sem dados neste mês"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
								data: pieData,
								dataKey: "value",
								nameKey: "name",
								innerRadius: 55,
								outerRadius: 95,
								paddingAngle: 3,
								children: pieData.map((e, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: e.color || CHART_COLORS[i % CHART_COLORS.length] }, i))
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { formatter: (v) => brl(Number(v)) })] }) })
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card p-6 shadow-card",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "font-display text-lg font-bold",
							children: ["Gastos por mês — ", currentYear]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Suas parcelas ao longo do ano"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 h-72",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
								data: monthlyData,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
										strokeDasharray: "3 3",
										opacity: .3
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "mes",
										fontSize: 12
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, { fontSize: 12 }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { formatter: (v) => brl(Number(v)) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: "total",
										fill: "var(--color-primary)",
										radius: [
											8,
											8,
											0,
											0
										]
									})
								]
							}) })
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card p-6 shadow-card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display text-lg font-bold",
					children: "Evolução dos gastos"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 h-64",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
						data: monthlyData,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
								strokeDasharray: "3 3",
								opacity: .3
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "mes",
								fontSize: 12
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, { fontSize: 12 }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { formatter: (v) => brl(Number(v)) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
								type: "monotone",
								dataKey: "total",
								stroke: "var(--color-primary)",
								strokeWidth: 3,
								dot: { r: 4 }
							})
						]
					}) })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card p-6 shadow-card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center justify-between",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-lg font-bold",
						children: "Últimas despesas"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "text-left text-xs text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "pb-3 pr-4",
									children: "Descrição"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "pb-3 pr-4",
									children: "Categoria"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "pb-3 pr-4",
									children: "Parcelas"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "pb-3 pr-4 text-right",
									children: "Valor"
								})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [expenses.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: 4,
							className: "py-8 text-center text-muted-foreground",
							children: "Nenhuma despesa ainda"
						}) }), expenses.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-t border-border",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-3 pr-4 font-medium",
									children: e.descricao
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-3 pr-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
										style: {
											backgroundColor: `${e.categories?.cor ?? "#8B5CF6"}20`,
											color: e.categories?.cor ?? "#8B5CF6"
										},
										children: e.categories?.nome ?? "Sem categoria"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-3 pr-4 text-muted-foreground",
									children: e.parcelado ? `${e.quantidade_parcelas}x` : "À vista"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-3 pr-4 text-right font-semibold",
									children: brl(e.valor_total)
								})
							]
						}, e.id))] })]
					})
				})]
			})
		]
	});
}
//#endregion
export { Dashboard as component };

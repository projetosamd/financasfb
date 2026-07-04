import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-Dul7amwi.mjs";
import { a as require_jsx_runtime, n as useQuery, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { n as brl, t as MESES } from "./format-IgBs9PLo.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/mensal-CcG3VMn2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function MonthlyPage() {
	const now = /* @__PURE__ */ new Date();
	const [year, setYear] = (0, import_react.useState)(now.getFullYear());
	const [selected, setSelected] = (0, import_react.useState)(now.getMonth() + 1);
	const { data } = useQuery({
		queryKey: ["monthly-all"],
		queryFn: async () => {
			const [inst, exp, cats, profiles] = await Promise.all([
				supabase.from("installments").select("*"),
				supabase.from("expenses").select("*"),
				supabase.from("categories").select("*"),
				supabase.from("profiles").select("id, nome, sobrenome")
			]);
			return {
				installments: inst.data ?? [],
				expenses: exp.data ?? [],
				categories: cats.data ?? [],
				profiles: profiles.data ?? []
			};
		}
	});
	const monthTotals = MESES.map((_, i) => {
		const m = i + 1;
		return data?.installments.filter((x) => x.mes === m && x.ano === year).reduce((s, x) => s + Number(x.valor), 0) ?? 0;
	});
	const detail = selected && data ? data.installments.filter((i) => i.mes === selected && i.ano === year) : [];
	const byCat = /* @__PURE__ */ new Map();
	const byUser = /* @__PURE__ */ new Map();
	let detailTotal = 0;
	for (const i of detail) {
		detailTotal += Number(i.valor);
		const exp = data.expenses.find((e) => e.id === i.expense_id);
		const cat = data.categories.find((c) => c.id === exp?.category_id);
		const key = cat?.nome ?? "Sem categoria";
		const prev = byCat.get(key);
		byCat.set(key, {
			name: key,
			color: cat?.cor ?? "#8B5CF6",
			total: (prev?.total ?? 0) + Number(i.valor)
		});
		byUser.set(i.user_id, (byUser.get(i.user_id) ?? 0) + Number(i.valor));
	}
	const years = Array.from(new Set((data?.installments ?? []).map((i) => i.ano))).sort();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl font-extrabold",
					children: "Gestão mensal"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Veja tudo mês a mês"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
					value: year,
					onChange: (e) => setYear(Number(e.target.value)),
					className: "rounded-xl border border-input bg-background px-4 py-2.5 text-sm",
					children: (years.length ? years : [year]).map((y) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: y,
						children: y
					}, y))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4",
				children: MESES.map((name, idx) => {
					const m = idx + 1;
					const active = selected === m;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setSelected(m),
						className: `rounded-2xl border p-4 text-left transition ${active ? "gradient-primary border-transparent text-primary-foreground shadow-elegant" : "border-border bg-card hover:border-primary/50 hover:shadow-card"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: `text-xs font-medium ${active ? "text-primary-foreground/80" : "text-muted-foreground"}`,
							children: name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-display text-xl font-extrabold",
							children: brl(monthTotals[idx])
						})]
					}, name);
				})
			}),
			selected && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card p-6 shadow-card lg:col-span-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "font-display text-lg font-bold",
							children: [
								MESES[selected - 1],
								" / ",
								year
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: ["Total do mês: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-foreground",
								children: brl(detailTotal)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 space-y-2 text-sm",
							children: [detail.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted-foreground",
								children: "Nada neste mês."
							}), detail.slice(0, 30).map((i) => {
								const exp = data.expenses.find((e) => e.id === i.expense_id);
								const cat = data.categories.find((c) => c.id === exp?.category_id);
								const p = data.profiles.find((u) => u.id === i.user_id);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between border-b border-border/60 py-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "font-medium",
										children: [
											exp?.descricao ?? "-",
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-xs text-muted-foreground",
												children: ["· parcela ", i.numero]
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted-foreground",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												style: { color: cat?.cor },
												children: ["● ", cat?.nome ?? "-"]
											}),
											" · ",
											p?.nome ?? "?"
										]
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-semibold",
										children: brl(i.valor)
									})]
								}, i.id);
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card p-6 shadow-card",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
							className: "font-display font-bold",
							children: "Por categoria"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 space-y-2 text-sm",
							children: [Array.from(byCat.values()).sort((a, b) => b.total - a.total).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "h-2 w-2 rounded-full",
											style: { backgroundColor: c.color }
										}),
										" ",
										c.name
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold",
									children: brl(c.total)
								})]
							}, c.name)), byCat.size === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted-foreground",
								children: "Sem dados."
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card p-6 shadow-card",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
							className: "font-display font-bold",
							children: "Por pessoa"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 space-y-2 text-sm",
							children: [Array.from(byUser.entries()).map(([uid, total]) => {
								const p = data.profiles.find((u) => u.id === uid);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										p?.nome ?? "?",
										" ",
										p?.sobrenome ?? ""
									] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold",
										children: brl(total)
									})]
								}, uid);
							}), byUser.size === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted-foreground",
								children: "Sem dados."
							})]
						})]
					})]
				})]
			})
		]
	});
}
//#endregion
export { MonthlyPage as component };

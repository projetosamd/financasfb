import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-Dul7amwi.mjs";
import { a as require_jsx_runtime, i as useQueryClient, n as useQuery, o as require_react, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { C as Clock, a as TriangleAlert, w as CircleCheck } from "../_libs/lucide-react.mjs";
import { n as brl, r as formatDate, t as MESES } from "./format-IgBs9PLo.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/parcelas-BeGDQcnE.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function InstallmentsPage() {
	const qc = useQueryClient();
	const now = /* @__PURE__ */ new Date();
	const [mes, setMes] = (0, import_react.useState)(String(now.getMonth() + 1));
	const [ano, setAno] = (0, import_react.useState)(String(now.getFullYear()));
	const [status, setStatus] = (0, import_react.useState)("");
	const [scope, setScope] = (0, import_react.useState)("family");
	const { data, isLoading } = useQuery({
		queryKey: ["installments-list"],
		queryFn: async () => {
			await supabase.rpc("mark_overdue_installments").then(() => {}, () => {});
			const [inst, exp, cats, me] = await Promise.all([
				supabase.from("installments").select("*").order("vencimento"),
				supabase.from("expenses").select("id, descricao, category_id, user_id"),
				supabase.from("categories").select("*"),
				supabase.auth.getUser()
			]);
			return {
				installments: inst.data ?? [],
				expenses: exp.data ?? [],
				categories: cats.data ?? [],
				me: me.data.user?.id
			};
		}
	});
	const setStatusMut = useMutation({
		mutationFn: async ({ id, status }) => {
			const { error } = await supabase.from("installments").update({
				status,
				data_pagamento: status === "paga" ? (/* @__PURE__ */ new Date()).toISOString().slice(0, 10) : null
			}).eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Atualizado");
			qc.invalidateQueries();
		},
		onError: (e) => toast.error(e.message)
	});
	if (isLoading || !data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid gap-4",
		children: Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-16 animate-pulse rounded-xl bg-muted" }, i))
	});
	const filtered = data.installments.filter((i) => {
		if (mes && i.mes !== Number(mes)) return false;
		if (ano && i.ano !== Number(ano)) return false;
		if (status && i.status !== status) return false;
		if (scope === "mine" && i.user_id !== data.me) return false;
		return true;
	});
	const total = filtered.reduce((s, i) => s + Number(i.valor), 0);
	const years = Array.from(new Set(data.installments.map((i) => i.ano))).sort();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl font-extrabold",
				children: "Parcelas"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Todas as parcelas geradas automaticamente pelo sistema"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-3 rounded-2xl border border-border bg-card p-4 shadow-card",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: scope,
						onChange: (e) => setScope(e.target.value),
						className: "rounded-xl border border-input bg-background px-3 py-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "family",
							children: "Família"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "mine",
							children: "Somente eu"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: mes,
						onChange: (e) => setMes(e.target.value),
						className: "rounded-xl border border-input bg-background px-3 py-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "Todos os meses"
						}), MESES.map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: i + 1,
							children: m
						}, m))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: ano,
						onChange: (e) => setAno(e.target.value),
						className: "rounded-xl border border-input bg-background px-3 py-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "Todos os anos"
						}), years.map((y) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: y,
							children: y
						}, y))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: status,
						onChange: (e) => setStatus(e.target.value),
						className: "rounded-xl border border-input bg-background px-3 py-2 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "Todos status"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "aberta",
								children: "Em aberto"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "paga",
								children: "Paga"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "atrasada",
								children: "Atrasada"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "ml-auto text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground",
							children: "Total filtrado: "
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-lg font-bold text-primary",
							children: brl(total)
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-hidden rounded-2xl border border-border bg-card shadow-card",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-5 py-3",
								children: "Descrição"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-5 py-3",
								children: "Categoria"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-5 py-3",
								children: "Parcela"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-5 py-3",
								children: "Vencimento"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-5 py-3",
								children: "Status"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-5 py-3 text-right",
								children: "Valor"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "px-5 py-3" })
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						colSpan: 7,
						className: "p-10 text-center text-muted-foreground",
						children: "Nenhuma parcela para esse filtro"
					}) }), filtered.map((i) => {
						const exp = data.expenses.find((e) => e.id === i.expense_id);
						const cat = data.categories.find((c) => c.id === exp?.category_id);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-t border-border hover:bg-accent/40",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-5 py-3 font-medium",
									children: exp?.descricao ?? "-"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-5 py-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
										style: {
											backgroundColor: `${cat?.cor ?? "#8B5CF6"}20`,
											color: cat?.cor ?? "#8B5CF6"
										},
										children: cat?.nome ?? "-"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-5 py-3 text-muted-foreground",
									children: i.numero
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-5 py-3 text-muted-foreground",
									children: formatDate(i.vencimento)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-5 py-3",
									children: [
										i.status === "paga" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "inline-flex items-center gap-1 rounded-full bg-success/15 px-2.5 py-1 text-xs font-medium text-success",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3 w-3" }), " Paga"]
										}),
										i.status === "aberta" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3 w-3" }), " Aberta"]
										}),
										i.status === "atrasada" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2.5 py-1 text-xs font-medium text-destructive",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-3 w-3" }), " Atrasada"]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-5 py-3 text-right font-semibold",
									children: brl(i.valor)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-5 py-3 text-right",
									children: i.user_id === data.me && (i.status === "paga" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setStatusMut.mutate({
											id: i.id,
											status: "aberta"
										}),
										className: "text-xs font-medium text-muted-foreground hover:text-primary",
										children: "Marcar aberta"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setStatusMut.mutate({
											id: i.id,
											status: "paga"
										}),
										className: "text-xs font-medium text-primary hover:underline",
										children: "Marcar paga"
									}))
								})
							]
						}, i.id);
					})] })]
				})
			})
		]
	});
}
//#endregion
export { InstallmentsPage as component };

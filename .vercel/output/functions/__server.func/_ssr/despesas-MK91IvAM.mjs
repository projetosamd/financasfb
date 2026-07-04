import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-Dul7amwi.mjs";
import { a as require_jsx_runtime, i as useQueryClient, n as useQuery, o as require_react, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { b as LoaderCircle, c as Trash2, g as Plus, t as X } from "../_libs/lucide-react.mjs";
import { n as brl, r as formatDate } from "./format-IgBs9PLo.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/despesas-MK91IvAM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var initial = {
	descricao: "",
	category_id: "",
	valor_total: "",
	data_compra: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
	forma_pagamento: "credito",
	observacao: "",
	parcelado: false,
	quantidade_parcelas: "1"
};
function ExpensesPage() {
	const qc = useQueryClient();
	const [modal, setModal] = (0, import_react.useState)(false);
	const [form, setForm] = (0, import_react.useState)(initial);
	const { data: categories } = useQuery({
		queryKey: ["categories"],
		queryFn: async () => (await supabase.from("categories").select("*").order("nome")).data ?? []
	});
	const { data: expenses, isLoading } = useQuery({
		queryKey: ["expenses"],
		queryFn: async () => (await supabase.from("expenses").select("*, categories(nome, cor), profiles(nome, sobrenome)").order("created_at", { ascending: false })).data ?? []
	});
	const create = useMutation({
		mutationFn: async (v) => {
			const { data: auth } = await supabase.auth.getUser();
			if (!auth.user) throw new Error("Sem sessão");
			const { error } = await supabase.from("expenses").insert({
				user_id: auth.user.id,
				category_id: v.category_id || null,
				descricao: v.descricao,
				valor_total: Number(v.valor_total),
				data_compra: v.data_compra,
				forma_pagamento: v.forma_pagamento,
				observacao: v.observacao || null,
				parcelado: v.parcelado,
				quantidade_parcelas: v.parcelado ? Math.max(1, Number(v.quantidade_parcelas)) : 1
			});
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Despesa cadastrada! Parcelas geradas automaticamente.");
			qc.invalidateQueries();
			setModal(false);
			setForm(initial);
		},
		onError: (e) => toast.error(e.message ?? "Erro ao cadastrar")
	});
	const del = useMutation({
		mutationFn: async (id) => {
			const { error } = await supabase.from("expenses").delete().eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Despesa excluída");
			qc.invalidateQueries();
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl font-extrabold",
					children: "Despesas"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Cadastre e acompanhe todas as despesas da família"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setModal(true),
					className: "inline-flex items-center gap-2 rounded-full gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-elegant hover:brightness-110",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Nova despesa"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-2xl border border-border bg-card shadow-card",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
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
									children: "Pessoa"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-3",
									children: "Data"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-3",
									children: "Parcelas"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-3 text-right",
									children: "Valor"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "px-5 py-3" })
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [
							isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								colSpan: 7,
								className: "p-6 text-center text-muted-foreground",
								children: "Carregando..."
							}) }),
							expenses?.length === 0 && !isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								colSpan: 7,
								className: "p-10 text-center text-muted-foreground",
								children: "Nenhuma despesa ainda. Comece cadastrando a primeira!"
							}) }),
							expenses?.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-t border-border hover:bg-accent/40",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-5 py-3 font-medium",
										children: e.descricao
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-5 py-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
											style: {
												backgroundColor: `${e.categories?.cor ?? "#8B5CF6"}20`,
												color: e.categories?.cor ?? "#8B5CF6"
											},
											children: e.categories?.nome ?? "Sem categoria"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-5 py-3 text-muted-foreground",
										children: e.profiles?.nome ?? "-"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-5 py-3 text-muted-foreground",
										children: formatDate(e.data_compra)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-5 py-3",
										children: e.parcelado ? `${e.quantidade_parcelas}x` : "À vista"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-5 py-3 text-right font-semibold",
										children: brl(e.valor_total)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-5 py-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => {
												if (confirm("Excluir esta despesa? Isso removerá também suas parcelas.")) del.mutate(e.id);
											},
											className: "rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
										})
									})
								]
							}, e.id))
						] })]
					})
				})
			}),
			modal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 grid place-items-center bg-black/50 p-4",
				onClick: () => setModal(false),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-elegant",
					onClick: (e) => e.stopPropagation(),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-xl font-bold",
							children: "Nova despesa"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setModal(false),
							className: "rounded-lg p-2 hover:bg-accent",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "mt-4 grid gap-4 md:grid-cols-2",
						onSubmit: (e) => {
							e.preventDefault();
							create.mutate(form);
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "md:col-span-2 space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-medium text-muted-foreground",
									children: "Descrição *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									required: true,
									value: form.descricao,
									onChange: (e) => setForm({
										...form,
										descricao: e.target.value
									}),
									className: "w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring/30"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-medium text-muted-foreground",
									children: "Categoria *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									required: true,
									value: form.category_id,
									onChange: (e) => setForm({
										...form,
										category_id: e.target.value
									}),
									className: "w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring/30",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										children: "Selecione"
									}), categories?.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: c.id,
										children: c.nome
									}, c.id))]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-medium text-muted-foreground",
									children: "Valor total (R$) *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									required: true,
									type: "number",
									step: "0.01",
									min: "0",
									value: form.valor_total,
									onChange: (e) => setForm({
										...form,
										valor_total: e.target.value
									}),
									className: "w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring/30"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-medium text-muted-foreground",
									children: "Data da compra *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									required: true,
									type: "date",
									value: form.data_compra,
									onChange: (e) => setForm({
										...form,
										data_compra: e.target.value
									}),
									className: "w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring/30"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-medium text-muted-foreground",
									children: "Forma de pagamento"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: form.forma_pagamento,
									onChange: (e) => setForm({
										...form,
										forma_pagamento: e.target.value
									}),
									className: "w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring/30",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "credito",
											children: "Cartão de crédito"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "debito",
											children: "Cartão de débito"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "pix",
											children: "Pix"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "dinheiro",
											children: "Dinheiro"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "boleto",
											children: "Boleto"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "transferencia",
											children: "Transferência"
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "md:col-span-2 flex items-center gap-3 rounded-xl border border-border bg-muted/30 px-4 py-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex items-center gap-2 text-sm font-medium",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: form.parcelado,
										onChange: (e) => setForm({
											...form,
											parcelado: e.target.checked
										}),
										className: "h-4 w-4 rounded"
									}), "Parcelado?"]
								}), form.parcelado && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "ml-auto flex items-center gap-2 text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Quantidade de parcelas:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "number",
										min: "1",
										max: "120",
										value: form.quantidade_parcelas,
										onChange: (e) => setForm({
											...form,
											quantidade_parcelas: e.target.value
										}),
										className: "w-20 rounded-lg border border-input bg-background px-3 py-1.5 text-sm outline-none"
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "md:col-span-2 space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-medium text-muted-foreground",
									children: "Observação"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									rows: 2,
									value: form.observacao,
									onChange: (e) => setForm({
										...form,
										observacao: e.target.value
									}),
									className: "w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring/30"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "md:col-span-2 flex justify-end gap-2 pt-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setModal(false),
									className: "rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold hover:bg-accent",
									children: "Cancelar"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "submit",
									disabled: create.isPending,
									className: "inline-flex items-center gap-2 rounded-full gradient-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-elegant hover:brightness-110 disabled:opacity-60",
									children: [create.isPending && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), "Salvar despesa"]
								})]
							})
						]
					})]
				})
			})
		]
	});
}
//#endregion
export { ExpensesPage as component };

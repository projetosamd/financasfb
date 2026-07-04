import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-Dul7amwi.mjs";
import { a as require_jsx_runtime, i as useQueryClient, n as useQuery, o as require_react, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { c as Trash2, g as Plus, l as Target } from "../_libs/lucide-react.mjs";
import { n as brl } from "./format-IgBs9PLo.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/metas-CNaG8YbX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function GoalsPage() {
	const qc = useQueryClient();
	const [form, setForm] = (0, import_react.useState)({
		titulo: "",
		valor_meta: "",
		valor_atual: "0"
	});
	const { data: goals } = useQuery({
		queryKey: ["goals"],
		queryFn: async () => {
			const { data: auth } = await supabase.auth.getUser();
			const { data } = await supabase.from("goals").select("*").eq("user_id", auth.user.id).order("created_at", { ascending: false });
			return data ?? [];
		}
	});
	const create = useMutation({
		mutationFn: async () => {
			const { data: auth } = await supabase.auth.getUser();
			const { error } = await supabase.from("goals").insert({
				user_id: auth.user.id,
				titulo: form.titulo,
				valor_meta: Number(form.valor_meta),
				valor_atual: Number(form.valor_atual)
			});
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Meta criada!");
			qc.invalidateQueries({ queryKey: ["goals"] });
			setForm({
				titulo: "",
				valor_meta: "",
				valor_atual: "0"
			});
		},
		onError: (e) => toast.error(e.message)
	});
	const update = useMutation({
		mutationFn: async ({ id, valor_atual }) => {
			const { error } = await supabase.from("goals").update({ valor_atual }).eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => qc.invalidateQueries({ queryKey: ["goals"] })
	});
	const del = useMutation({
		mutationFn: async (id) => {
			const { error } = await supabase.from("goals").delete().eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Meta excluída");
			qc.invalidateQueries({ queryKey: ["goals"] });
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl font-extrabold",
				children: "Metas Financeiras"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Defina objetivos e acompanhe o progresso"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: (e) => {
					e.preventDefault();
					create.mutate();
				},
				className: "grid gap-3 rounded-2xl border border-border bg-card p-5 shadow-card md:grid-cols-[1fr_180px_180px_auto]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						required: true,
						placeholder: "Título da meta (ex: Viagem à praia)",
						value: form.titulo,
						onChange: (e) => setForm({
							...form,
							titulo: e.target.value
						}),
						className: "rounded-xl border border-input bg-background px-4 py-2.5 text-sm"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						required: true,
						type: "number",
						step: "0.01",
						placeholder: "Valor da meta",
						value: form.valor_meta,
						onChange: (e) => setForm({
							...form,
							valor_meta: e.target.value
						}),
						className: "rounded-xl border border-input bg-background px-4 py-2.5 text-sm"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "number",
						step: "0.01",
						placeholder: "Já guardado",
						value: form.valor_atual,
						onChange: (e) => setForm({
							...form,
							valor_atual: e.target.value
						}),
						className: "rounded-xl border border-input bg-background px-4 py-2.5 text-sm"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "inline-flex items-center justify-center gap-2 rounded-full gradient-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-elegant hover:brightness-110",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Criar"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 md:grid-cols-2 lg:grid-cols-3",
				children: [goals?.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground md:col-span-2 lg:col-span-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, { className: "mx-auto h-8 w-8 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2",
						children: "Nenhuma meta ainda. Crie a primeira!"
					})]
				}), goals?.map((g) => {
					const pct = Math.min(100, Number(g.valor_atual) / Number(g.valor_meta) * 100);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card p-5 shadow-card",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-display text-lg font-bold",
									children: g.titulo
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground",
									children: ["Meta: ", brl(g.valor_meta)]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => confirm("Excluir esta meta?") && del.mutate(g.id),
									className: "rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold",
										children: brl(g.valor_atual)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-muted-foreground",
										children: [pct.toFixed(0), "%"]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-2 h-2.5 overflow-hidden rounded-full bg-muted",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-full gradient-primary transition-all",
										style: { width: `${pct}%` }
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-4 flex gap-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									step: "0.01",
									defaultValue: g.valor_atual,
									onBlur: (e) => {
										const v = Number(e.target.value);
										if (v !== Number(g.valor_atual)) update.mutate({
											id: g.id,
											valor_atual: v
										});
									},
									className: "w-full rounded-lg border border-input bg-background px-3 py-1.5 text-sm"
								})
							})
						]
					}, g.id);
				})]
			})
		]
	});
}
//#endregion
export { GoalsPage as component };

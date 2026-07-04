import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-Dul7amwi.mjs";
import { a as require_jsx_runtime, i as useQueryClient, n as useQuery, o as require_react, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as brl, r as formatDate } from "./format-IgBs9PLo.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/perfil-HwYWjWZE.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProfilePage() {
	const qc = useQueryClient();
	const [form, setForm] = (0, import_react.useState)({
		nome: "",
		sobrenome: "",
		foto_url: ""
	});
	const { data } = useQuery({
		queryKey: ["profile-me"],
		queryFn: async () => {
			const { data: auth } = await supabase.auth.getUser();
			const uid = auth.user.id;
			const [profile, expenses, installments] = await Promise.all([
				supabase.from("profiles").select("*").eq("id", uid).maybeSingle(),
				supabase.from("expenses").select("id, valor_total").eq("user_id", uid),
				supabase.from("installments").select("id").eq("user_id", uid)
			]);
			return {
				profile: profile.data,
				expenseCount: expenses.data?.length ?? 0,
				totalSpent: expenses.data?.reduce((s, e) => s + Number(e.valor_total), 0) ?? 0,
				installCount: installments.data?.length ?? 0
			};
		}
	});
	(0, import_react.useEffect)(() => {
		if (data?.profile) setForm({
			nome: data.profile.nome,
			sobrenome: data.profile.sobrenome,
			foto_url: data.profile.foto_url ?? ""
		});
	}, [data]);
	const save = useMutation({
		mutationFn: async () => {
			const { data: auth } = await supabase.auth.getUser();
			const { error } = await supabase.from("profiles").update({
				nome: form.nome,
				sobrenome: form.sobrenome,
				foto_url: form.foto_url || null
			}).eq("id", auth.user.id);
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Perfil atualizado");
			qc.invalidateQueries();
		},
		onError: (e) => toast.error(e.message)
	});
	if (!data?.profile) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "animate-pulse space-y-3",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-32 rounded-2xl bg-muted" })
	});
	const initials = ((data.profile.nome?.[0] ?? "") + (data.profile.sobrenome?.[0] ?? "")).toUpperCase() || "?";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-3xl font-extrabold",
			children: "Perfil"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "Gerencie suas informações"
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-6 lg:grid-cols-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-2xl border border-border bg-card p-6 shadow-card lg:col-span-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: (e) => {
						e.preventDefault();
						save.mutate();
					},
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-4",
							children: [form.foto_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: form.foto_url,
								alt: "",
								className: "h-20 w-20 rounded-full border-4 border-primary/20 object-cover"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-20 w-20 place-items-center rounded-full gradient-primary font-display text-2xl font-extrabold text-primary-foreground shadow-elegant",
								children: initials
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex-1",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									placeholder: "URL da foto (opcional)",
									value: form.foto_url,
									onChange: (e) => setForm({
										...form,
										foto_url: e.target.value
									}),
									className: "w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm"
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-3 md:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-medium text-muted-foreground",
									children: "Nome"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									required: true,
									value: form.nome,
									onChange: (e) => setForm({
										...form,
										nome: e.target.value
									}),
									className: "w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-medium text-muted-foreground",
									children: "Sobrenome"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: form.sobrenome,
									onChange: (e) => setForm({
										...form,
										sobrenome: e.target.value
									}),
									className: "w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-medium text-muted-foreground",
								children: "E-mail"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								disabled: true,
								value: data.profile.email,
								className: "w-full rounded-xl border border-input bg-muted px-4 py-2.5 text-sm text-muted-foreground"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							className: "rounded-full gradient-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-elegant hover:brightness-110",
							children: "Salvar alterações"
						})
					]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card p-5 shadow-card",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-medium text-muted-foreground",
							children: "Membro desde"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-display text-lg font-bold",
							children: formatDate(data.profile.created_at)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card p-5 shadow-card",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-medium text-muted-foreground",
							children: "Total gasto"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-display text-lg font-bold",
							children: brl(data.totalSpent)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card p-5 shadow-card",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-medium text-muted-foreground",
							children: "Nº despesas"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-display text-lg font-bold",
							children: data.expenseCount
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card p-5 shadow-card",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-medium text-muted-foreground",
							children: "Nº parcelas"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-display text-lg font-bold",
							children: data.installCount
						})]
					})
				]
			})]
		})]
	});
}
//#endregion
export { ProfilePage as component };

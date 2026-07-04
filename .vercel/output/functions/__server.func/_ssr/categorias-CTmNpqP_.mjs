import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-Dul7amwi.mjs";
import { a as require_jsx_runtime, i as useQueryClient, n as useQuery, o as require_react, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { d as Tag, g as Plus } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/categorias-CTmNpqP_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CategoriesPage() {
	const qc = useQueryClient();
	const [form, setForm] = (0, import_react.useState)({
		nome: "",
		cor: "#8B5CF6"
	});
	const { data: cats } = useQuery({
		queryKey: ["categories"],
		queryFn: async () => (await supabase.from("categories").select("*").order("nome")).data ?? []
	});
	const create = useMutation({
		mutationFn: async () => {
			const { error } = await supabase.from("categories").insert({
				nome: form.nome,
				cor: form.cor,
				icone: "Tag"
			});
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Categoria criada!");
			qc.invalidateQueries({ queryKey: ["categories"] });
			setForm({
				nome: "",
				cor: "#8B5CF6"
			});
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl font-extrabold",
				children: "Categorias"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Organize suas despesas por categoria"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: (e) => {
					e.preventDefault();
					create.mutate();
				},
				className: "grid gap-3 rounded-2xl border border-border bg-card p-5 shadow-card md:grid-cols-[1fr_160px_auto]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						required: true,
						placeholder: "Nome da categoria",
						value: form.nome,
						onChange: (e) => setForm({
							...form,
							nome: e.target.value
						}),
						className: "rounded-xl border border-input bg-background px-4 py-2.5 text-sm"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 rounded-xl border border-input bg-background px-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted-foreground",
							children: "Cor"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "color",
							value: form.cor,
							onChange: (e) => setForm({
								...form,
								cor: e.target.value
							}),
							className: "h-8 w-full cursor-pointer rounded"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "inline-flex items-center gap-2 rounded-full gradient-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-elegant hover:brightness-110",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Criar"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
				children: cats?.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-card",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-10 w-10 place-items-center rounded-xl",
						style: {
							backgroundColor: `${c.cor}20`,
							color: c.cor
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, { className: "h-4 w-4" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-semibold",
						children: c.nome
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: c.cor
					})] })]
				}, c.id))
			})
		]
	});
}
//#endregion
export { CategoriesPage as component };

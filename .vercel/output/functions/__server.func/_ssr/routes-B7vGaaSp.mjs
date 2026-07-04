import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { D as Bell, T as ChartPie, m as ShieldCheck, n as Wallet, o as TrendingUp, p as Sparkles } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-B7vGaaSp.js
var import_jsx_runtime = require_jsx_runtime();
function Landing() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "mx-auto flex max-w-6xl items-center justify-between px-6 py-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid h-9 w-9 place-items-center rounded-xl gradient-primary shadow-elegant",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-5 w-5 text-primary-foreground" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-display text-lg font-bold",
					children: "Finanças Borges Souza"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/auth",
					className: "text-sm font-medium text-muted-foreground hover:text-foreground",
					children: "Entrar"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/auth",
					search: { mode: "signup" },
					className: "rounded-full gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-elegant transition hover:brightness-110",
					children: "Criar conta"
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-6xl px-6 pt-12 pb-24 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground shadow-card",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5 text-primary" }), "Feito para a sua família"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "mt-6 font-display text-5xl font-extrabold tracking-tight md:text-6xl",
					children: [
						"Controle financeiro ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "bg-clip-text text-transparent gradient-primary",
							children: "familiar"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", { className: "hidden md:block" }),
						" simples e inteligente."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mx-auto mt-6 max-w-2xl text-lg text-muted-foreground",
					children: "Cada integrante da família cadastra suas despesas. O sistema calcula parcelas automaticamente, organiza por mês, gera relatórios e mostra tudo em um dashboard bonito."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 flex flex-wrap justify-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/auth",
						search: { mode: "signup" },
						className: "rounded-full gradient-primary px-8 py-3 text-sm font-semibold text-primary-foreground shadow-elegant transition hover:brightness-110",
						children: "Começar agora — grátis"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/auth",
						className: "rounded-full border border-border bg-card px-8 py-3 text-sm font-semibold hover:bg-accent hover:text-accent-foreground",
						children: "Já tenho conta"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-20 grid gap-6 md:grid-cols-3",
					children: [
						{
							icon: ChartPie,
							title: "Dashboards elegantes",
							desc: "Gráficos animados de gastos por categoria, mês e pessoa."
						},
						{
							icon: TrendingUp,
							title: "Parcelas automáticas",
							desc: "Cadastre uma compra 12x e o sistema distribui em 12 meses."
						},
						{
							icon: Bell,
							title: "Alertas inteligentes",
							desc: "Aviso de vencimento, parcelas que finalizam e contas atrasadas."
						},
						{
							icon: ShieldCheck,
							title: "Seguro por padrão",
							desc: "Cada usuário vê apenas seus dados; admin vê o total da família."
						},
						{
							icon: Wallet,
							title: "Metas financeiras",
							desc: "Defina objetivos e acompanhe o progresso em tempo real."
						},
						{
							icon: Sparkles,
							title: "Tema claro e escuro",
							desc: "Interface moderna inspirada em Nubank, Inter e Notion."
						}
					].map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card p-6 text-left shadow-card transition hover:-translate-y-1 hover:shadow-elegant",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(f.icon, { className: "h-5 w-5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mt-4 font-display text-lg font-bold",
								children: f.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted-foreground",
								children: f.desc
							})
						]
					}, f.title))
				})
			]
		})]
	});
}
//#endregion
export { Landing as component };

import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-Dul7amwi.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Route } from "./auth-CZwNia3f.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { b as LoaderCircle, n as Wallet } from "../_libs/lucide-react.mjs";
import { t as createLovableAuth } from "../_libs/lovable.dev__cloud-auth-js.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-BA1_LbEl.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var lovableAuth = createLovableAuth();
var lovable = { auth: { signInWithOAuth: async (provider, opts) => {
	const result = await lovableAuth.signInWithOAuth(provider, {
		redirect_uri: opts?.redirect_uri,
		extraParams: { ...opts?.extraParams }
	});
	if (result.redirected) return result;
	if (result.error) return result;
	try {
		await supabase.auth.setSession(result.tokens);
	} catch (e) {
		return { error: e instanceof Error ? e : new Error(String(e)) };
	}
	return result;
} } };
function AuthPage() {
	const { mode } = Route.useSearch();
	const navigate = useNavigate();
	const [isSignup, setIsSignup] = (0, import_react.useState)(mode === "signup");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [form, setForm] = (0, import_react.useState)({
		nome: "",
		sobrenome: "",
		email: "",
		senha: ""
	});
	const submit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			if (isSignup) {
				const { error } = await supabase.auth.signUp({
					email: form.email,
					password: form.senha,
					options: {
						emailRedirectTo: window.location.origin,
						data: {
							nome: form.nome,
							sobrenome: form.sobrenome,
							full_name: `${form.nome} ${form.sobrenome}`.trim()
						}
					}
				});
				if (error) throw error;
				toast.success("Conta criada! Bem-vindo(a) à família.");
				navigate({ to: "/dashboard" });
			} else {
				const { error } = await supabase.auth.signInWithPassword({
					email: form.email,
					password: form.senha
				});
				if (error) throw error;
				toast.success("Bem-vindo(a) de volta!");
				navigate({ to: "/dashboard" });
			}
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Erro ao autenticar");
		} finally {
			setLoading(false);
		}
	};
	const google = async () => {
		setLoading(true);
		try {
			const res = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
			if (res.error) throw res.error;
			if (!res.redirected) navigate({ to: "/dashboard" });
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Erro no Google");
			setLoading(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid min-h-screen lg:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative hidden overflow-hidden gradient-hero lg:block",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 opacity-30 [background:radial-gradient(circle_at_20%_20%,white,transparent_40%),radial-gradient(circle_at_80%_60%,white,transparent_40%)]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex h-full flex-col justify-between p-12 text-primary-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-10 w-10 place-items-center rounded-xl bg-white/15 backdrop-blur",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-5 w-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display font-bold",
							children: "Finanças Borges Souza"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-4xl font-extrabold leading-tight",
						children: "A família toda no controle das finanças."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 max-w-md text-white/85",
						children: "Parcelas automáticas, dashboards em tempo real e visão consolidada da família. Simples, bonito e seguro."
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-sm text-white/70",
						children: [
							"© ",
							(/* @__PURE__ */ new Date()).getFullYear(),
							" Família Borges Souza"
						]
					})
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex items-center justify-center bg-background p-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full max-w-md",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-8 flex items-center gap-2 lg:hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-9 w-9 place-items-center rounded-xl gradient-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-5 w-5 text-primary-foreground" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display font-bold",
							children: "Finanças Borges Souza"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-3xl font-extrabold",
						children: isSignup ? "Criar conta" : "Bem-vindo(a) de volta"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: isSignup ? "Junte-se à família Borges Souza." : "Entre para acompanhar suas finanças."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: google,
						disabled: loading,
						className: "mt-8 flex w-full items-center justify-center gap-3 rounded-full border border-border bg-card py-3 text-sm font-semibold shadow-card transition hover:bg-accent hover:text-accent-foreground disabled:opacity-60",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
							className: "h-5 w-5",
							viewBox: "0 0 24 24",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
									fill: "#4285F4",
									d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09z"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
									fill: "#34A853",
									d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.98.66-2.24 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
									fill: "#FBBC05",
									d: "M5.84 14.11A6.6 6.6 0 0 1 5.48 12c0-.73.13-1.44.36-2.11V7.05H2.18A11 11 0 0 0 1 12c0 1.77.42 3.45 1.18 4.95l3.66-2.84z"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
									fill: "#EA4335",
									d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
								})
							]
						}), "Continuar com Google"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "my-6 flex items-center gap-3 text-xs text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px flex-1 bg-border" }),
							" ou com e-mail ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px flex-1 bg-border" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: submit,
						className: "space-y-3",
						children: [
							isSignup && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									required: true,
									placeholder: "Nome",
									value: form.nome,
									onChange: (e) => setForm({
										...form,
										nome: e.target.value
									}),
									className: "w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									required: true,
									placeholder: "Sobrenome",
									value: form.sobrenome,
									onChange: (e) => setForm({
										...form,
										sobrenome: e.target.value
									}),
									className: "w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								type: "email",
								placeholder: "E-mail",
								value: form.email,
								onChange: (e) => setForm({
									...form,
									email: e.target.value
								}),
								className: "w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								type: "password",
								placeholder: "Senha",
								minLength: 6,
								value: form.senha,
								onChange: (e) => setForm({
									...form,
									senha: e.target.value
								}),
								className: "w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "submit",
								disabled: loading,
								className: "flex w-full items-center justify-center gap-2 rounded-full gradient-primary py-3 text-sm font-semibold text-primary-foreground shadow-elegant transition hover:brightness-110 disabled:opacity-60",
								children: [loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), isSignup ? "Criar conta" : "Entrar"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-6 text-center text-sm text-muted-foreground",
						children: [
							isSignup ? "Já tem conta?" : "Não tem conta ainda?",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setIsSignup((v) => !v),
								className: "font-semibold text-primary hover:underline",
								children: isSignup ? "Entrar" : "Criar conta"
							})
						]
					})
				]
			})
		})]
	});
}
//#endregion
export { AuthPage as component };

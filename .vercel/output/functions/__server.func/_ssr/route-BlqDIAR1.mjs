import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-Dul7amwi.mjs";
import { a as require_jsx_runtime, i as useQueryClient, n as useQuery, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { f as Outlet, g as Link, l as useLocation, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { E as CalendarDays, S as CreditCard, _ as Moon, f as Sun, h as Receipt, i as User, l as Target, n as Wallet, t as X, u as Tags, v as Menu, x as LayoutDashboard, y as LogOut } from "../_libs/lucide-react.mjs";
import { n as useTheme } from "./theme-D5jIKoIS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/route-BlqDIAR1.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var NAV = [
	{
		to: "/dashboard",
		label: "Dashboard",
		icon: LayoutDashboard
	},
	{
		to: "/despesas",
		label: "Despesas",
		icon: Receipt
	},
	{
		to: "/parcelas",
		label: "Parcelas",
		icon: CreditCard
	},
	{
		to: "/mensal",
		label: "Gestão Mensal",
		icon: CalendarDays
	},
	{
		to: "/metas",
		label: "Metas",
		icon: Target
	},
	{
		to: "/categorias",
		label: "Categorias",
		icon: Tags
	},
	{
		to: "/perfil",
		label: "Perfil",
		icon: User
	}
];
function AppShell({ children }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const location = useLocation();
	const navigate = useNavigate();
	const qc = useQueryClient();
	const { theme, toggle } = useTheme();
	(0, import_react.useEffect)(() => setOpen(false), [location.pathname]);
	const { data: profile } = useQuery({
		queryKey: ["me"],
		queryFn: async () => {
			const { data: auth } = await supabase.auth.getUser();
			if (!auth.user) return null;
			const { data } = await supabase.from("profiles").select("*").eq("id", auth.user.id).maybeSingle();
			return data;
		}
	});
	const signOut = async () => {
		await qc.cancelQueries();
		qc.clear();
		await supabase.auth.signOut();
		navigate({
			to: "/auth",
			replace: true
		});
	};
	const initials = ((profile?.nome?.[0] ?? "") + (profile?.sobrenome?.[0] ?? "")).toUpperCase() || "?";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
				className: `fixed inset-y-0 left-0 z-40 w-72 transform border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-transform lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex h-full flex-col",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 px-6 py-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-10 w-10 place-items-center rounded-xl gradient-primary shadow-elegant",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-5 w-5 text-primary-foreground" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-sm font-extrabold leading-tight",
								children: "Finanças"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Borges Souza"
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
							className: "flex-1 space-y-1 px-3 pb-4",
							children: NAV.map((item) => {
								const active = location.pathname === item.to || item.to !== "/dashboard" && location.pathname.startsWith(item.to);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: item.to,
									className: `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${active ? "gradient-primary text-primary-foreground shadow-elegant" : "text-sidebar-foreground hover:bg-sidebar-accent"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "h-4.5 w-4.5" }), item.label]
								}, item.to);
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "border-t border-sidebar-border p-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 rounded-xl bg-sidebar-accent p-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid h-10 w-10 place-items-center rounded-full gradient-primary text-sm font-bold text-primary-foreground",
										children: initials
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "truncate text-sm font-semibold",
											children: [
												profile?.nome || "Usuário",
												" ",
												profile?.sobrenome ?? ""
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "truncate text-xs text-muted-foreground",
											children: profile?.email
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: signOut,
										className: "rounded-lg p-2 text-muted-foreground hover:bg-background hover:text-destructive",
										title: "Sair",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4 w-4" })
									})
								]
							})
						})
					]
				})
			}),
			open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-30 bg-black/40 lg:hidden",
				onClick: () => setOpen(false)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg:pl-72",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "sticky top-0 z-20 flex items-center justify-between border-b border-border bg-background/80 px-4 py-3 backdrop-blur lg:px-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "rounded-lg p-2 hover:bg-accent lg:hidden",
							onClick: () => setOpen((v) => !v),
							children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-5 w-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "hidden lg:block" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center gap-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: toggle,
								className: "rounded-full border border-border bg-card p-2 shadow-card hover:bg-accent",
								title: "Trocar tema",
								children: theme === "dark" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "h-4 w-4" })
							})
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "mx-auto max-w-7xl p-4 lg:p-8",
					children
				})]
			})
		]
	});
}
function Layout() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) });
}
//#endregion
export { Layout as component };

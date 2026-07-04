import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-Dul7amwi.mjs";
import { a as require_jsx_runtime, o as require_react, r as QueryClientProvider } from "../_libs/react+tanstack__react-query.mjs";
import { c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, j as redirect, m as createFileRoute, p as lazyRouteComponent, s as Scripts, y as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Route$10 } from "./auth-CZwNia3f.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as ThemeProvider } from "./theme-D5jIKoIS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-C7yg1FNY.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-Bfh7jGlv.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold",
					children: "Página não encontrada"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "A página que você procura não existe ou foi movida."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90",
						children: "Ir para o início"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold",
					children: "Algo deu errado"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Tente novamente ou volte para o início."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90",
						children: "Tentar novamente"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "rounded-full border border-input bg-background px-6 py-2.5 text-sm font-medium hover:bg-accent",
						children: "Início"
					})]
				})
			]
		})
	});
}
var Route$9 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Finanças Família Borges Souza" },
			{
				name: "description",
				content: "Gerencie as finanças da família com controle inteligente de despesas, parcelas e metas."
			},
			{
				name: "author",
				content: "Família Borges Souza"
			},
			{
				property: "og:title",
				content: "Finanças Família Borges Souza"
			},
			{
				property: "og:description",
				content: "Controle financeiro familiar completo, com parcelas automáticas e dashboards em tempo real."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				href: "/favicon.ico",
				type: "image/x-icon"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Sora:wght@500;600;700;800&display=swap"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "pt-BR",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$9.useRouteContext();
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		const { data: sub } = supabase.auth.onAuthStateChange((event) => {
			if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
			router.invalidate();
			if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
		});
		return () => sub.subscription.unsubscribe();
	}, [router, queryClient]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
		client: queryClient,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
			richColors: true,
			position: "top-right"
		})]
	}) });
}
var $$splitComponentImporter$8 = () => import("./route-BlqDIAR1.mjs");
var Route$8 = createFileRoute("/_authenticated")({
	ssr: false,
	beforeLoad: async () => {
		const { data, error } = await supabase.auth.getUser();
		if (error || !data.user) throw redirect({ to: "/auth" });
		return { user: data.user };
	},
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./routes-B7vGaaSp.mjs");
var Route$7 = createFileRoute("/")({
	ssr: false,
	beforeLoad: async () => {
		const { data } = await supabase.auth.getSession();
		if (data.session) throw redirect({ to: "/dashboard" });
	},
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./perfil-HwYWjWZE.mjs");
var Route$6 = createFileRoute("/_authenticated/perfil")({
	ssr: false,
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./parcelas-BeGDQcnE.mjs");
var Route$5 = createFileRoute("/_authenticated/parcelas")({
	ssr: false,
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./metas-CNaG8YbX.mjs");
var Route$4 = createFileRoute("/_authenticated/metas")({
	ssr: false,
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./mensal-CcG3VMn2.mjs");
var Route$3 = createFileRoute("/_authenticated/mensal")({
	ssr: false,
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./despesas-MK91IvAM.mjs");
var Route$2 = createFileRoute("/_authenticated/despesas")({
	ssr: false,
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./dashboard-D95ps2HA.mjs");
var Route$1 = createFileRoute("/_authenticated/dashboard")({
	ssr: false,
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./categorias-CTmNpqP_.mjs");
var Route = createFileRoute("/_authenticated/categorias")({
	ssr: false,
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var AuthRoute = Route$10.update({
	id: "/auth",
	path: "/auth",
	getParentRoute: () => Route$9
});
var AuthenticatedRouteRoute = Route$8.update({
	id: "/_authenticated",
	getParentRoute: () => Route$9
});
var IndexRoute = Route$7.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$9
});
var AuthenticatedPerfilRoute = Route$6.update({
	id: "/perfil",
	path: "/perfil",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedParcelasRoute = Route$5.update({
	id: "/parcelas",
	path: "/parcelas",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedMetasRoute = Route$4.update({
	id: "/metas",
	path: "/metas",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedMensalRoute = Route$3.update({
	id: "/mensal",
	path: "/mensal",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedDespesasRoute = Route$2.update({
	id: "/despesas",
	path: "/despesas",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedDashboardRoute = Route$1.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedRouteRouteChildren = {
	AuthenticatedCategoriasRoute: Route.update({
		id: "/categorias",
		path: "/categorias",
		getParentRoute: () => AuthenticatedRouteRoute
	}),
	AuthenticatedDashboardRoute,
	AuthenticatedDespesasRoute,
	AuthenticatedMensalRoute,
	AuthenticatedMetasRoute,
	AuthenticatedParcelasRoute,
	AuthenticatedPerfilRoute
};
var rootRouteChildren = {
	IndexRoute,
	AuthenticatedRouteRoute: AuthenticatedRouteRoute._addFileChildren(AuthenticatedRouteRouteChildren),
	AuthRoute
};
var routeTree = Route$9._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };

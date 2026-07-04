import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as objectType, t as enumType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-CZwNia3f.js
var $$splitComponentImporter = () => import("./auth-BA1_LbEl.mjs");
var searchSchema = objectType({ mode: enumType(["signin", "signup"]).optional() });
var Route = createFileRoute("/auth")({
	ssr: false,
	validateSearch: searchSchema,
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };

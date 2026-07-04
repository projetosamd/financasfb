import { i as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/theme-D5jIKoIS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ThemeCtx = (0, import_react.createContext)({
	theme: "light",
	toggle: () => {}
});
function ThemeProvider({ children }) {
	const [theme, setTheme] = (0, import_react.useState)("light");
	(0, import_react.useEffect)(() => {
		const stored = typeof window !== "undefined" && localStorage.getItem("theme");
		const prefersDark = typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;
		setTheme(stored ?? (prefersDark ? "dark" : "light"));
	}, []);
	(0, import_react.useEffect)(() => {
		if (typeof document === "undefined") return;
		document.documentElement.classList.toggle("dark", theme === "dark");
		try {
			localStorage.setItem("theme", theme);
		} catch {}
	}, [theme]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeCtx.Provider, {
		value: {
			theme,
			toggle: () => setTheme((t) => t === "dark" ? "light" : "dark")
		},
		children
	});
}
var useTheme = () => (0, import_react.useContext)(ThemeCtx);
//#endregion
export { useTheme as n, ThemeProvider as t };

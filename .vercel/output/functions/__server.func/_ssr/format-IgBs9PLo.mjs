//#region node_modules/.nitro/vite/services/ssr/assets/format-IgBs9PLo.js
var brl = (v) => {
	const n = typeof v === "string" ? parseFloat(v) : v ?? 0;
	return new Intl.NumberFormat("pt-BR", {
		style: "currency",
		currency: "BRL"
	}).format(Number.isFinite(n) ? n : 0);
};
var MESES = [
	"Janeiro",
	"Fevereiro",
	"Março",
	"Abril",
	"Maio",
	"Junho",
	"Julho",
	"Agosto",
	"Setembro",
	"Outubro",
	"Novembro",
	"Dezembro"
];
var monthShort = (m) => MESES[m - 1]?.slice(0, 3) ?? "";
var formatDate = (d) => {
	const date = typeof d === "string" ? /* @__PURE__ */ new Date(d + (d.length === 10 ? "T00:00:00" : "")) : d;
	return new Intl.DateTimeFormat("pt-BR", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric"
	}).format(date);
};
//#endregion
export { monthShort as i, brl as n, formatDate as r, MESES as t };

export const brl = (v: number | string | null | undefined) => {
  const n = typeof v === "string" ? parseFloat(v) : (v ?? 0);
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    Number.isFinite(n as number) ? (n as number) : 0,
  );
};

export const formatBrlInput = (value: string): string => {
  let numericValue = value.replace(/[^\d]/g, "");
  if (numericValue.length === 0) return "";
  
  const number = parseInt(numericValue, 10);
  return (number / 100).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const parseBrlToNumber = (formattedValue: string): number => {
  let numericValue = formattedValue.replace(/[^\d]/g, "");
  if (numericValue.length === 0) return 0;
  return parseInt(numericValue, 10) / 100;
};

export const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

export const monthShort = (m: number) => MESES[m - 1]?.slice(0, 3) ?? "";

export const formatDate = (d: string | Date) => {
  const date = typeof d === "string" ? new Date(d + (d.length === 10 ? "T00:00:00" : "")) : d;
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(date);
};

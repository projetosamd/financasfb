import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  LayoutDashboard, Receipt, CalendarDays, Target, Tags, User, LogOut, Menu, X,
  CreditCard, Moon, Sun, Wallet,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTheme } from "@/lib/theme";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/despesas", label: "Despesas", icon: Receipt },
  { to: "/parcelas", label: "Parcelas", icon: CreditCard },
  { to: "/mensal", label: "Gestão Mensal", icon: CalendarDays },
  { to: "/metas", label: "Metas", icon: Target },
  { to: "/categorias", label: "Categorias", icon: Tags },
  { to: "/perfil", label: "Perfil", icon: User },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { theme, toggle } = useTheme();

  useEffect(() => setOpen(false), [location.pathname]);

  const { data: profile } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) return null;
      const { data } = await supabase.from("profiles").select("*").eq("id", auth.user.id).maybeSingle();
      return data;
    },
  });

  const signOut = async () => {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  const initials = ((profile?.nome?.[0] ?? "") + (profile?.sobrenome?.[0] ?? "")).toUpperCase() || "?";

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-72 transform border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-transform lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-full flex-col">
          <div className="flex items-center gap-2 px-6 py-6">
            <div className="grid h-10 w-10 place-items-center rounded-xl gradient-primary shadow-elegant">
              <Wallet className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <p className="font-display text-sm font-extrabold leading-tight">Finanças</p>
              <p className="text-xs text-muted-foreground">Borges Souza</p>
            </div>
          </div>

          <nav className="flex-1 space-y-1 px-3 pb-4">
            {NAV.map((item) => {
              const active = location.pathname === item.to || (item.to !== "/dashboard" && location.pathname.startsWith(item.to));
              return (
                <Link key={item.to} to={item.to}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    active
                      ? "gradient-primary text-primary-foreground shadow-elegant"
                      : "text-sidebar-foreground hover:bg-sidebar-accent"
                  }`}>
                  <item.icon className="h-4.5 w-4.5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-sidebar-border p-4">
            <div className="flex items-center gap-3 rounded-xl bg-sidebar-accent p-3">
              <div className="grid h-10 w-10 place-items-center rounded-full gradient-primary text-sm font-bold text-primary-foreground">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{profile?.nome || "Usuário"} {profile?.sobrenome ?? ""}</p>
                <p className="truncate text-xs text-muted-foreground">{profile?.email}</p>
              </div>
              <button onClick={signOut} className="rounded-lg p-2 text-muted-foreground hover:bg-background hover:text-destructive" title="Sair">
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {open && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setOpen(false)} />}

      {/* Content */}
      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-background/80 px-4 py-3 backdrop-blur lg:px-8">
          <button className="rounded-lg p-2 hover:bg-accent lg:hidden" onClick={() => setOpen((v) => !v)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-2">
            <button onClick={toggle} className="rounded-full border border-border bg-card p-2 shadow-card hover:bg-accent" title="Trocar tema">
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>
        </header>
        <main className="mx-auto max-w-7xl p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

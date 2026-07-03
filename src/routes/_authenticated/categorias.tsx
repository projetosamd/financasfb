import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Tag } from "lucide-react";

export const Route = createFileRoute("/_authenticated/categorias")({
  ssr: false,
  component: CategoriesPage,
});

function CategoriesPage() {
  const qc = useQueryClient();
  const [form, setForm] = useState({ nome: "", cor: "#8B5CF6" });

  const { data: cats } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => (await supabase.from("categories").select("*").order("nome")).data ?? [],
  });

  const create = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("categories").insert({ nome: form.nome, cor: form.cor, icone: "Tag" });
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Categoria criada!"); qc.invalidateQueries({ queryKey: ["categories"] }); setForm({ nome: "", cor: "#8B5CF6" }); },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-extrabold">Categorias</h1>
        <p className="text-sm text-muted-foreground">Organize suas despesas por categoria</p>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); create.mutate(); }}
        className="grid gap-3 rounded-2xl border border-border bg-card p-5 shadow-card md:grid-cols-[1fr_160px_auto]">
        <input required placeholder="Nome da categoria" value={form.nome}
          onChange={(e) => setForm({ ...form, nome: e.target.value })}
          className="rounded-xl border border-input bg-background px-4 py-2.5 text-sm" />
        <div className="flex items-center gap-2 rounded-xl border border-input bg-background px-3">
          <span className="text-xs text-muted-foreground">Cor</span>
          <input type="color" value={form.cor} onChange={(e) => setForm({ ...form, cor: e.target.value })}
            className="h-8 w-full cursor-pointer rounded" />
        </div>
        <button className="inline-flex items-center gap-2 rounded-full gradient-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-elegant hover:brightness-110">
          <Plus className="h-4 w-4" /> Criar
        </button>
      </form>

      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {cats?.map((c: any) => (
          <div key={c.id} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-card">
            <div className="grid h-10 w-10 place-items-center rounded-xl" style={{ backgroundColor: `${c.cor}20`, color: c.cor }}>
              <Tag className="h-4 w-4" />
            </div>
            <div>
              <p className="font-semibold">{c.nome}</p>
              <p className="text-xs text-muted-foreground">{c.cor}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

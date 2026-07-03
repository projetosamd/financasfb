
-- Enum de papéis
CREATE TYPE public.app_role AS ENUM ('admin', 'member');

-- Enum de status de parcela
CREATE TYPE public.installment_status AS ENUM ('paga', 'aberta', 'atrasada');

-- ===== PROFILES =====
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL DEFAULT '',
  sobrenome TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  foto_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ===== USER ROLES =====
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL DEFAULT 'member',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- ===== CATEGORIES =====
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL UNIQUE,
  icone TEXT NOT NULL DEFAULT 'Tag',
  cor TEXT NOT NULL DEFAULT '#8B5CF6',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.categories TO authenticated;
GRANT ALL ON public.categories TO service_role;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- ===== EXPENSES =====
CREATE TABLE public.expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  descricao TEXT NOT NULL,
  valor_total NUMERIC(12,2) NOT NULL CHECK (valor_total >= 0),
  parcelado BOOLEAN NOT NULL DEFAULT FALSE,
  quantidade_parcelas INT NOT NULL DEFAULT 1 CHECK (quantidade_parcelas >= 1),
  forma_pagamento TEXT NOT NULL DEFAULT 'debito',
  data_compra DATE NOT NULL DEFAULT CURRENT_DATE,
  observacao TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_expenses_user ON public.expenses(user_id);
CREATE INDEX idx_expenses_data ON public.expenses(data_compra);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.expenses TO authenticated;
GRANT ALL ON public.expenses TO service_role;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- ===== INSTALLMENTS =====
CREATE TABLE public.installments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expense_id UUID NOT NULL REFERENCES public.expenses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  numero INT NOT NULL,
  valor NUMERIC(12,2) NOT NULL,
  mes INT NOT NULL CHECK (mes BETWEEN 1 AND 12),
  ano INT NOT NULL,
  vencimento DATE NOT NULL,
  status public.installment_status NOT NULL DEFAULT 'aberta',
  data_pagamento DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_installments_user ON public.installments(user_id);
CREATE INDEX idx_installments_venc ON public.installments(vencimento);
CREATE INDEX idx_installments_status ON public.installments(status);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.installments TO authenticated;
GRANT ALL ON public.installments TO service_role;
ALTER TABLE public.installments ENABLE ROW LEVEL SECURITY;

-- ===== GOALS =====
CREATE TABLE public.goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  valor_meta NUMERIC(12,2) NOT NULL CHECK (valor_meta > 0),
  valor_atual NUMERIC(12,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'em_andamento',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.goals TO authenticated;
GRANT ALL ON public.goals TO service_role;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;

-- ===== NOTIFICATIONS =====
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  descricao TEXT,
  lida BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- ===== POLICIES =====
-- Profiles: todos autenticados visualizam (é uma família); dono edita; admin edita tudo
CREATE POLICY "profiles_select_all_auth" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own_or_admin" ON public.profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (auth.uid() = id OR public.has_role(auth.uid(), 'admin'));

-- Roles: usuário lê seu papel; apenas admin muda
CREATE POLICY "roles_select_self_or_admin" ON public.user_roles FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- Categories: todos autenticados leem e criam (colaborativo na família); admin/dono edita
CREATE POLICY "categories_select_all" ON public.categories FOR SELECT TO authenticated USING (true);
CREATE POLICY "categories_insert_auth" ON public.categories FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "categories_update_admin" ON public.categories FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "categories_delete_admin" ON public.categories FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Expenses: dono gerencia; admin gerencia tudo; todos autenticados podem ver (visão familiar)
CREATE POLICY "expenses_select_family" ON public.expenses FOR SELECT TO authenticated USING (true);
CREATE POLICY "expenses_insert_own" ON public.expenses FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "expenses_update_own_or_admin" ON public.expenses FOR UPDATE TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "expenses_delete_own_or_admin" ON public.expenses FOR DELETE TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- Installments: mesma lógica de expenses
CREATE POLICY "inst_select_family" ON public.installments FOR SELECT TO authenticated USING (true);
CREATE POLICY "inst_insert_own" ON public.installments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "inst_update_own_or_admin" ON public.installments FOR UPDATE TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "inst_delete_own_or_admin" ON public.installments FOR DELETE TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- Goals: privadas
CREATE POLICY "goals_own" ON public.goals FOR ALL TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- Notifications: privadas
CREATE POLICY "notif_own" ON public.notifications FOR ALL TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- ===== TRIGGERS =====
-- updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_expenses_updated BEFORE UPDATE ON public.expenses FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_goals_updated BEFORE UPDATE ON public.goals FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Handle new user: profile + role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, nome, sobrenome, email, foto_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nome', split_part(COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email), ' ', 1)),
    COALESCE(NEW.raw_user_meta_data->>'sobrenome', ''),
    NEW.email,
    NEW.raw_user_meta_data->>'avatar_url'
  );
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'member');
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-gerar parcelas ao criar despesa
CREATE OR REPLACE FUNCTION public.generate_installments()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  qtd INT;
  valor_parcela NUMERIC(12,2);
  i INT;
  data_venc DATE;
BEGIN
  IF NEW.parcelado THEN qtd := GREATEST(NEW.quantidade_parcelas, 1);
  ELSE qtd := 1;
  END IF;

  valor_parcela := ROUND(NEW.valor_total / qtd, 2);

  FOR i IN 1..qtd LOOP
    data_venc := (NEW.data_compra + ((i - 1) || ' month')::INTERVAL)::DATE;
    INSERT INTO public.installments (expense_id, user_id, numero, valor, mes, ano, vencimento, status)
    VALUES (
      NEW.id, NEW.user_id, i, valor_parcela,
      EXTRACT(MONTH FROM data_venc)::INT,
      EXTRACT(YEAR FROM data_venc)::INT,
      data_venc,
      'aberta'
    );
  END LOOP;

  RETURN NEW;
END; $$;

CREATE TRIGGER trg_expense_installments
  AFTER INSERT ON public.expenses
  FOR EACH ROW EXECUTE FUNCTION public.generate_installments();

-- Marcar atrasadas via função (chamada pelo app quando necessário)
CREATE OR REPLACE FUNCTION public.mark_overdue_installments()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.installments
  SET status = 'atrasada'
  WHERE status = 'aberta' AND vencimento < CURRENT_DATE;
$$;

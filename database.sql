CREATE TABLE public.cart_items (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  cart_id uuid NOT NULL,
  product_id uuid NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT cart_items_pkey PRIMARY KEY (id),
  CONSTRAINT cart_items_cart_id_product_id_key UNIQUE (cart_id, product_id),
  CONSTRAINT cart_items_cart_id_fkey FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
  CONSTRAINT cart_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) TABLESPACE pg_default;

CREATE TABLE public.carts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NULL,
  session_id text NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT carts_pkey PRIMARY KEY (id),
  CONSTRAINT carts_session_id_key UNIQUE (session_id),
  CONSTRAINT carts_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL
) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS cart_user_index ON public.carts USING btree (user_id) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS cart_session_index ON public.carts USING btree (session_id) TABLESPACE pg_default;

CREATE TABLE public.categories (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NULL,
  slug text NOT NULL,
  image_url text NULL,
  parent_id uuid NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT categories_pkey PRIMARY KEY (id),
  CONSTRAINT categories_slug_key UNIQUE (slug),
  CONSTRAINT categories_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES categories(id)
) TABLESPACE pg_default;

CREATE TABLE public.orders (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NULL,
  status text NOT NULL DEFAULT 'pending'::text,
  total_amount numeric(12,2) NOT NULL,
  shipping_address text NOT NULL,
  shipping_city text NOT NULL,
  shipping_province text NOT NULL,
  shipping_postal_code text NOT NULL,
  shipping_method text NULL,
  shipping_fee numeric(10,2) NULL DEFAULT 0,
  payment_method text NULL,
  payment_status text NULL DEFAULT 'pending'::text,
  notes text NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT orders_pkey PRIMARY KEY (id),
  CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL
) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS order_user_index ON public.orders USING btree (user_id) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS order_status_index ON public.orders USING btree (status) TABLESPACE pg_default;

CREATE TABLE public.product_images (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL,
  image_url text NOT NULL,
  alt_text text,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  is_primary boolean NULL DEFAULT false,
  CONSTRAINT product_images_pkey PRIMARY KEY (id),
  CONSTRAINT product_images_product_id_fkey FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) TABLESPACE pg_default;

CREATE TABLE public.products (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  slug text NOT NULL,
  price numeric(10,2) NOT NULL,
  sale_price numeric(10,2),
  stock_quantity integer NOT NULL DEFAULT 0,
  sku text,
  category_id uuid NULL,
  brand text,
  main_image_url text,
  is_active boolean NULL DEFAULT true,
  weight numeric(8,2),
  dimensions text,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  is_featured boolean NULL DEFAULT false,
  CONSTRAINT products_pkey PRIMARY KEY (id),
  CONSTRAINT products_sku_key UNIQUE (sku),
  CONSTRAINT products_slug_key UNIQUE (slug),
  CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES categories(id)
) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS product_category_index ON public.products USING btree (category_id) TABLESPACE pg_default;

CREATE TABLE public.profiles (
  id uuid NOT NULL,
  full_name text,
  phone_number text,
  address text,
  city text,
  province text,
  postal_code text,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  role_id bigint NOT NULL,
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT profiles_role_id_fkey FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS profiles_role_id_index ON public.profiles USING btree (role_id) TABLESPACE pg_default;

CREATE TABLE public.roles (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  name text NOT NULL,
  CONSTRAINT roles_pkey PRIMARY KEY (id),
  CONSTRAINT roles_name_key UNIQUE (name)
) TABLESPACE pg_default;
| table_name     | column_name          | data_type                |
| -------------- | -------------------- | ------------------------ |
| manufacturers  | updated_at           | timestamp with time zone |
| cart_items     | cart_id              | uuid                     |
| cart_items     | product_id           | uuid                     |
| cart_items     | quantity             | integer                  |
| cart_items     | created_at           | timestamp with time zone |
| cart_items     | updated_at           | timestamp with time zone |
| orders         | id                   | uuid                     |
| orders         | user_id              | uuid                     |
| orders         | total_amount         | numeric                  |
| orders         | shipping_fee         | numeric                  |
| orders         | created_at           | timestamp with time zone |
| orders         | updated_at           | timestamp with time zone |
| order_items    | id                   | uuid                     |
| order_items    | order_id             | uuid                     |
| order_items    | product_id           | uuid                     |
| order_items    | quantity             | integer                  |
| order_items    | price                | numeric                  |
| order_items    | subtotal             | numeric                  |
| order_items    | created_at           | timestamp with time zone |
| products       | id                   | uuid                     |
| products       | price                | numeric                  |
| products       | sale_price           | numeric                  |
| products       | stock_quantity       | integer                  |
| products       | category_id          | uuid                     |
| products       | is_active            | boolean                  |
| products       | weight               | numeric                  |
| products       | created_at           | timestamp with time zone |
| products       | updated_at           | timestamp with time zone |
| products       | is_featured          | boolean                  |
| products       | manufacturer_id      | uuid                     |
| manufacturers  | id                   | uuid                     |
| manufacturers  | created_at           | timestamp with time zone |
| roles          | id                   | bigint                   |
| profiles       | id                   | uuid                     |
| profiles       | created_at           | timestamp with time zone |
| profiles       | updated_at           | timestamp with time zone |
| profiles       | role_id              | bigint                   |
| product_images | id                   | uuid                     |
| product_images | product_id           | uuid                     |
| product_images | display_order        | integer                  |
| product_images | created_at           | timestamp with time zone |
| product_images | updated_at           | timestamp with time zone |
| product_images | is_primary           | boolean                  |
| categories     | id                   | uuid                     |
| categories     | parent_id            | uuid                     |
| categories     | created_at           | timestamp with time zone |
| categories     | updated_at           | timestamp with time zone |
| carts          | id                   | uuid                     |
| carts          | user_id              | uuid                     |
| carts          | created_at           | timestamp with time zone |
| carts          | updated_at           | timestamp with time zone |
| cart_items     | id                   | uuid                     |
| roles          | name                 | text                     |
| orders         | notes                | text                     |
| profiles       | full_name            | text                     |
| profiles       | phone_number         | text                     |
| profiles       | address              | text                     |
| profiles       | city                 | text                     |
| profiles       | province             | text                     |
| profiles       | postal_code          | text                     |
| products       | sku                  | text                     |
| manufacturers  | name                 | text                     |
| products       | name                 | text                     |
| products       | description          | text                     |
| products       | slug                 | text                     |
| product_images | image_url            | text                     |
| product_images | alt_text             | text                     |
| order_items    | product_name         | text                     |
| products       | brand                | text                     |
| orders         | status               | text                     |
| products       | main_image_url       | text                     |
| orders         | shipping_address     | text                     |
| categories     | name                 | text                     |
| categories     | description          | text                     |
| categories     | slug                 | text                     |
| categories     | image_url            | text                     |
| orders         | shipping_city        | text                     |
| orders         | shipping_province    | text                     |
| orders         | shipping_postal_code | text                     |
| orders         | shipping_method      | text                     |
| products       | dimensions           | text                     |
| carts          | session_id           | text                     |
| orders         | payment_method       | text                     |
| orders         | payment_status       | text                     |

---

| policy_name                                       | table_name     | roles                | using_condition                                                                                                                                                                          | with_check_condition |
| ------------------------------------------------- | -------------- | -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| select_roles                                      | roles          | {public}             | (auth.uid() IS NOT NULL)                                                                                                                                                                 | null                 |
| Allow public read access to categories            | categories     | {public}             | true                                                                                                                                                                                     | null                 |
| Allow public read access to products              | products       | {public}             | (is_active = true)                                                                                                                                                                       | null                 |
| Allow public read access to product images        | product_images | {public}             | true                                                                                                                                                                                     | null                 |
| Users can manage their own cart                   | carts          | {public}             | ((auth.uid() = user_id) OR ((user_id IS NULL) AND (session_id = current_setting('app.session_id'::text, true))))                                                                         | null                 |
| Users can manage their own cart items             | cart_items     | {public}             | (cart_id IN ( SELECT carts.id
   FROM carts
  WHERE ((carts.user_id = auth.uid()) OR ((carts.user_id IS NULL) AND (carts.session_id = current_setting('app.session_id'::text, true)))))) | null                 |
| Users can view their own orders                   | orders         | {public}             | (auth.uid() = user_id)                                                                                                                                                                   | null                 |
| Users can view their own order items              | order_items    | {public}             | (order_id IN ( SELECT orders.id
   FROM orders
  WHERE (orders.user_id = auth.uid())))                                                                                                   | null                 |
| Anyone can upload                                 | product_images | {anon,authenticated} | null                                                                                                                                                                                     | true                 |
| Anyone can view                                   | product_images | {anon,authenticated} | true                                                                                                                                                                                     | null                 |
| Allow select for all users                        | products       | {public}             | true                                                                                                                                                                                     | null                 |
| Allow insert for authenticated users              | products       | {authenticated}      | null                                                                                                                                                                                     | true                 |
| Allow update for authenticated users              | products       | {authenticated}      | true                                                                                                                                                                                     | true                 |
| Allow delete for authenticated users              | products       | {authenticated}      | true                                                                                                                                                                                     | null                 |
| Allow select for all users                        | product_images | {public}             | true                                                                                                                                                                                     | null                 |
| Allow insert for authenticated users              | product_images | {authenticated}      | null                                                                                                                                                                                     | true                 |
| Allow update for authenticated users              | product_images | {authenticated}      | true                                                                                                                                                                                     | true                 |
| Allow delete for authenticated users              | product_images | {authenticated}      | true                                                                                                                                                                                     | null                 |
| Enable all operations for authenticated users     | roles          | {authenticated}      | true                                                                                                                                                                                     | true                 |
| Enable read access for all users                  | roles          | {public}             | true                                                                                                                                                                                     | null                 |
| Enable all operations for authenticated users     | profiles       | {authenticated}      | true                                                                                                                                                                                     | true                 |
| Enable read access for all users                  | profiles       | {public}             | true                                                                                                                                                                                     | null                 |
| Enable all operations for authenticated users     | categories     | {authenticated}      | true                                                                                                                                                                                     | true                 |
| Enable read access for all users                  | categories     | {public}             | true                                                                                                                                                                                     | null                 |
| Enable all operations for authenticated users     | carts          | {authenticated}      | true                                                                                                                                                                                     | true                 |
| Enable read access for all users                  | carts          | {public}             | true                                                                                                                                                                                     | null                 |
| Enable all operations for authenticated users     | cart_items     | {authenticated}      | true                                                                                                                                                                                     | true                 |
| Enable read access for all users                  | cart_items     | {public}             | true                                                                                                                                                                                     | null                 |
| Enable all operations for authenticated users     | orders         | {authenticated}      | true                                                                                                                                                                                     | true                 |
| Enable read access for all users                  | orders         | {public}             | true                                                                                                                                                                                     | null                 |
| Enable all operations for authenticated users     | order_items    | {authenticated}      | true                                                                                                                                                                                     | true                 |
| Enable read access for all users                  | order_items    | {public}             | true                                                                                                                                                                                     | null                 |
| Enable all operations for authenticated users     | products       | {authenticated}      | true                                                                                                                                                                                     | true                 |
| Enable read access for all users                  | products       | {public}             | true                                                                                                                                                                                     | null                 |
| Enable all operations for authenticated users     | product_images | {authenticated}      | true                                                                                                                                                                                     | true                 |
| Enable read access for all users                  | product_images | {public}             | true                                                                                                                                                                                     | null                 |
| product_images_insert_policy                      | product_images | {authenticated}      | null                                                                                                                                                                                     | true                 |
| product_images_update_policy                      | product_images | {authenticated}      | true                                                                                                                                                                                     | null                 |
| product_images_delete_policy                      | product_images | {authenticated}      | true                                                                                                                                                                                     | null                 |
| product_images_select_policy                      | product_images | {anon,authenticated} | true                                                                                                                                                                                     | null                 |
| Users can view their own profile                  | profiles       | {authenticated}      | (auth.uid() = id)                                                                                                                                                                        | null                 |
| Users can update their own profile                | profiles       | {authenticated}      | (auth.uid() = id)                                                                                                                                                                        | (auth.uid() = id)    |
| Users can insert their own profile                | profiles       | {authenticated}      | null                                                                                                                                                                                     | (auth.uid() = id)    |
| Users can delete their own profile                | profiles       | {authenticated}      | (auth.uid() = id)                                                                                                                                                                        | null                 |
| Allow authenticated users to select manufacturers | manufacturers  | {authenticated}      | true                                                                                                                                                                                     | null                 |
| Allow authenticated users to insert manufacturers | manufacturers  | {authenticated}      | null                                                                                                                                                                                     | true                 |
| Allow authenticated users to update manufacturers | manufacturers  | {authenticated}      | true                                                                                                                                                                                     | true                 |
| Allow authenticated users to delete manufacturers | manufacturers  | {authenticated}      | true                                                                                                                                                                                     | null                 |
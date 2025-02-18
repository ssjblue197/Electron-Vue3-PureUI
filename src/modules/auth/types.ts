export interface User {
  id?: number;
  name?: string;
  email?: string;
  is_support?: boolean;
  assign_at?: string;
  assign_history?: string;
  created_at?: string;
  department?: string;
  department_id?: number;
  expired_at?: string;
  first_name?: string;
  gender?: string;
  group_id?: number;
  is_active?: number;
  is_admin?: number;
  is_all_warehouse?: number;
  is_lavender_editor?: number;
  last_login_at?: string;
  last_name?: string;
  password_tmp?: string;
  store_ids?: string;
  title?: string;
  updated_at?: string;
  username?: string;
}

export interface Form {
  username?: string;
  email?: string;
  password?: string;
  address?: {
    country?: string;
    city?: string;
  };
  support_login?: boolean;
}

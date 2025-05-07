export interface StoreSetting {
  id: string;
  store_name: string;
  store_description?: string;
  contact_email: string;
  contact_phone?: string;
  address?: string;
  city?: string;
  province?: string;
  postal_code?: string;
  country?: string;
  currency: string;
  logo_url?: string;
  favicon_url?: string;
  social_media?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
    whatsapp?: string;
  };
  meta_title?: string;
  meta_description?: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentSetting {
  id: string;
  provider: string;
  is_enabled: boolean;
  config: Record<string, any>;
  display_name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface ShippingSetting {
  id: string;
  provider: string;
  is_enabled: boolean;
  config: Record<string, any>;
  display_name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface NotificationSetting {
  id: string;
  type: string;
  is_enabled: boolean;
  email_template?: string;
  sms_template?: string;
  created_at: string;
  updated_at: string;
}

export type SettingCategory = 'store' | 'payment' | 'shipping' | 'notification';

export interface StoreSettingFormValues {
  store_name: string;
  store_description?: string;
  contact_email: string;
  contact_phone?: string;
  address?: string;
  city?: string;
  province?: string;
  postal_code?: string;
  country?: string;
  currency: string;
  logo_url?: string;
  favicon_url?: string;
  social_media?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
    whatsapp?: string;
  };
  meta_title?: string;
  meta_description?: string;
}

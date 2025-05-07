'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  useStoreSettings, 
  useUpdateStoreSettings,
  usePaymentSettings,
  useShippingSettings,
  useNotificationSettings
} from '@/api/hooks/useSettings';
import { StoreSettingFormValues } from '@/api/types/settings';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

import {
  Store,
  CreditCard,
  Truck,
  Bell,
  Loader2,
  Building,
  Mail,
  Phone,
  MapPin,
  Globe,
  Image,
  Save,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  MessageSquare,
} from 'lucide-react';

// Define validation schema for store settings
const storeSettingsSchema = z.object({
  store_name: z.string().min(1, 'Nama toko harus diisi'),
  store_description: z.string().nullable().optional(),
  contact_email: z.string().email('Format email tidak valid'),
  contact_phone: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  province: z.string().nullable().optional(),
  postal_code: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
  currency: z.string().min(1, 'Mata uang harus diisi'),
  logo_url: z.string().nullable().optional(),
  favicon_url: z.string().nullable().optional(),
  social_media: z.object({
    facebook: z.string().nullable().optional(),
    instagram: z.string().nullable().optional(),
    twitter: z.string().nullable().optional(),
    youtube: z.string().nullable().optional(),
    whatsapp: z.string().nullable().optional(),
  }).nullable().optional(),
  meta_title: z.string().nullable().optional(),
  meta_description: z.string().nullable().optional(),
});

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('store');
  
  // Fetch settings data
  const { data: storeSettings, isLoading: loadingStore } = useStoreSettings();
  const { data: paymentSettings, isLoading: loadingPayment } = usePaymentSettings();
  const { data: shippingSettings, isLoading: loadingShipping } = useShippingSettings();
  const { data: notificationSettings, isLoading: loadingNotification } = useNotificationSettings();
  
  // Update store settings mutation
  const { mutateAsync: updateStoreSettings, isPending: isUpdatingStore } = useUpdateStoreSettings();

  // Initialize form with store settings data
  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    reset 
  } = useForm<StoreSettingFormValues>({
    resolver: zodResolver(storeSettingsSchema),
    defaultValues: {
      store_name: '',
      store_description: '',
      contact_email: '',
      contact_phone: '',
      address: '',
      city: '',
      province: '',
      postal_code: '',
      country: '',
      currency: 'IDR',
      logo_url: '',
      favicon_url: '',
      social_media: {
        facebook: '',
        instagram: '',
        twitter: '',
        youtube: '',
        whatsapp: '',
      },
      meta_title: '',
      meta_description: '',
    }
  });

  // Update form when store settings are loaded
  useState(() => {
    if (storeSettings) {
      reset({
        store_name: storeSettings.store_name,
        store_description: storeSettings.store_description || '',
        contact_email: storeSettings.contact_email,
        contact_phone: storeSettings.contact_phone || '',
        address: storeSettings.address || '',
        city: storeSettings.city || '',
        province: storeSettings.province || '',
        postal_code: storeSettings.postal_code || '',
        country: storeSettings.country || '',
        currency: storeSettings.currency,
        logo_url: storeSettings.logo_url || '',
        favicon_url: storeSettings.favicon_url || '',
        social_media: storeSettings.social_media || {
          facebook: '',
          instagram: '',
          twitter: '',
          youtube: '',
          whatsapp: '',
        },
        meta_title: storeSettings.meta_title || '',
        meta_description: storeSettings.meta_description || '',
      });
    }
  }, [storeSettings, reset]);

  // Handle store settings form submission
  const onSubmitStoreSettings = async (data: StoreSettingFormValues) => {
    try {
      await updateStoreSettings(data);
    } catch (error) {
      console.error('Error saving store settings:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Pengaturan</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="store" className="flex items-center space-x-2">
            <Store className="h-4 w-4" />
            <span>Toko</span>
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex items-center space-x-2">
            <CreditCard className="h-4 w-4" />
            <span>Pembayaran</span>
          </TabsTrigger>
          <TabsTrigger value="shipping" className="flex items-center space-x-2">
            <Truck className="h-4 w-4" />
            <span>Pengiriman</span>
          </TabsTrigger>
          <TabsTrigger value="notification" className="flex items-center space-x-2">
            <Bell className="h-4 w-4" />
            <span>Notifikasi</span>
          </TabsTrigger>
        </TabsList>

        {/* Store Settings Tab */}
        <TabsContent value="store">
          {loadingStore ? (
            <div className="flex h-60 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmitStoreSettings)}>
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Building className="mr-2 h-5 w-5" />
                      Informasi Toko
                    </CardTitle>
                    <CardDescription>
                      Informasi dasar tentang toko Anda
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="store_name">Nama Toko</Label>
                        <Input
                          id="store_name"
                          placeholder="contoh: Agro Mandiri"
                          {...register('store_name')}
                        />
                        {errors.store_name && (
                          <p className="text-sm text-destructive">{errors.store_name.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="currency">Mata Uang</Label>
                        <Input
                          id="currency"
                          placeholder="contoh: IDR"
                          {...register('currency')}
                        />
                        {errors.currency && (
                          <p className="text-sm text-destructive">{errors.currency.message}</p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="store_description">Deskripsi Toko</Label>
                      <Textarea
                        id="store_description"
                        placeholder="Deskripsi singkat tentang toko Anda"
                        rows={3}
                        {...register('store_description')}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MapPin className="mr-2 h-5 w-5" />
                      Informasi Kontak
                    </CardTitle>
                    <CardDescription>
                      Informasi kontak dan alamat toko
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="contact_email">Email</Label>
                        <Input
                          id="contact_email"
                          type="email"
                          placeholder="email@contoh.com"
                          {...register('contact_email')}
                        />
                        {errors.contact_email && (
                          <p className="text-sm text-destructive">{errors.contact_email.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contact_phone">Telepon</Label>
                        <Input
                          id="contact_phone"
                          placeholder="+628123456789"
                          {...register('contact_phone')}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Alamat</Label>
                      <Textarea
                        id="address"
                        placeholder="Alamat lengkap toko"
                        rows={2}
                        {...register('address')}
                      />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor="city">Kota</Label>
                        <Input
                          id="city"
                          placeholder="contoh: Jakarta"
                          {...register('city')}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="province">Provinsi</Label>
                        <Input
                          id="province"
                          placeholder="contoh: DKI Jakarta"
                          {...register('province')}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="postal_code">Kode Pos</Label>
                        <Input
                          id="postal_code"
                          placeholder="contoh: 12345"
                          {...register('postal_code')}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Negara</Label>
                      <Input
                        id="country"
                        placeholder="contoh: Indonesia"
                        {...register('country')}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Image className="mr-2 h-5 w-5" />
                      Media & Branding
                    </CardTitle>
                    <CardDescription>
                      Logo, favicon, dan branding toko
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="logo_url">URL Logo</Label>
                        <Input
                          id="logo_url"
                          placeholder="https://contoh.com/logo.png"
                          {...register('logo_url')}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="favicon_url">URL Favicon</Label>
                        <Input
                          id="favicon_url"
                          placeholder="https://contoh.com/favicon.ico"
                          {...register('favicon_url')}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Globe className="mr-2 h-5 w-5" />
                      SEO
                    </CardTitle>
                    <CardDescription>
                      Pengaturan SEO untuk toko
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="meta_title">Meta Title</Label>
                      <Input
                        id="meta_title"
                        placeholder="contoh: Agro Mandiri - Toko Pertanian Terlengkap"
                        {...register('meta_title')}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="meta_description">Meta Description</Label>
                      <Textarea
                        id="meta_description"
                        placeholder="Deskripsi singkat untuk SEO"
                        rows={3}
                        {...register('meta_description')}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MessageSquare className="mr-2 h-5 w-5" />
                      Media Sosial
                    </CardTitle>
                    <CardDescription>
                      Link media sosial toko
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="facebook" className="flex items-center">
                          <Facebook className="mr-2 h-4 w-4" />
                          Facebook
                        </Label>
                        <Input
                          id="facebook"
                          placeholder="https://facebook.com/agromandiri"
                          {...register('social_media.facebook')}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="instagram" className="flex items-center">
                          <Instagram className="mr-2 h-4 w-4" />
                          Instagram
                        </Label>
                        <Input
                          id="instagram"
                          placeholder="https://instagram.com/agromandiri"
                          {...register('social_media.instagram')}
                        />
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="twitter" className="flex items-center">
                          <Twitter className="mr-2 h-4 w-4" />
                          Twitter
                        </Label>
                        <Input
                          id="twitter"
                          placeholder="https://twitter.com/agromandiri"
                          {...register('social_media.twitter')}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="youtube" className="flex items-center">
                          <Youtube className="mr-2 h-4 w-4" />
                          Youtube
                        </Label>
                        <Input
                          id="youtube"
                          placeholder="https://youtube.com/agromandiri"
                          {...register('social_media.youtube')}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="whatsapp" className="flex items-center">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        WhatsApp
                      </Label>
                      <Input
                        id="whatsapp"
                        placeholder="+628123456789"
                        {...register('social_media.whatsapp')}
                      />
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end">
                  <Button type="submit" disabled={isUpdatingStore}>
                    {isUpdatingStore ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Simpan Pengaturan
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          )}
        </TabsContent>

        {/* Payment Settings Tab */}
        <TabsContent value="payment">
          {loadingPayment ? (
            <div className="flex h-60 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Metode Pembayaran</CardTitle>
                  <CardDescription>
                    Kelola metode pembayaran yang tersedia
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {paymentSettings && paymentSettings.length > 0 ? (
                    <div className="space-y-4">
                      {paymentSettings.map((payment) => (
                        <div key={payment.id} className="flex items-center justify-between rounded-lg border p-4">
                          <div className="flex items-center space-x-4">
                            <div>
                              <h3 className="font-medium">{payment.display_name}</h3>
                              <p className="text-sm text-muted-foreground">{payment.description}</p>
                            </div>
                          </div>
                          <Switch 
                            checked={payment.is_enabled}
                            // In a real implementation, this would update the payment setting
                            onCheckedChange={() => {}}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex h-40 flex-col items-center justify-center space-y-3 text-center">
                      <CreditCard className="h-10 w-10 text-muted-foreground" />
                      <div>
                        <p className="text-lg font-medium">Belum ada metode pembayaran</p>
                        <p className="text-sm text-muted-foreground">
                          Anda belum menambahkan metode pembayaran
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="justify-end">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Metode Pembayaran
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Shipping Settings Tab */}
        <TabsContent value="shipping">
          {loadingShipping ? (
            <div className="flex h-60 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Metode Pengiriman</CardTitle>
                  <CardDescription>
                    Kelola metode pengiriman yang tersedia
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {shippingSettings && shippingSettings.length > 0 ? (
                    <div className="space-y-4">
                      {shippingSettings.map((shipping) => (
                        <div key={shipping.id} className="flex items-center justify-between rounded-lg border p-4">
                          <div className="flex items-center space-x-4">
                            <div>
                              <h3 className="font-medium">{shipping.display_name}</h3>
                              <p className="text-sm text-muted-foreground">{shipping.description}</p>
                            </div>
                          </div>
                          <Switch 
                            checked={shipping.is_enabled}
                            // In a real implementation, this would update the shipping setting
                            onCheckedChange={() => {}}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex h-40 flex-col items-center justify-center space-y-3 text-center">
                      <Truck className="h-10 w-10 text-muted-foreground" />
                      <div>
                        <p className="text-lg font-medium">Belum ada metode pengiriman</p>
                        <p className="text-sm text-muted-foreground">
                          Anda belum menambahkan metode pengiriman
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="justify-end">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Metode Pengiriman
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Notification Settings Tab */}
        <TabsContent value="notification">
          {loadingNotification ? (
            <div className="flex h-60 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Pengaturan Notifikasi</CardTitle>
                  <CardDescription>
                    Kelola notifikasi email dan SMS
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {notificationSettings && notificationSettings.length > 0 ? (
                    <div className="space-y-4">
                      {notificationSettings.map((notification) => (
                        <div key={notification.id} className="flex items-center justify-between rounded-lg border p-4">
                          <div>
                            <h3 className="font-medium">
                              {notification.type === 'order_placed' && 'Pesanan Baru'}
                              {notification.type === 'order_paid' && 'Pembayaran Diterima'}
                              {notification.type === 'order_shipped' && 'Pesanan Dikirim'}
                              {notification.type === 'order_delivered' && 'Pesanan Diterima'}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {notification.email_template ? 'Email' : ''}
                              {notification.email_template && notification.sms_template ? ' & ' : ''}
                              {notification.sms_template ? 'SMS' : ''}
                            </p>
                          </div>
                          <Switch 
                            checked={notification.is_enabled}
                            // In a real implementation, this would update the notification setting
                            onCheckedChange={() => {}}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex h-40 flex-col items-center justify-center space-y-3 text-center">
                      <Bell className="h-10 w-10 text-muted-foreground" />
                      <div>
                        <p className="text-lg font-medium">Belum ada pengaturan notifikasi</p>
                        <p className="text-sm text-muted-foreground">
                          Anda belum menambahkan pengaturan notifikasi
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="justify-end">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Notifikasi
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

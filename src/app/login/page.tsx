'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/context/auth-context';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { signIn, signInWithGoogle, signInWithFacebook, signInWithPhone, verifyOtp } = useAuthContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpVerification, setShowOtpVerification] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Email dan password tidak boleh kosong');
      return;
    }

    setIsLoading(true);
    
    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        toast.error('Login gagal. Periksa email dan password Anda.');
      } else {
        toast.success('Login berhasil');
        router.push('/auth/confirm');
      }
    } catch (error) {
      console.error('Error during login:', error);
      toast.error('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await signInWithGoogle();
      
      if (error) {
        toast.error('Login dengan Google gagal.');
      }
    } catch (error) {
      console.error('Error during Google sign in:', error);
      toast.error('Terjadi kesalahan. Silakan coba lagi.');
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      const { error } = await signInWithFacebook();
      
      if (error) {
        toast.error('Login dengan Facebook gagal.');
      }
    } catch (error) {
      console.error('Error during Facebook sign in:', error);
      toast.error('Terjadi kesalahan. Silakan coba lagi.');
    }
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phone) {
      toast.error('Nomor telepon tidak boleh kosong');
      return;
    }

    // Format the phone number to include the country code if not already present
    const formattedPhone = phone.startsWith('+') ? phone : `+62${phone.replace(/^0/, '')}`;
    
    setIsLoading(true);
    
    try {
      const { error } = await signInWithPhone(formattedPhone);
      
      if (error) {
        toast.error('Gagal mengirim OTP. Periksa nomor telepon Anda.');
      } else {
        setShowOtpVerification(true);
        toast.success('Kode OTP telah dikirim ke nomor telepon Anda');
      }
    } catch (error) {
      console.error('Error during phone sign in:', error);
      toast.error('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp) {
      toast.error('Kode OTP tidak boleh kosong');
      return;
    }

    const formattedPhone = phone.startsWith('+') ? phone : `+62${phone.replace(/^0/, '')}`;
    
    setIsLoading(true);
    
    try {
      const { error } = await verifyOtp(formattedPhone, otp);
      
      if (error) {
        toast.error('Verifikasi OTP gagal. Periksa kode OTP Anda.');
      } else {
        toast.success('Login berhasil');
        router.push('/auth/confirm');
      }
    } catch (error) {
      console.error('Error during OTP verification:', error);
      toast.error('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4 sm:p-6">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold text-gray-900">Agro Mandiri</h1>
          <p className="text-center text-sm text-muted-foreground mt-2">
            Portal Admin
          </p>
        </div>
        
        <Card className="shadow-lg border-gray-200">
          <CardHeader className="pb-6">
            <CardTitle className="text-xl font-semibold">Login</CardTitle>
            <CardDescription className="mt-1">
              Masuk ke panel admin Agro Mandiri
            </CardDescription>
          </CardHeader>
          
          <Tabs defaultValue="email" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="email" className="text-sm font-medium">Email</TabsTrigger>
              <TabsTrigger value="phone" className="text-sm font-medium">Telepon</TabsTrigger>
              <TabsTrigger value="social" className="text-sm font-medium">Media Sosial</TabsTrigger>
            </TabsList>
            
            <TabsContent value="email">
              <form onSubmit={handleEmailSubmit}>
                <CardContent className="space-y-5 pt-4 px-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@agroworld.id"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Button
                        variant="link"
                        className="h-auto p-0 text-xs"
                        type="button"
                        onClick={() => router.push('/reset-password')}
                      >
                        Lupa Password?
                      </Button>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full h-11 font-medium" type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Memproses...
                      </>
                    ) : (
                      'Login'
                    )}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
            
            <TabsContent value="phone">
              {!showOtpVerification ? (
                <form onSubmit={handlePhoneSubmit}>
                  <CardContent className="space-y-5 pt-4 px-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Nomor Telepon</Label>
                      <div className="flex">
                        <div className="flex items-center justify-center bg-muted px-3 rounded-l-md border border-r-0 border-input w-12 text-sm font-medium">
                          +62
                        </div>
                        <Input
                          id="phone"
                          type="tel"
                          className="rounded-l-none h-11"
                          placeholder="8123456789"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          required
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Format: 8123456789 (tanpa awalan 0)
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full h-11 font-medium" type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Mengirim OTP...
                        </>
                      ) : (
                        'Kirim Kode OTP'
                      )}
                    </Button>
                  </CardFooter>
                </form>
              ) : (
                <form onSubmit={handleOtpVerification}>
                  <CardContent className="space-y-5 pt-4 px-6">
                    <div className="space-y-2">
                      <Label htmlFor="otp">Kode OTP</Label>
                      <Input
                        id="otp"
                        type="text"
                        placeholder="Masukkan kode OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="h-11"
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        Masukkan kode 6 digit yang dikirim ke nomor telepon Anda
                      </p>
                    </div>
                    <Button
                      variant="link"
                      className="h-auto p-0 text-xs"
                      type="button"
                      onClick={() => setShowOtpVerification(false)}
                    >
                      Gunakan nomor telepon lain
                    </Button>
                  </CardContent>
                  <CardFooter className="pt-2 pb-6 px-6">
                    <Button className="w-full h-11 font-medium" type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Memverifikasi...
                        </>
                      ) : (
                        'Verifikasi OTP'
                      )}
                    </Button>
                  </CardFooter>
                </form>
              )}
            </TabsContent>
            
            <TabsContent value="social">
              <CardContent className="space-y-5 pt-4 px-6">
                <Button
                  variant="outline"
                  className="w-full flex justify-center items-center space-x-3 h-11 border border-gray-200 hover:bg-gray-50"
                  onClick={handleGoogleSignIn}
                  type="button"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  <span>Login dengan Google</span>
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full flex justify-center items-center space-x-3 h-11 border border-gray-200 hover:bg-gray-50"
                  onClick={handleFacebookSignIn}
                  type="button"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#1877F2]" fill="currentColor">
                    <path
                      d="M9.19795 21.5H13.198V13.4901H16.8021L17.198 9.50977H13.198V7.5C13.198 6.94772 13.6457 6.5 14.198 6.5H17.198V2.5H14.198C11.4365 2.5 9.19795 4.73858 9.19795 7.5V9.50977H7.19795L6.80206 13.4901H9.19795V21.5Z"
                    />
                  </svg>
                  <span>Login dengan Facebook</span>
                </Button>
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}

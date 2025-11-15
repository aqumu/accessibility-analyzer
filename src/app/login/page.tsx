"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!error && data?.user) {
        router.replace("/"); // use replace() to avoid back button issues
      }
    })();
  }, [router]);

  const isValidEmail = (email: string) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const signInWithEmail = async () => {
    if (!email) return setErrorMsg("Пожалуйста, введите адрес электронной почты.");
    if (!isValidEmail(email)) return setErrorMsg("Пожалуйста, введите корректный адрес электронной почты.");

    setErrorMsg("");
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) setMessage(`Ошибка: ${error.message}`);
    else setMessage("Проверьте вашу почту для ссылки входа!");
    setLoading(false);
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/` },
    });
    if (error) setMessage(`Ошибка: ${error.message}`);
    setLoading(false);
  };

  return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-sm shadow-md border rounded-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-semibold">С возвращением</CardTitle>
            <CardDescription>
              Введите ваш email для входа или создания аккаунта
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col gap-4">
              <div>
                <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errorMsg) setErrorMsg("");
                    }}
                    aria-label="Поле для ввода email"
                />
                {errorMsg && (
                    <p className="text-sm text-destructive mt-1">{errorMsg}</p>
                )}
              </div>

              <Button
                  onClick={signInWithEmail}
                  disabled={loading || !isValidEmail(email)}
                  className="w-full"
              >
                {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Отправка…
                    </>
                ) : (
                    "Отправить ссылку для входа"
                )}
              </Button>
            </div>

            <div className="my-6 flex items-center gap-4">
              <Separator className="flex-1" />
              <span className="text-xs text-muted-foreground">ИЛИ</span>
              <Separator className="flex-1" />
            </div>

            <Button
                onClick={signInWithGoogle}
                disabled={loading}
                variant="outline"
                className="w-full"
            >
              Войти через Google
            </Button>

            {message && (
                <p className="text-center text-sm text-muted-foreground mt-4">
                  {message}
                </p>
            )}
          </CardContent>

          <CardFooter />
        </Card>
      </div>
  );
}

"use client";

//shadcn
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

//hook-form
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

//next
import Link from "next/link";

//schema
import { LoginBody, LoginBodyType } from "@/schemaValidations/auth.schema";

//icon
import { ChevronLeft } from "lucide-react";

//query
import { useLoginMutation } from "@/queries/useAuth";

//hook
import { toast } from "@/hooks/use-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useAppContext } from "@/components/app-provider";
import { RoleType } from "@/constants/type";

const LoginForm = () => {
  const loginMutation = useLoginMutation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const clearTokens = searchParams.get("clearTokens");
  const { setRole } = useAppContext();

  const form = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBody),
    defaultValues: {
      username: "admin@gmail.com",
      password: "123123",
    },
  });

  const onSubmit = async (data: LoginBodyType) => {
    if (loginMutation.isPending) return;

    try {
      const result = await loginMutation.mutateAsync(data);
      toast({
        description: result.payload.message,
      });
      setRole(result.payload.data.user.role as RoleType);
      router.push("/manage/dashboard");
    } catch (error: any) {
      toast({
        description: "Tài khoản hoặc mật khẩu không đúng",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (clearTokens) {
      setRole();
    }
  }, [clearTokens, setRole]);

  return (
    <div className="flex items-center justify-center h-[550px] ">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <Link href={"/"}>
            <ChevronLeft />
          </Link>
          <CardTitle className="text-2xl text-center">Đăng nhập</CardTitle>
          <CardDescription>
            Nhập email và mật khẩu của bạn để đăng nhập vào hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              className="space-y-2 max-w-[600px] flex-shrink-0 w-full"
              onSubmit={form.handleSubmit(onSubmit, (err) => {
                console.log(err);
              })}
              noValidate
            >
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid gap-2">
                        <Label htmlFor="email">Tài khoản</Label>
                        <Input id="username" type="email" required {...field} />
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid gap-2">
                        <Label>Mật khẩu</Label>
                        <Input
                          id="password"
                          type="password"
                          required
                          {...field}
                        />
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  Đăng nhập
                </Button>
                <Button variant="outline" className="w-full" type="button">
                  Đăng nhập bằng Google
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;

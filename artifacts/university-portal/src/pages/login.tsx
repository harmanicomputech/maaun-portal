import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLogin } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const { login } = useAuth();
  const [, setLocation] = useLocation();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useLogin({
    mutation: {
      onSuccess: (data) => {
        login(data.token);
        setLocation(`/${data.user.role}/dashboard`);
      },
      onError: (error: any) => {
        setErrorMsg(error.message || "Invalid credentials");
      },
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    setErrorMsg(null);
    loginMutation.mutate({ data });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="space-y-2 text-center pb-8 pt-8">
          <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <span className="text-primary font-bold text-xl tracking-tight">MAAUN</span>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Welcome Back</CardTitle>
          <CardDescription>
            Maryam Abacha American University of Nigeria Portal
          </CardDescription>
        </CardHeader>
        <CardContent>
          {errorMsg && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{errorMsg}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input placeholder="name@maaun.edu.ng" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                className="w-full mt-2" 
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Sign In
              </Button>
            </form>
          </Form>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>Don't have an account? <Link href="/register" className="text-primary hover:underline font-medium">Register here</Link></p>
          </div>
          
          <div className="mt-8 p-4 bg-muted/50 rounded-lg text-xs text-muted-foreground">
            <p className="font-semibold mb-1 text-foreground">Demo Credentials:</p>
            <p>Admin: admin@maaun.edu.ng</p>
            <p>Student: aisha.mohammed@student.maaun.edu.ng</p>
            <p>Lecturer: ibrahim.musa@maaun.edu.ng</p>
            <p className="mt-1 font-medium">Password for all: <span className="font-mono text-foreground">maaun2024</span></p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

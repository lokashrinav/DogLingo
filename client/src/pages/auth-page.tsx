import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dog, Mail, User, Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema } from "@shared/schema";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = insertUserSchema.extend({
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const { toast } = useToast();

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      dogName: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginFormData) => {
      const res = await apiRequest("POST", "/api/login", credentials);
      return await res.json();
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["/api/user"], user);
      toast({
        title: "Welcome back!",
        description: `Good to see you again, ${user.username}!`,
      });
      window.location.href = "/";
    },
    onError: () => {
      toast({
        title: "Login failed",
        description: "Invalid username or password",
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (credentials: Omit<RegisterFormData, "confirmPassword">) => {
      const res = await apiRequest("POST", "/api/register", credentials);
      return await res.json();
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["/api/user"], user);
      toast({
        title: "Welcome to DogLingo!",
        description: `Account created successfully. Welcome, ${user.username}!`,
      });
      window.location.href = "/";
    },
    onError: (error: any) => {
      toast({
        title: "Registration failed",
        description: error.message || "Failed to create account",
        variant: "destructive",
      });
    },
  });

  const onLoginSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  const onRegisterSubmit = (data: RegisterFormData) => {
    const { confirmPassword, ...registrationData } = data;
    registerMutation.mutate(registrationData);
  };

  return (
    <div className="min-h-screen bg-muted/30 polka-dots-accent flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Column - Hero Section */}
        <div className="text-center lg:text-left text-foreground">
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto lg:mx-0 bg-secondary/20 rounded-full flex items-center justify-center mb-6 polka-dots-card">
              <Dog size={48} className="text-secondary" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Welcome to DogLingo
            </h1>
            <p className="text-xl text-muted-foreground mb-4">
              Learn to speak dog! Master barking, body language, and training commands through interactive lessons.
            </p>
            <p className="text-lg text-muted-foreground">
              Join thousands of dog owners who have strengthened their bond through better communication.
            </p>
          </div>

          {/* Feature highlights */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 justify-center lg:justify-start">
              <div className="w-8 h-8 bg-secondary/20 rounded-full flex items-center justify-center polka-dots-subtle">
                <Dog className="text-secondary" size={16} />
              </div>
              <span className="text-muted-foreground">Learn barking translation</span>
            </div>
            <div className="flex items-center gap-3 justify-center lg:justify-start">
              <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center polka-dots-subtle">
                <User className="text-accent" size={16} />
              </div>
              <span className="text-muted-foreground">Track your progress and streaks</span>
            </div>
            <div className="flex items-center gap-3 justify-center lg:justify-start">
              <div className="w-8 h-8 bg-secondary/20 rounded-full flex items-center justify-center polka-dots-subtle">
                <Lock className="text-secondary" size={16} />
              </div>
              <span className="text-muted-foreground">Unlock achievements and badges</span>
            </div>
          </div>
        </div>

        {/* Right Column - Auth Forms */}
        <div className="flex justify-center">
          <Card className="w-full max-w-md polka-dots-card border border-border">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">
                {isLogin ? "Sign In" : "Create Account"}
              </CardTitle>
              <p className="text-muted-foreground">
                {isLogin 
                  ? "Welcome back! Sign in to continue your dog training journey."
                  : "Start your dog training adventure today!"
                }
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Login Form */}
              {isLogin ? (
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-username">Username</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-username"
                        placeholder="Enter your username"
                        className="pl-10"
                        data-testid="input-login-username"
                        {...loginForm.register("username")}
                      />
                    </div>
                    {loginForm.formState.errors.username && (
                      <p className="text-sm text-destructive">{loginForm.formState.errors.username.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="Enter your password"
                        className="pl-10"
                        data-testid="input-login-password"
                        {...loginForm.register("password")}
                      />
                    </div>
                    {loginForm.formState.errors.password && (
                      <p className="text-sm text-destructive">{loginForm.formState.errors.password.message}</p>
                    )}
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={loginMutation.isPending}
                    data-testid="button-login"
                  >
                    {loginMutation.isPending ? "Signing In..." : "Sign In"}
                  </Button>
                </form>
              ) : (
                /* Register Form */
                <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-username">Username</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="register-username"
                        placeholder="Choose a username"
                        className="pl-10"
                        data-testid="input-register-username"
                        {...registerForm.register("username")}
                      />
                    </div>
                    {registerForm.formState.errors.username && (
                      <p className="text-sm text-destructive">{registerForm.formState.errors.username.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email (Optional)</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="your.email@example.com"
                        className="pl-10"
                        data-testid="input-register-email"
                        {...registerForm.register("email")}
                      />
                    </div>
                    {registerForm.formState.errors.email && (
                      <p className="text-sm text-destructive">{registerForm.formState.errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-dog-name">Dog's Name (Optional)</Label>
                    <div className="relative">
                      <Dog className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="register-dog-name"
                        placeholder="What's your dog's name?"
                        className="pl-10"
                        data-testid="input-register-dog-name"
                        {...registerForm.register("dogName")}
                      />
                    </div>
                    {registerForm.formState.errors.dogName && (
                      <p className="text-sm text-destructive">{registerForm.formState.errors.dogName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="register-password"
                        type="password"
                        placeholder="Create a password"
                        className="pl-10"
                        data-testid="input-register-password"
                        {...registerForm.register("password")}
                      />
                    </div>
                    {registerForm.formState.errors.password && (
                      <p className="text-sm text-destructive">{registerForm.formState.errors.password.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-confirm-password">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="register-confirm-password"
                        type="password"
                        placeholder="Confirm your password"
                        className="pl-10"
                        data-testid="input-register-confirm-password"
                        {...registerForm.register("confirmPassword")}
                      />
                    </div>
                    {registerForm.formState.errors.confirmPassword && (
                      <p className="text-sm text-destructive">{registerForm.formState.errors.confirmPassword.message}</p>
                    )}
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={registerMutation.isPending}
                    data-testid="button-register"
                  >
                    {registerMutation.isPending ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>
              )}

              {/* Toggle between login and register */}
              <div className="text-center space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">or</span>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    loginForm.reset();
                    registerForm.reset();
                  }}
                  className="w-full"
                  data-testid="button-toggle-auth"
                >
                  {isLogin 
                    ? "Don't have an account? Sign up" 
                    : "Already have an account? Sign in"
                  }
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
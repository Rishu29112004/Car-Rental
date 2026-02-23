"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { LoginFormValue, loginSchema } from "./login.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useModal } from "@/context/modal-context";
import SignupForm from "../../Signup/SignupForm";
// import { toast } from "sonner";
import { useState } from "react";
import { useAuth } from "@/context/auth-context";

const LoginForm = () => {
  const router = useRouter(); // ✅ MOVE HERE
  const { openModal } = useModal();
  const {login}=useAuth()
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormValue>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { closeModal } = useModal();

  const onSubmit = async (values: LoginFormValue) => {
    if (isLoading) return; // ✅ Prevent double submission
    
    setIsLoading(true);
    try {
      console.log("check wheather it is 1")
      const res = await login(values);
      closeModal();
    } catch (error: any) {
      error(
        error?.response?.data?.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <p className="font-semibold text-blue-500 text-xl flex justify-center">
          User <span className="text-black ml-1">Login</span>
        </p>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="type here" {...field} />
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
                <Input type="password" placeholder="type here" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Logging in..." : "Login"}
        </Button>

        <p className="text-sm text-center">
          Create Your Account{" "}
          <span
            onClick={() => openModal(<SignupForm />)}
            className="text-blue-500 cursor-pointer"
          >
            click here
          </span>
        </p>
      </form>
    </Form>
  );
};

export default LoginForm;

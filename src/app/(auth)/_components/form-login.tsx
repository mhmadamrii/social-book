"use client";

import { Input } from "~/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { DiscordIcon } from "~/components/globals/discord-icon";
import { cn } from "~/lib/utils";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { signIn } from "next-auth/react";
import { LoginValues, loginSchema } from "~/lib/validation";
import { InputPassword } from "~/components/ui/input-password";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";

export function FormLogin({ redirect }: { redirect: string }) {
  console.log("redirect", redirect);
  const [loginError, setLoginError] = useState("");
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginValues) {
    setIsPending(true);
    try {
      const res = await signIn("credentials", {
        username: values.username,
        password: values.password,
        redirect: false,
      });
      if (res?.error === "CredentialsSignin") {
        setLoginError("Incorrect username or password");
        return;
      }

      if (redirect) {
        router.push(redirect);
      } else {
        router.push("/");
      }
    } catch (error) {
      console.log("probably", error);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        {loginError !== "" && (
          <p className="text-center text-destructive">{loginError}</p>
        )}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input disabled={isPending} placeholder="Username" {...field} />
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
                <InputPassword
                  disabled={isPending}
                  placeholder="Password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className={cn("flex w-full gap-2 transition-all")}>
          {isPending ? "Logging in..." : "Log in"}
        </Button>
      </form>
    </Form>
  );
}

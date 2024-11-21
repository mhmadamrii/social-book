"use client";

// @ts-expect-error
import bcryptjs from "bcryptjs";

import { Input } from "~/components/ui/input";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { RegisterSchema, registerSchema } from "~/lib/validation";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { InputPassword } from "~/components/ui/input-password";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";

export function FormRegister() {
  const [tempPassword, setTempPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
    },
  });

  const { mutate, isPending } = api.auth.signUp.useMutation({
    onSuccess: async (res) => {
      await signIn("credentials", {
        username: res.username,
        password: tempPassword,
        redirect: true,
      });

      toast.success("Registered");
    },
    onError: (err: any) => {
      setErrorMessage(err.message);
    },
  });

  async function onSubmit(values: RegisterSchema) {
    const hashedPasssword = await bcryptjs.hash(values.password, 12);

    mutate({
      email: values.email,
      username: values.username,
      password: hashedPasssword,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        {errorMessage && (
          <p className="text-center text-destructive">{errorMessage}</p>
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  disabled={isPending}
                  placeholder="Email"
                  type="email"
                  {...field}
                />
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
                  onChange={(event) => {
                    setTempPassword(event.target.value);
                    field.onChange(event);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className={cn("flex w-full gap-2 transition-all")}>
          {isPending ? "Logging in..." : "Register"}
        </Button>
      </form>
    </Form>
  );
}

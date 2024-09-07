"use client";

import React, { useState, useTransition } from "react";
import { signupSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signup } from "./actions";
import { PasswordInput } from "@/components/PasswordInput";
import LoadingButton from "@/components/LoadingButton";

const SignupForm = () => {
  const [error, setError] = useState<string>();

  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof signupSchema>>({
    defaultValues: {
      email: "",
      username: "",
      password: "",
    },
    resolver: zodResolver(signupSchema),
  });

  function onSubmit(values: z.infer<typeof signupSchema>) {
    setError(undefined);
    startTransition(async () => {
      const { error: actionError } = await signup(values);
      actionError && setError(actionError);
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        {error && <p className="text-center text-destructive">{error}</p>}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="darshanrijal0" {...field} />
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
                  placeholder="darshanrijal0@gmail.com"
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
                <PasswordInput placeholder="********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton type="submit" className="w-full" isLoading={isPending}>
          Signup
        </LoadingButton>
      </form>
    </Form>
  );
};

export default SignupForm;

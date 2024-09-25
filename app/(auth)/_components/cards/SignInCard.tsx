"use client";

import type { SignInDto } from "../../_dtos";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaLock, FaUser } from "react-icons/fa6";
import { signInSchema } from "../../_schemas";
import styles from "./Card.module.css";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  InputIcon,
  Separator,
} from "@/shared/components";
import OAuthLogin from "../oauth-login/OAuthLogin";
import ToggleAuth from "../toggle-auth/ToggleAuth";

interface Props {
  onClick: () => void;
}

function SignInCard({ onClick }: Props): JSX.Element {
  const [isPending, setIsPending] = useState(false);

  const form = useForm<SignInDto>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (authValues: SignInDto): void => {
    console.log(authValues);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login to continue</CardTitle>
        <CardDescription>Use your email or another service to continue</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className={styles.form} onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputIcon
                      placeholder="Email"
                      icon={<FaUser />}
                      {...field}
                      disabled={isPending}
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
                  <FormControl>
                    <InputIcon
                      type="password"
                      placeholder="Password"
                      icon={<FaLock />}
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" name="singin" size="lg" disabled={isPending}>
              Continue
            </Button>
          </form>
        </Form>
        <Separator className={styles.separator} />
        <OAuthLogin isPending={isPending} onSignIn={(value) => setIsPending(value)} />
        <ToggleAuth text="Don't have an account?" actionText="click here" onActionClick={onClick} />
      </CardContent>
    </Card>
  );
}
export default SignInCard;

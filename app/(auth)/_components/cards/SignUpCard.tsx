"use client";

import type { SignUpDto } from "@/core/auth/dtos";
import { SignInFlow } from "../../_types";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuthActions } from "@convex-dev/auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema } from "../../_schemas";
import styles from "./Card.module.css";
import { FaLock, FaUser } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { TriangleAlert } from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CustomAlert,
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

function SignUpCard({ onClick }: Props): JSX.Element {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");

  const { signIn } = useAuthActions();

  const form = useForm<SignUpDto>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (authValues: SignUpDto): void => {
    setIsPending(true);
    const { name, email, password } = authValues;
    signIn("password", { name, email, password, flow: SignInFlow.signUp })
      .then(() => {
        window.location.reload();
      })
      .catch(() => {
        setError("Something went wrong!");
        setIsPending(false);
      });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sing Up to continue</CardTitle>
        <CardDescription>Create new account or use another service to continue</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className={styles.form} onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputIcon
                      placeholder="Full name"
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputIcon
                      placeholder="Email"
                      icon={<MdEmail />}
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
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputIcon
                      type="password"
                      placeholder="Confirm you password"
                      icon={<FaLock />}
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" name="signup" size="lg" disabled={isPending}>
              Continue
            </Button>
            {error && (
              <CustomAlert
                title="Error"
                description={error}
                variant="destructive"
                icon={<TriangleAlert />}
              />
            )}
          </form>
        </Form>
        <Separator className={styles.separator} />
        <OAuthLogin isPending={isPending} onSignIn={(value) => setIsPending(value)} />
        <ToggleAuth
          text="Already have an account?"
          actionText="click here"
          onActionClick={onClick}
        />
      </CardContent>
    </Card>
  );
}
export default SignUpCard;

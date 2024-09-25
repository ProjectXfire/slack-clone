"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa6";
import styles from "./OAuthLogin.module.css";
import { Button } from "@/shared/components";

interface Props {
  isPending?: boolean;
  onSignIn?: (state: boolean) => void;
}

function OAuthLogin({ isPending = false, onSignIn }: Props) {
  const { signIn } = useAuthActions();

  const onSignInWithGitHub = (): void => {
    if (onSignIn) onSignIn(true);
    signIn("github");
  };

  const onSignInWithGoogle = (): void => {
    if (onSignIn) onSignIn(true);
    signIn("google");
  };

  return (
    <div className={styles.container}>
      <Button
        className={styles.button}
        variant="outline"
        size="lg"
        disabled={isPending}
        onClick={onSignInWithGoogle}
      >
        <FcGoogle size={20} />
        <p>Continue with Google</p>
      </Button>
      <Button
        className={styles.button}
        variant="outline"
        size="lg"
        disabled={isPending}
        onClick={onSignInWithGitHub}
      >
        <FaGithub size={20} />
        <p>Continue with Github</p>
      </Button>
    </div>
  );
}
export default OAuthLogin;

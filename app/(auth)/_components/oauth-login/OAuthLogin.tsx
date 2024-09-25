"use client";

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa6";
import styles from "./OAuthLogin.module.css";
import { Button } from "@/shared/components";

function OAuthLogin() {
  return (
    <div className={styles.container}>
      <Button className={styles.button} variant="outline" size="lg">
        <FcGoogle size={20} />
        <p>Continue with Google</p>
      </Button>
      <Button className={styles.button} variant="outline" size="lg">
        <FaGithub size={20} />
        <p>Continue with Github</p>
      </Button>
    </div>
  );
}
export default OAuthLogin;

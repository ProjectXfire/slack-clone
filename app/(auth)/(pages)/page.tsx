"use client";

import type { SignInFlow } from "../_types";
import { useState } from "react";
import { AuthContainer, SignInCard, SignUpCard } from "../_components";

function AuthPage(): JSX.Element {
  const [authCard, setAuthCard] = useState<SignInFlow>("singIn");

  return (
    <AuthContainer>
      {authCard === "singIn" ? (
        <SignInCard onClick={() => setAuthCard("signUp")} />
      ) : (
        <SignUpCard onClick={() => setAuthCard("singIn")} />
      )}
    </AuthContainer>
  );
}
export default AuthPage;

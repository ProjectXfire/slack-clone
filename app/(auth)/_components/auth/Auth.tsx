"use client";

import type { SignInFlow } from "../../_types";
import { useState } from "react";
import AuthContainer from "../containers/AuthContainer";
import SignInCard from "../cards/SignInCard";
import SignUpCard from "../cards/SignUpCard";

function Auth(): JSX.Element {
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
export default Auth;

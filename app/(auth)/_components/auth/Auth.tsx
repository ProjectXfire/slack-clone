"use client";

import { SignInFlow } from "../../_types";
import { useState } from "react";
import AuthContainer from "../containers/AuthContainer";
import SignInCard from "../cards/SignInCard";
import SignUpCard from "../cards/SignUpCard";

function Auth(): JSX.Element {
  const [authCard, setAuthCard] = useState<SignInFlow>(SignInFlow.signIn);

  return (
    <AuthContainer>
      {authCard === SignInFlow.signIn ? (
        <SignInCard onClick={() => setAuthCard(SignInFlow.signUp)} />
      ) : (
        <SignUpCard onClick={() => setAuthCard(SignInFlow.signIn)} />
      )}
    </AuthContainer>
  );
}
export default Auth;

"use client";

import { Button } from "@/shared/components";
import { useAuthActions } from "@convex-dev/auth/react";

function HomePage(): JSX.Element {
  const { signOut } = useAuthActions();

  return (
    <main>
      <h1>Home</h1>
      <Button onClick={signOut}>Close</Button>
    </main>
  );
}
export default HomePage;

import { auth } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  // see if user is not logged in
  const getData = async () => {
    if (loading) return;
    if (!user) return router.push("/auth/login");
  };

  // Get users data
  useEffect(() => {
    getData();
  }, [user, loading]);

  return (
    <div>
      <h1>Your Posts</h1>
      <div>posts</div>
      <button onClick={() => auth.signOut()}>Sign Out</button>
    </div>
  );
}

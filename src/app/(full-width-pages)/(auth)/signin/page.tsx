import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Catalos admin - Sign In",
  description: "This is Next.js Signin Page Catalos Dashboard",
};

export default function SignIn() {
  return <SignInForm />;
}

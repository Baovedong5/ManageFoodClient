import LoginForm from "@/app/(public)/(auth)/login/login-form";
import { Suspense } from "react";

const Login = async () => {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
};

export default Login;

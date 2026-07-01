import { FaTwitter, FaFacebook, FaGoogle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Flip, ToastContainer, toast } from "react-toastify";
import { useState } from "react";
import axios from "axios";
import { URL } from "../constant/index";
import AuthShell from "../layouts/AuthShell";
import { Field, Input } from "../components/ui/Field";
import { Button } from "../components/ui/Button";

const toastOpts = {
  position: "top-right",
  autoClose: 1800,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: false,
  draggable: false,
  theme: "dark",
  transition: Flip,
};

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const notify = () => {
    toast.dismiss();
    toast.info("Not implemented yet", toastOpts);
  };

  const handleRegister = async (e) => {
    e?.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(`${URL}/register`, {
        username,
        email,
        password,
      });

      if (response.data.success) {
        toast.success("Account created — please sign in.", toastOpts);
        setTimeout(() => navigate("/login"), 1200);
      } else {
        toast.error(
          response.data.message || "Registration failed. Please try again.",
          toastOpts
        );
      }
    } catch (error) {
      console.error("Error registering user:", error);
      toast.error("An error occurred. Please try again.", toastOpts);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell>
      <ToastContainer />
      <h1 className="font-display text-2xl font-bold text-ink-strong">
        Create your account
      </h1>
      <p className="mt-1 text-sm text-muted">
        Start managing projects and payments.
      </p>

      <form onSubmit={handleRegister} className="mt-8">
        <Field label="Username" htmlFor="username">
          <Input
            id="username"
            type="text"
            placeholder="janedoe"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Field>
        <Field label="Email" htmlFor="email">
          <Input
            id="email"
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>
        <Field label="Password" htmlFor="password">
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>

        <Button type="submit" className="mt-2 w-full" disabled={isLoading}>
          {isLoading ? "Creating…" : "Create account"}
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3 text-xs text-muted">
        <span className="h-px flex-1 bg-line" />
        or sign up with
        <span className="h-px flex-1 bg-line" />
      </div>

      <div className="flex justify-center gap-3">
        {[FaGoogle, FaTwitter, FaFacebook].map((Icon, i) => (
          <button
            key={i}
            onClick={notify}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-surface/60 text-muted transition-colors hover:border-brand-500/40 hover:text-ink"
          >
            <Icon className="h-4 w-4" />
          </button>
        ))}
      </div>

      <p className="mt-8 text-center text-sm text-muted">
        Already have an account?{" "}
        <button
          onClick={() => navigate("/login")}
          className="font-medium text-brand-300 hover:text-brand-200"
        >
          Sign in
        </button>
      </p>
    </AuthShell>
  );
};

export default Register;

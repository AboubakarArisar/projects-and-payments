import { useState } from "react";
import { Flip, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { URL } from "../constant";
import AuthShell from "../layouts/AuthShell";
import { Field, Input } from "../components/ui/Field";
import { Button } from "../components/ui/Button";

const toastOpts = {
  position: "top-right",
  autoClose: 1800,
  theme: "dark",
  transition: Flip,
};

function OwnerLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(`${URL}/login`, { email, password });
      setEmail("");
      setPassword("");
      if (response.status === 200) {
        toast.success("Login successful", toastOpts);
        setTimeout(() => navigate("/dashboard"), 1000);
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Login failed";
      toast.error(msg, toastOpts);
      console.error("Login failed:", msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell>
      <ToastContainer />
      <h1 className="font-display text-2xl font-bold text-ink-strong">
        Owner sign in
      </h1>
      <p className="mt-1 text-sm text-muted">Access the owner console.</p>

      <form onSubmit={handleLogin} className="mt-8">
        <Field label="Email" htmlFor="owner-email">
          <Input
            id="owner-email"
            type="text"
            placeholder="owner@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>
        <Field label="Password" htmlFor="owner-password">
          <Input
            id="owner-password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>

        <div className="mb-6 flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-muted">
            <input type="checkbox" className="accent-brand-500" /> Remember me
          </label>
          <span className="cursor-pointer text-brand-300 hover:text-brand-200">
            Forgot password?
          </span>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </AuthShell>
  );
}

export default OwnerLogin;

import { FaTwitter, FaFacebook, FaGoogle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { URL } from "./constant/index";
import { loginUser } from "./redux/actions/action";
import { notify } from "./lib/notify";
import AuthShell from "./layouts/AuthShell";
import { Field, Input, Label } from "./components/ui/Field";
import { Button } from "./components/ui/Button";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Basic client-side validation for instant, specific feedback.
  const validate = () => {
    const mail = email.trim();
    if (!mail || !password) {
      return "Please enter both your email and password.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) {
      return "Please enter a valid email address.";
    }
    return null;
  };

  const handleLogin = async (e) => {
    e?.preventDefault();

    const validationError = validate();
    if (validationError) {
      notify(validationError, "error");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${URL}/login`, {
        email: email.trim(),
        password,
      });
      const { token, user } = response.data;
      if (token) {
        // Persist auth so the app shell knows who is logged in.
        dispatch(
          loginUser(
            user?._id,
            user?.email || email,
            user?.username || user?.name,
            "user",
            token,
            Date.now() + 60 * 60 * 1000
          )
        );
        navigate("/dashboard");
      } else {
        notify(response.data.message || "Login failed. Please try again.", "error");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      const errorMessage =
        error.response?.data?.message ||
        (error.request
          ? "Can't reach the server. Please check your connection."
          : "Something went wrong. Please try again.");
      notify(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell>
      <h1 className="font-display text-2xl font-bold text-ink-strong">
        Welcome back
      </h1>
      <p className="mt-1 text-sm text-muted">Sign in to your workspace.</p>

      <form onSubmit={handleLogin} className="mt-8">
        <Field label="Email" htmlFor="email">
          <Input
            id="email"
            type="text"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>
        <Field label="Password" htmlFor="password" className="mb-2">
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>
        <button
          type="button"
          onClick={() => notify()}
          className="mb-6 text-xs text-muted hover:text-ink"
        >
          Forgot your password?
        </button>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3 text-xs text-muted">
        <span className="h-px flex-1 bg-line" />
        or continue with
        <span className="h-px flex-1 bg-line" />
      </div>

      <div className="flex justify-center gap-3">
        {[FaGoogle, FaTwitter, FaFacebook].map((Icon, i) => (
          <button
            key={i}
            onClick={() => notify()}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-surface/60 text-muted transition-colors hover:border-brand-500/40 hover:text-ink"
          >
            <Icon className="h-4 w-4" />
          </button>
        ))}
      </div>

      <p className="mt-8 text-center text-sm text-muted">
        Don't have an account?{" "}
        <button
          onClick={() => navigate("/register")}
          className="font-medium text-brand-300 hover:text-brand-200"
        >
          Create one
        </button>
      </p>
    </AuthShell>
  );
};

export default Login;

/* eslint-disable react/prop-types */
import { FaTwitter, FaFacebook, FaGoogle } from "react-icons/fa";
import { FiCheckCircle, FiXCircle, FiLoader } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { URL } from "../constant/index";
import { notify } from "../lib/notify";
import AuthShell from "../layouts/AuthShell";
import { Field, Input } from "../components/ui/Field";
import { Button } from "../components/ui/Button";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Small inline status line shown under a field while we check availability.
const StatusLine = ({ status, onPick }) => {
  if (!status) return null;

  if (status.state === "checking") {
    return (
      <p className="mt-1.5 flex items-center gap-1.5 text-xs text-muted">
        <FiLoader className="h-3.5 w-3.5 animate-spin" />
        Checking availabilityâ€¦
      </p>
    );
  }
  if (status.state === "invalid") {
    return <p className="mt-1.5 text-xs text-muted">{status.message}</p>;
  }
  if (status.state === "available") {
    return (
      <p className="mt-1.5 flex items-center gap-1.5 text-xs text-emerald-400">
        <FiCheckCircle className="h-3.5 w-3.5" />
        {status.message}
      </p>
    );
  }
  // taken
  return (
    <div className="mt-1.5 text-xs">
      <p className="flex items-center gap-1.5 text-rose-400">
        <FiXCircle className="h-3.5 w-3.5" />
        {status.message}
      </p>
      {status.suggestions?.length > 0 && (
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          <span className="text-muted">Try:</span>
          {status.suggestions.map((s) => (
            <button
              type="button"
              key={s}
              onClick={() => onPick(s)}
              className="rounded-md border border-line bg-surface/60 px-2 py-0.5 text-brand-300 transition-colors hover:border-brand-500/40 hover:text-brand-200"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Live availability state (Gmail-style), driven by debounced backend checks.
  const [usernameStatus, setUsernameStatus] = useState(null);
  const [emailStatus, setEmailStatus] = useState(null);

  // Debounced live username check as the user types.
  useEffect(() => {
    const name = username.trim();
    if (!name) {
      setUsernameStatus(null);
      return;
    }
    if (name.length < 3) {
      setUsernameStatus({
        state: "invalid",
        message: "Username must be at least 3 characters long.",
      });
      return;
    }

    setUsernameStatus({ state: "checking" });
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const { data } = await axios.get(`${URL}/check-username`, {
          params: { username: name },
          signal: controller.signal,
        });
        setUsernameStatus(
          data.available
            ? { state: "available", message: "Username is available" }
            : {
                state: "taken",
                message: data.message || "That username is already taken.",
                suggestions: data.suggestions || [],
              }
        );
      } catch (error) {
        // Ignore cancelled requests; stay quiet on network errors so the
        // live check never blocks the user from submitting.
        if (!axios.isCancel(error) && error.name !== "CanceledError") {
          setUsernameStatus(null);
        }
      }
    }, 450);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [username]);

  // Debounced live email check.
  useEffect(() => {
    const mail = email.trim();
    if (!mail) {
      setEmailStatus(null);
      return;
    }
    if (!emailRegex.test(mail)) {
      setEmailStatus({ state: "invalid", message: "Enter a valid email address." });
      return;
    }

    setEmailStatus({ state: "checking" });
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const { data } = await axios.get(`${URL}/check-email`, {
          params: { email: mail },
          signal: controller.signal,
        });
        setEmailStatus(
          data.available
            ? { state: "available", message: "Email is available" }
            : {
                state: "taken",
                message: data.message || "That email is already registered.",
              }
        );
      } catch (error) {
        if (!axios.isCancel(error) && error.name !== "CanceledError") {
          setEmailStatus(null);
        }
      }
    }, 450);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [email]);

  // Client-side validation â€” mirrors the backend schema rules so the user
  // gets instant, specific feedback instead of a round-trip error.
  const validate = () => {
    const name = username.trim();
    const mail = email.trim();

    if (!name || !mail || !password) {
      return "Please fill in your username, email and password.";
    }
    if (name.length < 3) {
      return "Username must be at least 3 characters long.";
    }
    if (usernameStatus?.state === "taken") {
      return "That username is taken. Please pick another.";
    }
    if (!emailRegex.test(mail)) {
      return "Please enter a valid email address.";
    }
    if (emailStatus?.state === "taken") {
      return "An account with this email already exists.";
    }
    if (password.length < 6) {
      return "Password must be at least 6 characters long.";
    }
    return null;
  };

  const handleRegister = async (e) => {
    e?.preventDefault();

    const validationError = validate();
    if (validationError) {
      notify(validationError, "error");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${URL}/register`, {
        username: username.trim(),
        email: email.trim(),
        password,
      });

      if (response.data?.success) {
        notify("Account created â€” please sign in.", "success");
        setTimeout(() => navigate("/login"), 1200);
      } else {
        notify(
          response.data?.message || "Registration failed. Please try again.",
          "error"
        );
      }
    } catch (error) {
      console.error("Error registering user:", error);
      // Validation errors come back as 4xx, which axios throws â€” the meaningful
      // message lives on error.response.data.message.
      const message =
        error.response?.data?.message ||
        (error.request
          ? "Can't reach the server. Please check your connection."
          : "Something went wrong. Please try again.");
      notify(message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell title="">
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
            autoComplete="off"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <StatusLine status={usernameStatus} onPick={setUsername} />
        </Field>
        <Field label="Email" htmlFor="email">
          <Input
            id="email"
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <StatusLine status={emailStatus} onPick={setEmail} />
        </Field>
        <Field label="Password" htmlFor="password">
          <Input
            id="password"
            type="password"
            placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>

        <Button type="submit" className="mt-2 w-full" disabled={isLoading}>
          {isLoading ? "Creatingâ€¦" : "Create account"}
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
            type="button"
            onClick={() => notify()}
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


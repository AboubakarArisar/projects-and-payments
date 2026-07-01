import { useNavigate } from "react-router-dom";
import Lottie from "react-lottie";
import animationData from "../assets/pageNotFound.json";
import { Logo } from "../components/ui/Logo";
import { Button } from "../components/ui/Button";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData,
};

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div className="mb-6">
        <Logo />
      </div>
      <div className="w-full max-w-sm">
        <Lottie options={defaultOptions} height={280} width={320} />
      </div>
      <h1 className="mt-4 font-display text-2xl font-bold text-ink-strong">
        Page not found
      </h1>
      <p className="mt-2 max-w-md text-sm text-muted">
        The page you're looking for doesn't exist or has moved.
      </p>
      <div className="mt-6 flex gap-3">
        <Button variant="secondary" onClick={() => navigate("/")}>
          Go home
        </Button>
        <Button onClick={() => navigate("/dashboard")}>Back to dashboard</Button>
      </div>
    </div>
  );
};

export default PageNotFound;

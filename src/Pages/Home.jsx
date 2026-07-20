import { useState } from "react";
import { useTitle } from "../hooks/useTitle";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import {
  FaTwitter,
  FaGithub,
  FaLinkedin,
} from "react-icons/fa";
import {
  FiTrello,
  FiDollarSign,
  FiUsers,
  FiArrowRight,
  FiCheckSquare,
  FiBarChart2,
  FiShield,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import { BRAND } from "../constant/brand";
import { Logo } from "../components/ui/Logo";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/StatusBadge";

import AbouBakar from "../TeamPic/AbouBakar.jpeg";

// The maker — solo full stack developer behind Steward.
const maker = {
  name: "Abou Bakar",
  role: "Full Stack Developer",
  image: AbouBakar,
  bio: "I design and build web apps end to end — from the database and API to the pixels you click. Steward is one of the products I've built to keep projects, teams, and payments in one calm place.",
  twitter: "https://twitter.com/",
  github: "https://github.com/",
  linkedin: "https://www.linkedin.com/",
};

const features = [
  {
    icon: FiTrello,
    title: "Project board",
    text: "Track every project from backlog to done on a drag-and-drop Kanban board built for momentum.",
  },
  {
    icon: FiDollarSign,
    title: "Payments ledger",
    text: "Log incoming and outgoing payments, and see your net balance update in real time.",
  },
  {
    icon: FiUsers,
    title: "Team management",
    text: "Add members, assign them to projects, and always know who's working on what.",
  },
];

// What the product does for users — grounded in the app's real capabilities.
const productServices = [
  {
    icon: FiTrello,
    title: "Plan projects visually",
    text: "Organize work across Backlog, In progress, Testing, and Done — and move projects forward on a clear status board.",
  },
  {
    icon: FiDollarSign,
    title: "Track every payment",
    text: "Record incoming and outgoing transactions per project and keep an accurate, up-to-date ledger.",
  },
  {
    icon: FiCheckSquare,
    title: "Assign & follow tasks",
    text: "Break projects into tasks, assign them to members, and notify people automatically by email.",
  },
  {
    icon: FiUsers,
    title: "Manage your team",
    text: "Add members, assign them to projects, and see exactly who is responsible for what.",
  },
  {
    icon: FiBarChart2,
    title: "See the numbers",
    text: "Dashboards for total, incoming, and outgoing payments turn your ledger into clear insights.",
  },
  {
    icon: FiShield,
    title: "Secure access",
    text: "Protected sign-in and owner controls keep your projects, team, and money data private.",
  },
];

const Home = () => {
  useTitle();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleSubscribe = () => {
    console.log("Subscribed with email:", email);
    setEmail("");
    Swal.fire({
      icon: "success",
      title: "You're subscribed!",
      text: "Thanks for joining the newsletter.",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      confirmButtonColor: "#3b82f6",
    });
  };

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <header className="sticky top-0 z-30 border-b border-line bg-bg/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Logo />
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate("/login")}>
              Sign in
            </Button>
            <Button onClick={() => navigate("/register")}>
              Get started <FiArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-4xl px-6 py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-6 flex justify-center">
              <Badge tone="brand">✦ Projects &amp; payments, together</Badge>
            </div>
            <h1 className="font-display text-4xl font-bold leading-tight text-ink-strong sm:text-6xl">
              Run your projects.
              <br />
              <span className="gradient-text">Track every payment.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">
              {BRAND.name} brings your project board, team, and money into one
              calm dark workspace — so nothing slips through the cracks.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button size="lg" onClick={() => navigate("/register")}>
                Get started free <FiArrowRight className="h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="secondary"
                onClick={() => navigate("/techs")}
              >
                Explore the tech
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {features.map(({ icon: Icon, title, text }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="card p-6"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500/15 text-brand-300">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-lg font-semibold text-ink-strong">
                {title}
              </h3>
              <p className="mt-2 text-sm text-muted">{text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Product services — what you can do with the app */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="mb-10 text-center">
          <h2 className="font-display text-3xl font-bold text-ink-strong">
            Everything you need in one workspace
          </h2>
          <p className="mt-2 text-muted">
            {BRAND.name} brings your projects, team, and payments together.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {productServices.map(({ icon: Icon, title, text }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="card p-6"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500/15 text-brand-300">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-lg font-semibold text-ink-strong">
                {title}
              </h3>
              <p className="mt-2 text-sm text-muted">{text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Maker / About */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="mb-10 text-center">
          <h2 className="font-display text-3xl font-bold text-ink-strong">
            Meet the maker
          </h2>
          <p className="mt-2 text-muted">The developer behind {BRAND.name}.</p>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="card mx-auto flex max-w-3xl flex-col items-center gap-6 p-8 text-center sm:flex-row sm:text-left"
        >
          <img
            src={maker.image}
            alt={maker.name}
            className="h-28 w-28 shrink-0 rounded-full object-cover ring-2 ring-brand-500/30"
          />
          <div>
            <h3 className="text-xl font-semibold text-ink-strong">
              {maker.name}
            </h3>
            <p className="text-sm text-brand-300">{maker.role}</p>
            <p className="mt-3 text-sm text-muted">{maker.bio}</p>
            <div className="mt-4 flex justify-center gap-3 text-muted sm:justify-start">
              {[
                { href: maker.twitter, Icon: FaTwitter },
                { href: maker.github, Icon: FaGithub },
                { href: maker.linkedin, Icon: FaLinkedin },
              ].map(({ href, Icon }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-brand-300"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Newsletter / CTA */}
      <section className="mx-auto max-w-4xl px-6 pb-24">
        <div className="card relative overflow-hidden p-8 text-center sm:p-12">
          <div className="pointer-events-none absolute inset-0 bg-brand-radial" />
          <h2 className="relative font-display text-3xl font-bold text-ink-strong">
            Stay in the loop
          </h2>
          <p className="relative mx-auto mt-2 max-w-md text-muted">
            Get product updates and new features straight to your inbox.
          </p>
          <div className="relative mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-line bg-bg/60 px-4 py-2.5 text-sm text-ink placeholder:text-muted/60 focus-ring"
            />
            <Button onClick={handleSubscribe}>Subscribe</Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-line px-6 py-8 text-center text-xs text-muted flex flex-col justify-center items-center">
        © {new Date().getFullYear()} {BRAND.name}. {BRAND.tagline}

          <p className="border-b border-rule py-4 text-center text-xs leading-5 text-muted">
          Partner:{" "}
          <a
            href="https://www.consulics.com"
            target="_blank"
            rel="noopener"
            className="font-bold text-ink hover:underline"
          >
            Consulics | IRS Authorized Form 2290 &amp; HVUT E-File Provider
          </a>{" "}
          — Consulics is an IRS Authorized Form 2290 and Form 8849 e-file
          provider helping truck owners, fleets, and tax professionals file HVUT
          taxes online.
        </p>
      </footer>
    </div>
  );
};

export default Home;

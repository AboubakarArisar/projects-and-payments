import { useState, useRef } from "react";
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
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import { BRAND } from "../constant/brand";
import { Logo } from "../components/ui/Logo";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/StatusBadge";

import Abdullah from "../TeamPic/Abdullah.jpeg";
import AbouBakar from "../TeamPic/AbouBakar.jpeg";
import Faizan from "../TeamPic/Faizan.jpeg";
import Jahanzaib from "../TeamPic/Jahanzaib.jpeg";

const teamMembers = [
  { name: "Abdullah", description: "Full Stack Dev", image: Abdullah, twitter: "https://twitter.com/", github: "https://github.com/abdullah-dev5", linkedin: "https://www.linkedin.com/" },
  { name: "AbouBakar", description: "UI/UX Designer", image: AbouBakar, twitter: "https://twitter.com/", github: "https://github.com/", linkedin: "https://www.linkedin.com/" },
  { name: "Faizan", description: "Full Stack Dev", image: Faizan, twitter: "https://twitter.com/", github: "https://github.com/faizanmuhammad1", linkedin: "https://www.linkedin.com/in/faizanmuhammad2/" },
  { name: "Jahanzaib", description: "MERN Dev", image: Jahanzaib, twitter: "https://twitter.com/Jahanzaib699", github: "https://github.com/JahanzaibShaikh19", linkedin: "https://www.linkedin.com/in/jahanzaib-shaikh-9a6199215/" },
];

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

const Home = () => {
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

  // Scramble effect on the "Explore technologies" button
  const TARGET_TEXT = "Explore the tech";
  const CYCLES_PER_LETTER = 2;
  const SHUFFLE_TIME = 25;
  const CHARS = "!<>-_\\/[]{}—=+*^?#";
  const intervalRef = useRef(null);
  const [text, setText] = useState(TARGET_TEXT);

  const scramble = () => {
    let pos = 0;
    intervalRef.current = setInterval(() => {
      const scrambled = TARGET_TEXT.split("")
        .map((char, index) => {
          if (pos / CYCLES_PER_LETTER > index) return char;
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        })
        .join("");
      setText(scrambled);
      pos++;
      if (pos >= TARGET_TEXT.length * CYCLES_PER_LETTER) stopScramble();
    }, SHUFFLE_TIME);
  };
  const stopScramble = () => {
    clearInterval(intervalRef.current || undefined);
    setText(TARGET_TEXT);
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
                onMouseEnter={scramble}
                onMouseLeave={stopScramble}
                onClick={() => navigate("/techs")}
              >
                {text}
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

      {/* Team */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="mb-10 text-center">
          <h2 className="font-display text-3xl font-bold text-ink-strong">
            Meet the team
          </h2>
          <p className="mt-2 text-muted">The people who built {BRAND.name}.</p>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {teamMembers.map((member) => (
            <motion.div
              key={member.name}
              whileHover={{ y: -4 }}
              className="card flex flex-col items-center p-6 text-center"
            >
              <img
                src={member.image}
                alt={member.name}
                className="h-24 w-24 rounded-full object-cover ring-2 ring-brand-500/30"
              />
              <h3 className="mt-4 font-semibold text-ink-strong">
                {member.name}
              </h3>
              <p className="text-sm text-muted">{member.description}</p>
              <div className="mt-4 flex gap-3 text-muted">
                {[
                  { href: member.twitter, Icon: FaTwitter },
                  { href: member.github, Icon: FaGithub },
                  { href: member.linkedin, Icon: FaLinkedin },
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
            </motion.div>
          ))}
        </div>
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

      <footer className="border-t border-line px-6 py-8 text-center text-xs text-muted">
        © {new Date().getFullYear()} {BRAND.name}. {BRAND.tagline}
      </footer>
    </div>
  );
};

export default Home;

import React from "react";
import { useTitle } from "../hooks/useTitle";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaReact, FaNodeJs, FaDatabase, FaCss3Alt } from "react-icons/fa";
import { IoLogoVercel } from "react-icons/io5";
import { SiHeroku, SiRedux } from "react-icons/si";
import { FiArrowLeft } from "react-icons/fi";
import { Button } from "../components/ui/Button";

const techOverviews = {
  "React.js": "A JavaScript library for building user interfaces, maintained by Meta.",
  "Tailwind CSS": "A utility-first CSS framework for building custom designs quickly.",
  Redux: "A predictable state container for JavaScript apps, used with React to manage state.",
  "Node.js": "A JavaScript runtime built on Chrome's V8 engine for server-side applications.",
  Vercel: "A cloud platform for static sites and serverless functions.",
  Heroku: "A cloud platform as a service for deploying and managing applications.",
  MongoDB: "A document-oriented NoSQL database for scalable, high-performance apps.",
};

const TiltCard = ({ tech, icon }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  return (
    <motion.div
      className="relative h-80 w-full overflow-hidden rounded-2xl border border-line bg-surface"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex h-full flex-col items-center justify-center gap-4 p-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-bg/60 ring-1 ring-line">
          {icon}
        </div>
        <span className="text-lg font-semibold text-ink-strong">{tech}</span>
      </div>
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-brand-gradient p-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.35 }}
        style={{ pointerEvents: isHovered ? "auto" : "none" }}
      >
        <h3 className="text-2xl font-semibold text-white">{tech}</h3>
        <p className="text-sm text-white/90">{techOverviews[tech]}</p>
      </motion.div>
    </motion.div>
  );
};

const sections = [
  {
    title: "Front-end",
    items: [
      { tech: "React.js", icon: <FaReact size={44} color="#61DAFB" /> },
      { tech: "Tailwind CSS", icon: <FaCss3Alt size={44} color="#38B2AC" /> },
      { tech: "Redux", icon: <SiRedux size={44} color="#764abc" /> },
    ],
  },
  {
    title: "Back-end & deployment",
    items: [
      { tech: "Node.js", icon: <FaNodeJs size={44} color="#8CC84B" /> },
      { tech: "Vercel", icon: <IoLogoVercel size={44} color="#e2e8f0" /> },
      { tech: "Heroku", icon: <SiHeroku size={44} color="#3b82f6" /> },
    ],
  },
  {
    title: "Database",
    items: [{ tech: "MongoDB", icon: <FaDatabase size={44} color="#47A248" /> }],
  },
];

TiltCard.propTypes = {
  tech: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
};

const Techs = () => {
  useTitle("Technology");
  const navigate = useNavigate();
  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <Button variant="ghost" onClick={() => navigate("/")}>
        <FiArrowLeft className="h-4 w-4" /> Back to home
      </Button>

      <h1 className="mt-6 text-center font-display text-4xl font-bold text-ink-strong">
        Our tech journey
      </h1>
      <p className="mt-2 text-center text-muted">
        The stack that powers the platform.
      </p>

      {sections.map((section) => (
        <section key={section.title} className="mt-12">
          <h3 className="mb-6 text-xl font-semibold text-ink-strong">
            {section.title}
          </h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {section.items.map((item) => (
              <TiltCard key={item.tech} tech={item.tech} icon={item.icon} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default Techs;

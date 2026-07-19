import { BRAND } from "../constant/brand";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t border-line px-4 py-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 text-xs text-muted sm:flex-row">
        <p>
          &copy; {currentYear} {BRAND.name}. All rights reserved.
        </p>
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
        <p className="flex items-center gap-1.5">
          Crafted with <span className="text-rose-400">&#10084;</span> for busy teams
        </p>
      </div>
    </footer>
  );
};

export default Footer;

import { BRAND } from "../constant/brand";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t border-line px-4 py-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 text-xs text-muted sm:flex-row">
        <p>
          &copy; {currentYear} {BRAND.name}. All rights reserved.
        </p>
        <p className="flex items-center gap-1.5">
          Crafted with <span className="text-rose-400">&#10084;</span> for busy teams
        </p>
      </div>
    </footer>
  );
};

export default Footer;

import { BRAND } from "../constant/brand";

export default function Footer() {
  return (
    <footer className="border-t border-line px-5 py-6 lg:px-10">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 text-xs text-muted sm:flex-row sm:items-center">
        <p>© {new Date().getFullYear()} {BRAND.name}. Projects & payments, together.</p>
        <div className="flex flex-wrap gap-5">
          <a href="/techs" className="hover:text-ink">Built with care</a>
          <a href="https://www.consulics.com" target="_blank" rel="noopener noreferrer" className="hover:text-ink">Partner: Consulics</a>
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-32 border-t border-slate-800 bg-[#0b1220]">
      <div className="mx-auto max-w-7xl px-6 py-16 text-sm text-slate-400">
        <div className="grid gap-12 md:grid-cols-3">
          {/* Brand */}
          <div>
            <h3 className="text-base font-semibold text-white">ChainTriggers</h3>
            <p className="mt-4 max-w-xs">
              Educational insights into legal, financial, insurance, and
              risk-related trigger events.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm font-semibold text-white">Navigation</h4>
            <ul className="mt-4 space-y-2">
              <li><Link href="/" className="hover:text-white">Home</Link></li>
              <li><Link href="/about" className="hover:text-white">About</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-white">Legal</h4>
            <ul className="mt-4 space-y-2">
              <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
              <li><Link href="/disclaimer" className="hover:text-white">Disclaimer</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-slate-800 pt-6 text-xs text-slate-500">
          © {new Date().getFullYear()} ChainTriggers. Informational purposes only.
        </div>
      </div>
    </footer>
  );
}

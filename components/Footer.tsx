import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900 border-t border-neutral-800 py-12 shadow-lg">
      <div className="mx-auto max-w-6xl px-6 flex flex-col items-center gap-6 text-center">
        <a
          href="https://tbcbank.ge/ka/tbc-education"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-transform duration-300 hover:scale-105"
        >
          <Image
            width={100}
            height={100}
            src="/tbc-logo.png"
            alt="TBC Logo"
            className="h-10 mb-3 rounded-lg shadow-md"
            priority
          />
        </a>
        <div className="flex flex-col items-center gap-2">
            <span className="text-lg font-semibold tracking-wide text-gradient bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            SFBiz
            </span>
          <span className="text-neutral-400">
            © {new Date().getFullYear()} &mdash; All rights reserved.
          </span>
        </div>
        <div className="flex gap-4 mt-2">
          <a
            href="https://github.com/FOLADA"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-400 hover:text-white transition-colors"
            aria-label="GitHub"
          >
            <svg width="24" height="24" fill="currentColor" className="inline-block">
              <path d="M12 2C6.477 2 2 6.484 2 12.012c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.483 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.833.091-.646.35-1.088.636-1.339-2.221-.253-4.555-1.112-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.254-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0112 7.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.396.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.847-2.337 4.695-4.566 4.944.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.579.688.481C19.138 20.174 22 16.426 22 12.012 22 6.484 17.523 2 12 2z"/>
            </svg>
          </a>
            <a
            href="https://www.linkedin.com/in/crusadersf/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-400 hover:text-white transition-colors"
            aria-label="LinkedIn"
            >
            <svg width="24" height="24" fill="currentColor" className="inline-block">
              <path d="M19 3A2 2 0 0 1 21 5v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zm-9.5 7H7v7h2.5v-7zm-1.25-2a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5zm9.25 2h-2.25v-1c0-.414-.336-.75-.75-.75s-.75.336-.75.75v1H12v7h2.5v-3.5c0-.828.672-1.5 1.5-1.5s1.5.672 1.5 1.5V17H19v-3.5c0-2.21-1.79-4-4-4z"/>
            </svg>
            </a>
        </div>
      </div>
    </footer>
  );
}
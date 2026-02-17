import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="mt-16 border-t border-(--line) bg-[#fff8eb]">
      <div className="container-width py-10">
        <p className="text-center text-sm text-muted">
          © {currentYear} SQL Injection Labs. Educational purposes only.
          <span className="block mt-1">
            Practice ethical hacking in a safe, controlled environment.
          </span>
        </p>
      </div>
    </footer>
  );
}

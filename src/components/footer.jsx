export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-400 py-5 text-center text-xs xs:text-sm text-muted-foreground">
      © {new Date().getFullYear()} Image Manager. Developed by{" "}
      <a
        target="_blank"
        href="https://naveensoni.vercel.app"
        className="underline hover:text-primary"
      >
        Naveen Soni
      </a>
      .
    </footer>
  );
}

import "./globals.css";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "OpiniScope | Research Intelligence",
  description:
    "Platform riset analisis opini publik tiga dimensi: sentimen, sarkasme, dan stance pada diskusi konflik geopolitik global di Reddit.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <Navbar />
        <main>{children}</main>
        <footer className="footer">
          <div className="wrap footer-inner">
            <div>
              <div className="merek">OpiniScope</div>
              <div className="hak">2026 OpiniScope Research Intelligence.</div>
            </div>
            <nav className="footer-links">
              <a href="/metodologi">Metodologi</a>
              <a href="/dashboard">Data Riset</a>
              <a href="/analisis">Mulai Analisis</a>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}

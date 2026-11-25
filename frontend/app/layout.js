import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import Menu from "../components/Menu";
export const metadata = {
  title: "CrediCheck | Tu perfil financiero",
  description: "Simulación orientativa de perfil financiero.",
};
export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <Menu />
        {children}
        <footer className="footer-cc py-4 mt-5">
          <div className="container small d-flex flex-column flex-md-row justify-content-between gap-2">
            <span>© 2026 CrediCheck</span>
            <span>Simulación orientativa · Uso responsable</span>
          </div>
        </footer>
      </body>
    </html>
  );
}

// The root layout wraps every page. It is a Server Component (no "use client"),
// so it renders on the server and ships no JavaScript of its own.
import localFont from "next/font/local"; // self-hosts fonts and avoids layout shift
import "./globals.css"; // global styles (Tailwind) loaded once for the whole app

// Load the variable Geist font and expose it as a CSS variable.
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900", // variable font: every weight in one file
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// The Metadata API: Next.js turns this object into <title> and <meta> tags.
export const metadata = {
  title: "Job Portal App",
  description: "A job portal app built with Next.js and Spring Boot",
};

// `children` is the page (or nested layout) currently being shown.
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* font variables + antialiased text applied to the whole body */}
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}

import { Huninn } from "next/font/google";
import "./globals.css";

const inter = Huninn({
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata = {
  title: "台山醬 Hoisan Sauce",
  description: "Taishanese Dictionary and Language Resources",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Huninn&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}

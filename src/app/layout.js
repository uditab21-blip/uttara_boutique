import './globals.css';

export const metadata = {
  title: 'Uttara Boutique',
  description: 'Premium Saris E-commerce',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-ethnic-bg">
        {children}
      </body>
    </html>
  );
}
import './globals.css';

export const metadata = {
  title: 'Uttara Boutique — Bengal\'s Finest Handloom Saris',
  description: 'Discover authentic Bengali handloom saris — Dhakai Jamdani, Baluchari, Tant & Gorod. Premium quality, traditional craftsmanship, delivered across India.',
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
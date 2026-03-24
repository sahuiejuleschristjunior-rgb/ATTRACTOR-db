import './globals.css';

export const metadata = {
  title: 'Attractor CRM',
  description: 'Modern SaaS dashboard interface for leads and clients management.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

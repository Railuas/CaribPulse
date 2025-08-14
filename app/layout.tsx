export const metadata = {
  title: 'CaribePulse',
  description: 'Caribbean News & Weather',
};

import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

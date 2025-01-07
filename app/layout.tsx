import '@/app/ui/global.css';
import {inter} from './ui/fonts';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/*
        - adding inter to entire body as main primary font 
        - antialised to smooth out font, from tailwind
      */}
      <body className={`${inter.className} antialised`}>{children}</body>
    </html>
  );
}

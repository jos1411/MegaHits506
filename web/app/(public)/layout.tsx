import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { WhatsAppFloating } from "@/components/layout/whatsapp-floating";
import { RadioPlayer } from "@/components/radio/radio-player";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex-1 pb-14">{children}</main>
      <Footer />
      <RadioPlayer />
      <WhatsAppFloating />
    </>
  );
}

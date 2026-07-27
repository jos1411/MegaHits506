import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { WhatsAppFloating } from "@/components/layout/whatsapp-floating";
import { RadioPlayer } from "@/components/radio/radio-player";
import { ScrollToTop } from "@/components/ui/scroll-to-top";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex-1 pb-16">{children}</main>
      <Footer />
      <RadioPlayer />
      <WhatsAppFloating />
      <ScrollToTop />
    </>
  );
}

"use client";

import {
  Calendar,
  ChevronRight,
  Film,
  Home,
  Image,
  LayoutDashboard,
  LogOut,
  Menu,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment, useState } from "react";

import { signOut } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ToastProvider } from "@/components/ui/toast";
import { SITE_NAME } from "@/lib/constants";

const SIDEBAR_LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/photos", label: "Fotos", icon: Image },
  { href: "/admin/videos", label: "Videos", icon: Film },
  { href: "/admin/events", label: "Eventos", icon: Calendar },
];

const BREADCRUMB_LABELS: Record<string, string> = {
  photos: "Fotos",
  videos: "Videos",
  events: "Eventos",
  new: "Nuevo",
  edit: "Editar",
};

function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length <= 1) return null;

  const items = segments.map((seg, i) => {
    const href = "/" + segments.slice(0, i + 1).join("/");
    const label = BREADCRUMB_LABELS[seg] ?? decodeURIComponent(seg);
    return { href, label, isLast: i === segments.length - 1 };
  });

  return (
    <nav className="mb-4 flex items-center gap-1.5 text-sm text-muted-foreground">
      <Link href="/admin" className="flex items-center gap-1 hover:text-foreground transition-colors">
        <Home className="size-3.5" />
        <span className="sr-only">Dashboard</span>
      </Link>
      {items.map((item) => (
        <Fragment key={item.href}>
          <ChevronRight className="size-3.5" />
          {item.isLast ? (
            <span className="font-medium text-foreground">{item.label}</span>
          ) : (
            <Link href={item.href} className="hover:text-foreground transition-colors">
              {item.label}
            </Link>
          )}
        </Fragment>
      ))}
    </nav>
  );
}

function NavContent({ onNavigate }: { onNavigate: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
      {SIDEBAR_LINKS.map((link) => {
        const Icon = link.icon;
        const isActive = pathname === link.href || pathname.startsWith(link.href + "/");

        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              isActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Icon className="size-4 shrink-0" />
            {link.label}
          </Link>
        );
      })}

      <div className="mt-auto border-t pt-4">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <LogOut className="size-4 shrink-0 rotate-180" />
          Volver al sitio
        </Link>
      </div>
    </nav>
  );
}

export function AdminShell({
  children,
  userEmail,
}: {
  children: React.ReactNode;
  userEmail: string;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  async function handleLogout() {
    await signOut();
  }

  return (
    <ToastProvider>
      <div className="flex min-h-screen">
        {/* Desktop sidebar */}
        <aside className="hidden w-60 shrink-0 border-r bg-sidebar md:flex md:flex-col">
          <div className="flex h-16 items-center gap-3 border-b px-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
              M
            </div>
            <span className="text-sm font-semibold">{SITE_NAME}</span>
          </div>
          <NavContent onNavigate={() => {}} />
        </aside>

        {/* Mobile sidebar */}
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTitle className="sr-only">Navegación</SheetTitle>

          <SheetTrigger
            className="fixed top-3 left-3 z-40 inline-flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted md:hidden"
            aria-label="Abrir menú"
          >
            <Menu className="size-5" />
          </SheetTrigger>

          <SheetContent side="left" className="w-60 p-0">
            <div className="flex h-16 items-center gap-3 border-b px-6">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
                M
              </div>
              <span className="text-sm font-semibold">{SITE_NAME}</span>
            </div>
            <NavContent onNavigate={() => setSidebarOpen(false)} />
          </SheetContent>
        </Sheet>

        {/* Main content area */}
        <div className="flex flex-1 flex-col">
          <header className="flex h-16 items-center justify-end gap-4 border-b bg-background px-4 sm:px-6 md:pl-6 lg:px-8">
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">{userEmail}</span>
              <form action={handleLogout}>
                <Button variant="ghost" size="sm" type="submit">
                  <LogOut className="mr-2 size-4" />
                  Salir
                </Button>
              </form>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <Breadcrumbs />
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <h2 className="text-2xl font-semibold">Página no encontrada</h2>
      <p className="max-w-md text-muted-foreground">
        La página que estás buscando no existe o fue movida.
      </p>
      <Link
        href="/"
        className="rounded-full bg-primary px-6 py-3 text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Volver al inicio
      </Link>
    </div>
  );
}

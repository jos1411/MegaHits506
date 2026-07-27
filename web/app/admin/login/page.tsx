"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";

import { signIn, type AuthActionState } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SITE_NAME } from "@/lib/constants";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState<AuthActionState, FormData>(
    signIn,
    { error: null, success: false },
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-lg font-bold text-primary-foreground">
            M
          </div>
          <CardTitle className="text-xl">Iniciar Sesión</CardTitle>
          <CardDescription>
            Accedé al panel de administración de {SITE_NAME}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            {state.error && (
              <div className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {state.error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="admin@ejemplo.com"
                required
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>

            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? "Ingresando..." : "Ingresar"}
              {!pending && <ArrowRight className="ml-2 size-4" />}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-sm text-muted-foreground underline-offset-4 hover:underline"
            >
              ← Volver al sitio
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

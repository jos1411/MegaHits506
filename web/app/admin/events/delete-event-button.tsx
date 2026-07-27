"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import { Trash2 } from "lucide-react";
import { useActionState, useEffect, useState } from "react";

import { deleteEventAction, type EventActionState } from "@/actions/events";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function DeleteEventButton({ eventId }: { eventId: string }) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState<EventActionState, FormData>(
    deleteEventAction,
    { error: null, success: false },
  );

  useEffect(() => {
    if (state.success) {
      setOpen(false);
    }
  }, [state.success]);

  return (
    <>
      <Button variant="destructive" size="sm" onClick={() => setOpen(true)}>
        <Trash2 className="mr-2 size-4" />
        Eliminar
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Eliminar evento?</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. El evento se eliminará permanentemente.
            </DialogDescription>
          </DialogHeader>

          {state.error && (
            <div className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {state.error}
            </div>
          )}

          <form action={action}>
            <input type="hidden" name="id" value={eventId} />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" variant="destructive" disabled={pending}>
                {pending ? "Eliminando..." : "Eliminar evento"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

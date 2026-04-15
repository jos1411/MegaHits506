using System;
using System.Web.Mvc;
using MegaHits506.AccesoDatos;
using MegaHits506.Models;

namespace MegaHits506.Controllers
{
    public class CotizacionesController : BaseController
    {
        private ACCotizaciones acCotizaciones = new ACCotizaciones();

        public ActionResult Index()
        {
            if (!SesionActiva() || !EsAdmin())
                return RedirectToAction("Login", "Acceso");

            var lista = acCotizaciones.Listar();
            return View(lista);
        }

        public ActionResult Detalle(int? id)
        {
            if (!SesionActiva() || !EsAdmin())
                return RedirectToAction("Login", "Acceso");

            if (id == null)
                return RedirectToAction("Index");

            var cotizacion = acCotizaciones.Obtener(id.Value);

            if (cotizacion == null)
                return RedirectToAction("Index");

            return View(cotizacion);
        }

        [HttpPost]
        public ActionResult CambiarEstado(int id, string estado)
        {
            if (!SesionActiva() || !EsAdmin())
                return RedirectToAction("Login", "Acceso");

            string error = acCotizaciones.CambiarEstado(id, estado, UsuarioNombre());

            if (error != null)
                TempData["Error"] = error;
            else
                TempData["Mensaje"] = "Estado actualizado correctamente.";

            return RedirectToAction("Index");
        }

        public ActionResult Eliminar(int? id)
        {
            if (!SesionActiva() || !EsAdmin())
                return RedirectToAction("Login", "Acceso");

            if (id == null)
                return RedirectToAction("Index");

            string error = acCotizaciones.Eliminar(id.Value, UsuarioNombre());

            if (error != null)
                TempData["Error"] = error;
            else
                TempData["Mensaje"] = "Solicitud eliminada correctamente.";

            return RedirectToAction("Index");
        }

        public ActionResult MisSolicitudes()
        {
            if (!SesionActiva())
                return RedirectToAction("Login", "Acceso");

            var lista = acCotizaciones.ListarPorUsuario(UsuarioId());
            return View(lista);
        }

        public ActionResult Solicitar()
        {
            if (!SesionActiva())
            {
                TempData["MensajeLogin"] = "Necesitás iniciar sesión para solicitar una cotización.";
                return RedirectToAction("Login", "Acceso");
            }
            return View();
        }

        [HttpPost]
        public ActionResult Solicitar(Cotizacion cotizacion)
        {
            if (!SesionActiva())
                return RedirectToAction("Login", "Acceso");

            // Validar que la fecha no sea pasada
            if (cotizacion.FechaEventoDeseada < DateTime.Today)
            {
                ViewBag.Error = "La fecha del evento no puede ser en el pasado.";
                return View(cotizacion);
            }

            cotizacion.UsIdentificador = UsuarioId();
            string error = acCotizaciones.Insertar(cotizacion, UsuarioNombre());

            if (error != null)
            {
                ViewBag.Error = error;
                return View(cotizacion);
            }

            TempData["Mensaje"] = "¡Solicitud enviada! Nos pondremos en contacto pronto.";
            return RedirectToAction("MisSolicitudes");
        }
    }
}
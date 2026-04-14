using System.Web.Mvc;
using MegaHits506.AccesoDatos;
using MegaHits506.Models;

namespace MegaHits506.Controllers
{
    public class CotizacionesController : BaseController
    {
        private ACCotizaciones acCotizaciones = new ACCotizaciones();

        // GET: /Cotizaciones/ (solo admin)
        public ActionResult Index()
        {
            if (!SesionActiva() || !EsAdmin())
                return RedirectToAction("Login", "Acceso");

            var lista = acCotizaciones.Listar();
            return View(lista);
        }

        // GET: /Cotizaciones/Detalle/5 (solo admin)
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

        // POST: /Cotizaciones/CambiarEstado (solo admin)
        [HttpPost]
        public ActionResult CambiarEstado(int id, string estado)
        {
            if (!SesionActiva() || !EsAdmin())
                return RedirectToAction("Login", "Acceso");

            acCotizaciones.CambiarEstado(id, estado, UsuarioNombre());
            TempData["Mensaje"] = "Estado actualizado correctamente.";
            return RedirectToAction("Index");
        }

        // GET: /Cotizaciones/Eliminar/5 (solo admin)
        public ActionResult Eliminar(int? id)
        {
            if (!SesionActiva() || !EsAdmin())
                return RedirectToAction("Login", "Acceso");

            if (id == null)
                return RedirectToAction("Index");

            acCotizaciones.Eliminar(id.Value, UsuarioNombre());
            TempData["Mensaje"] = "Solicitud eliminada correctamente.";
            return RedirectToAction("Index");
        }

        // GET: /Cotizaciones/MisSolicitudes (cliente)
        public ActionResult MisSolicitudes()
        {
            if (!SesionActiva())
                return RedirectToAction("Login", "Acceso");

            var lista = acCotizaciones.ListarPorUsuario(UsuarioId());
            return View(lista);
        }

        // GET: /Cotizaciones/Solicitar (cliente)
        public ActionResult Solicitar()
        {
            if (!SesionActiva())
            {
                TempData["MensajeLogin"] = "Necesitás iniciar sesión para solicitar una cotización.";
                return RedirectToAction("Login", "Acceso");
            }

            return View();
        }

        // POST: /Cotizaciones/Solicitar (cliente)
        [HttpPost]
        public ActionResult Solicitar(Cotizacion cotizacion)
        {
            if (!SesionActiva())
                return RedirectToAction("Login", "Acceso");

            cotizacion.UsIdentificador = UsuarioId();
            acCotizaciones.Insertar(cotizacion, UsuarioNombre());
            TempData["Mensaje"] = "¡Solicitud enviada! Nos pondremos en contacto pronto.";
            return RedirectToAction("MisSolicitudes");
        }
    }
}
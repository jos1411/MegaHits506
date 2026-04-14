using System.Web.Mvc;
using MegaHits506.AccesoDatos;
using MegaHits506.Models;

namespace MegaHits506.Controllers
{
    public class EventosController : BaseController
    {
        private ACEventos acEventos = new ACEventos();

        // GET: /Eventos/
        public ActionResult Index()
        {
            if (!SesionActiva() || !EsAdmin())
                return RedirectToAction("Login", "Acceso");

            var lista = acEventos.Listar();
            return View(lista);
        }

        // GET: /Eventos/Crear
        public ActionResult Crear()
        {
            if (!SesionActiva() || !EsAdmin())
                return RedirectToAction("Login", "Acceso");

            return View();
        }

        // POST: /Eventos/Crear
        [HttpPost]
        public ActionResult Crear(Evento evento)
        {
            if (!SesionActiva() || !EsAdmin())
                return RedirectToAction("Login", "Acceso");

            acEventos.Insertar(evento, UsuarioNombre());
            TempData["Mensaje"] = "Evento registrado correctamente.";
            return RedirectToAction("Index");
        }

        // GET: /Eventos/Editar/5
        public ActionResult Editar(int? id)
        {
            if (!SesionActiva() || !EsAdmin())
                return RedirectToAction("Login", "Acceso");

            if (id == null)
                return RedirectToAction("Index");

            var evento = acEventos.Obtener(id.Value);

            if (evento == null)
                return RedirectToAction("Index");

            return View(evento);
        }

        // POST: /Eventos/Editar
        [HttpPost]
        public ActionResult Editar(Evento evento)
        {
            if (!SesionActiva() || !EsAdmin())
                return RedirectToAction("Login", "Acceso");

            acEventos.Actualizar(evento, UsuarioNombre());
            TempData["Mensaje"] = "Evento actualizado correctamente.";
            return RedirectToAction("Index");
        }

        // GET: /Eventos/Eliminar/5
        public ActionResult Eliminar(int? id)
        {
            if (!SesionActiva() || !EsAdmin())
                return RedirectToAction("Login", "Acceso");

            if (id == null)
                return RedirectToAction("Index");

            acEventos.Eliminar(id.Value, UsuarioNombre());
            TempData["Mensaje"] = "Evento eliminado correctamente.";
            return RedirectToAction("Index");
        }
    }
}
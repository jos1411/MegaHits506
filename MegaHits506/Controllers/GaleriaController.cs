using System.Web.Mvc;
using MegaHits506.AccesoDatos;
using MegaHits506.Models;

namespace MegaHits506.Controllers
{
    public class GaleriaController : BaseController
    {
        private ACGaleria acGaleria = new ACGaleria();

        // GET: /Galeria/
        public ActionResult Index()
        {
            if (!SesionActiva() || !EsAdmin())
                return RedirectToAction("Login", "Acceso");

            var lista = acGaleria.Listar();
            return View(lista);
        }

        // GET: /Galeria/Crear
        public ActionResult Crear()
        {
            if (!SesionActiva() || !EsAdmin())
                return RedirectToAction("Login", "Acceso");

            ViewBag.Eventos = acGaleria.ListarEventos();
            return View();
        }

        // POST: /Galeria/Crear
        [HttpPost]
        public ActionResult Crear(Galeria galeria)
        {
            if (!SesionActiva() || !EsAdmin())
                return RedirectToAction("Login", "Acceso");

            acGaleria.Insertar(galeria, UsuarioNombre());
            TempData["Mensaje"] = "Elemento agregado correctamente.";
            return RedirectToAction("Index");
        }

        // GET: /Galeria/Editar/5
        public ActionResult Editar(int? id)
        {
            if (!SesionActiva() || !EsAdmin())
                return RedirectToAction("Login", "Acceso");

            if (id == null)
                return RedirectToAction("Index");

            var galeria = acGaleria.Obtener(id.Value);

            if (galeria == null)
                return RedirectToAction("Index");

            ViewBag.Eventos = acGaleria.ListarEventos();
            return View(galeria);
        }

        // POST: /Galeria/Editar
        [HttpPost]
        public ActionResult Editar(Galeria galeria)
        {
            if (!SesionActiva() || !EsAdmin())
                return RedirectToAction("Login", "Acceso");

            acGaleria.Actualizar(galeria, UsuarioNombre());
            TempData["Mensaje"] = "Elemento actualizado correctamente.";
            return RedirectToAction("Index");
        }

        // GET: /Galeria/Eliminar/5
        public ActionResult Eliminar(int? id)
        {
            if (!SesionActiva() || !EsAdmin())
                return RedirectToAction("Login", "Acceso");

            if (id == null)
                return RedirectToAction("Index");

            acGaleria.Eliminar(id.Value, UsuarioNombre());
            TempData["Mensaje"] = "Elemento eliminado correctamente.";
            return RedirectToAction("Index");
        }
    }
}
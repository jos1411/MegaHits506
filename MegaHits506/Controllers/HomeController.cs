using System.Web.Mvc;
using MegaHits506.AccesoDatos;

namespace MegaHits506.Controllers
{
    public class HomeController : BaseController
    {
        // GET: /
        public ActionResult Index()
        {
            return View();
        }

        // GET: /Home/Eventos
        public ActionResult Eventos()
        {
            ACEventos acEventos = new ACEventos();
            var lista = acEventos.Listar();
            return View(lista);
        }

        // GET: /Home/DetalleEvento/5
        public ActionResult DetalleEvento(int? id)
        {
            if (id == null)
                return RedirectToAction("Eventos");

            ACEventos acEventos = new ACEventos();
            var evento = acEventos.Obtener(id.Value);

            if (evento == null)
                return RedirectToAction("Eventos");

            ACGaleria acGaleria = new ACGaleria();
            ViewBag.Galeria = acGaleria.ListarPorEvento(id.Value);

            return View(evento);
        }

        // GET: /Home/Galeria
        public ActionResult Galeria()
        {
            ACGaleria acGaleria = new ACGaleria();
            var lista = acGaleria.Listar();
            return View(lista);
        }

        // GET: /Home/Contact
        public ActionResult Contact()
        {
            return View();
        }

        // GET: /Home/About (solo admin)
        public ActionResult About()
        {
            if (!SesionActiva() || !EsAdmin())
                return RedirectToAction("Login", "Acceso");

            return View();
        }
    }
}
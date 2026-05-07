using System;
using System.IO;
using System.Web;
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

            CargarManualUrl();
            return View();
        }

        // POST: /Home/About (subir manual, solo admin)
        [HttpPost]
        public ActionResult About(HttpPostedFileBase archivoManual)
        {
            if (!SesionActiva() || !EsAdmin())
                return RedirectToAction("Login", "Acceso");

            if (archivoManual != null && archivoManual.ContentLength > 0)
            {
                string extension = Path.GetExtension(archivoManual.FileName).ToLower();
                string[] permitidos = { ".pdf", ".docx" };

                if (Array.IndexOf(permitidos, extension) < 0)
                {
                    ViewBag.Error = "Solo se permiten archivos PDF o DOCX.";
                    CargarManualUrl();
                    return View();
                }

                string carpeta = Server.MapPath("~/Content/manual/");
                if (!Directory.Exists(carpeta))
                    Directory.CreateDirectory(carpeta);

                // Eliminar versión anterior si existe
                foreach (var ext in new[] { ".pdf", ".docx" })
                {
                    string viejo = carpeta + "Manual_Usuario_MegaHits506" + ext;
                    if (System.IO.File.Exists(viejo))
                        System.IO.File.Delete(viejo);
                }

                string nombreFijo = "Manual_Usuario_MegaHits506" + extension;
                archivoManual.SaveAs(carpeta + nombreFijo);
                TempData["Mensaje"] = "Manual actualizado correctamente.";
            }
            else
            {
                ViewBag.Error = "Por favor, seleccioná un archivo.";
            }

            CargarManualUrl();
            return View();
        }

        private void CargarManualUrl()
        {
            string carpeta = Server.MapPath("~/Content/manual/");
            foreach (var ext in new[] { ".pdf", ".docx" })
            {
                string ruta = carpeta + "Manual_Usuario_MegaHits506" + ext;
                if (System.IO.File.Exists(ruta))
                {
                    ViewBag.ManualUrl = "/Content/manual/Manual_Usuario_MegaHits506" + ext;
                    return;
                }
            }
            ViewBag.ManualUrl = null;
        }
    }
}
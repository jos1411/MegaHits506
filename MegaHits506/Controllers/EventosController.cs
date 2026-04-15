using System;
using System.IO;
using System.Web;
using System.Web.Mvc;
using MegaHits506.AccesoDatos;
using MegaHits506.Models;

namespace MegaHits506.Controllers
{
    public class EventosController : BaseController
    {
        private ACEventos acEventos = new ACEventos();

        public ActionResult Index()
        {
            if (!SesionActiva() || !EsAdmin())
                return RedirectToAction("Login", "Acceso");

            var lista = acEventos.Listar();
            return View(lista);
        }

        public ActionResult Crear()
        {
            if (!SesionActiva() || !EsAdmin())
                return RedirectToAction("Login", "Acceso");

            return View();
        }

        [HttpPost]
        [ValidateInput(false)]
        public ActionResult Crear(Evento evento, HttpPostedFileBase archivoPortada)
        {
            if (!SesionActiva() || !EsAdmin())
                return RedirectToAction("Login", "Acceso");

            if (string.IsNullOrWhiteSpace(evento.Titulo))
            {
                ViewBag.Error = "El título del evento es requerido.";
                return View(evento);
            }

            if (archivoPortada != null && archivoPortada.ContentLength > 0)
            {
                string resultado = SubirPortada(archivoPortada);
                if (resultado.StartsWith("ERROR:"))
                {
                    ViewBag.Error = resultado.Replace("ERROR:", "");
                    return View(evento);
                }
                evento.ImagenPortada = resultado;
            }

            string error = acEventos.Insertar(evento, UsuarioNombre());

            if (error != null)
            {
                ViewBag.Error = error;
                return View(evento);
            }

            TempData["Mensaje"] = "Evento registrado correctamente.";
            return RedirectToAction("Index");
        }

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

        [HttpPost]
        [ValidateInput(false)]
        public ActionResult Editar(Evento evento, HttpPostedFileBase archivoPortada)
        {
            if (!SesionActiva() || !EsAdmin())
                return RedirectToAction("Login", "Acceso");

            if (string.IsNullOrWhiteSpace(evento.Titulo))
            {
                ViewBag.Error = "El título del evento es requerido.";
                return View(evento);
            }

            if (archivoPortada != null && archivoPortada.ContentLength > 0)
            {
                string resultado = SubirPortada(archivoPortada);
                if (resultado.StartsWith("ERROR:"))
                {
                    ViewBag.Error = resultado.Replace("ERROR:", "");
                    return View(evento);
                }
                evento.ImagenPortada = resultado;
            }

            string error = acEventos.Actualizar(evento, UsuarioNombre());

            if (error != null)
            {
                ViewBag.Error = error;
                return View(evento);
            }

            TempData["Mensaje"] = "Evento actualizado correctamente.";
            return RedirectToAction("Index");
        }

        public ActionResult Eliminar(int? id)
        {
            if (!SesionActiva() || !EsAdmin())
                return RedirectToAction("Login", "Acceso");

            if (id == null)
                return RedirectToAction("Index");

            string error = acEventos.Eliminar(id.Value, UsuarioNombre());

            if (error != null)
                TempData["Error"] = error;
            else
                TempData["Mensaje"] = "Evento eliminado correctamente.";

            return RedirectToAction("Index");
        }

        private string SubirPortada(HttpPostedFileBase archivo)
        {
            try
            {
                string[] extensiones = { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
                string extension = Path.GetExtension(archivo.FileName).ToLower();

                if (Array.IndexOf(extensiones, extension) < 0)
                    return "ERROR:Solo se permiten imágenes JPG, PNG, GIF o WEBP.";

                if (archivo.ContentLength > 10 * 1024 * 1024)
                    return "ERROR:La imagen no puede superar 10MB.";

                string nombreArchivo = "evento_" + Guid.NewGuid().ToString() + extension;
                string rutaFisica = Server.MapPath("~/Content/uploads/" + nombreArchivo);
                archivo.SaveAs(rutaFisica);

                return "/Content/uploads/" + nombreArchivo;
            }
            catch (Exception ex)
            {
                return "ERROR:Error al subir la imagen: " + ex.Message;
            }
        }
    }
}
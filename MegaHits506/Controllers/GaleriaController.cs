using System;
using System.IO;
using System.Web;
using System.Web.Mvc;
using MegaHits506.AccesoDatos;
using MegaHits506.Models;

namespace MegaHits506.Controllers
{
    public class GaleriaController : BaseController
    {
        private ACGaleria acGaleria = new ACGaleria();

        public ActionResult Index()
        {
            if (!SesionActiva() || !EsAdmin())
                return RedirectToAction("Login", "Acceso");

            var lista = acGaleria.Listar();
            return View(lista);
        }

        public ActionResult Crear()
        {
            if (!SesionActiva() || !EsAdmin())
                return RedirectToAction("Login", "Acceso");

            ViewBag.Eventos = acGaleria.ListarEventos();
            return View();
        }

        [HttpPost]
        [ValidateInput(false)]
        public ActionResult Crear(Galeria galeria, HttpPostedFileBase archivoFoto)
        {
            if (!SesionActiva() || !EsAdmin())
                return RedirectToAction("Login", "Acceso");

            if (galeria.Tipo == "FOTO")
            {
                if (archivoFoto != null && archivoFoto.ContentLength > 0)
                {
                    string resultado = SubirArchivo(archivoFoto);
                    if (resultado.StartsWith("ERROR:"))
                    {
                        ViewBag.Error = resultado.Replace("ERROR:", "");
                        ViewBag.Eventos = acGaleria.ListarEventos();
                        return View(galeria);
                    }
                    galeria.Url = resultado;
                }
                else if (string.IsNullOrWhiteSpace(galeria.Url))
                {
                    ViewBag.Error = "Debés subir una foto o ingresar una URL de imagen.";
                    ViewBag.Eventos = acGaleria.ListarEventos();
                    return View(galeria);
                }
            }
            else if (galeria.Tipo == "VIDEO")
            {
                if (string.IsNullOrWhiteSpace(galeria.Url))
                {
                    ViewBag.Error = "La URL del video de YouTube es requerida.";
                    ViewBag.Eventos = acGaleria.ListarEventos();
                    return View(galeria);
                }
                // Convertir URL normal de YouTube a embed
                galeria.Url = ConvertirYouTubeEmbed(galeria.Url);
            }
            else
            {
                ViewBag.Error = "Seleccioná el tipo de contenido.";
                ViewBag.Eventos = acGaleria.ListarEventos();
                return View(galeria);
            }

            string error = acGaleria.Insertar(galeria, UsuarioNombre());

            if (error != null)
            {
                ViewBag.Error = error;
                ViewBag.Eventos = acGaleria.ListarEventos();
                return View(galeria);
            }

            TempData["Mensaje"] = "Elemento agregado correctamente.";
            return RedirectToAction("Index");
        }

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

        [HttpPost]
        [ValidateInput(false)]
        public ActionResult Editar(Galeria galeria, HttpPostedFileBase archivoFoto)
        {
            if (!SesionActiva() || !EsAdmin())
                return RedirectToAction("Login", "Acceso");

            if (galeria.Tipo == "FOTO")
            {
                if (archivoFoto != null && archivoFoto.ContentLength > 0)
                {
                    string resultado = SubirArchivo(archivoFoto);
                    if (resultado.StartsWith("ERROR:"))
                    {
                        ViewBag.Error = resultado.Replace("ERROR:", "");
                        ViewBag.Eventos = acGaleria.ListarEventos();
                        return View(galeria);
                    }
                    galeria.Url = resultado;
                }
                else if (string.IsNullOrWhiteSpace(galeria.Url))
                {
                    ViewBag.Error = "Debés subir una foto o ingresar una URL.";
                    ViewBag.Eventos = acGaleria.ListarEventos();
                    return View(galeria);
                }
            }
            else if (galeria.Tipo == "VIDEO")
            {
                if (string.IsNullOrWhiteSpace(galeria.Url))
                {
                    ViewBag.Error = "La URL del video de YouTube es requerida.";
                    ViewBag.Eventos = acGaleria.ListarEventos();
                    return View(galeria);
                }
                // Solo convertir si no es ya un embed
                if (!galeria.Url.Contains("/embed/"))
                    galeria.Url = ConvertirYouTubeEmbed(galeria.Url);
            }

            string error = acGaleria.Actualizar(galeria, UsuarioNombre());

            if (error != null)
            {
                ViewBag.Error = error;
                ViewBag.Eventos = acGaleria.ListarEventos();
                return View(galeria);
            }

            TempData["Mensaje"] = "Elemento actualizado correctamente.";
            return RedirectToAction("Index");
        }

        public ActionResult Eliminar(int? id)
        {
            if (!SesionActiva() || !EsAdmin())
                return RedirectToAction("Login", "Acceso");

            if (id == null)
                return RedirectToAction("Index");

            string error = acGaleria.Eliminar(id.Value, UsuarioNombre());

            if (error != null)
                TempData["Error"] = error;
            else
                TempData["Mensaje"] = "Elemento eliminado correctamente.";

            return RedirectToAction("Index");
        }

        // Convierte URL normal de YouTube a embed
        private string ConvertirYouTubeEmbed(string url)
        {
            if (string.IsNullOrWhiteSpace(url)) return url;

            // https://www.youtube.com/watch?v=CODIGO
            if (url.Contains("youtube.com/watch?v="))
                return url.Replace("youtube.com/watch?v=", "youtube.com/embed/")
                          .Replace("&list=", "?list=");

            // https://youtu.be/CODIGO
            if (url.Contains("youtu.be/"))
            {
                string codigo = url.Split('/')[url.Split('/').Length - 1];
                if (codigo.Contains("?"))
                    codigo = codigo.Split('?')[0];
                return "https://www.youtube.com/embed/" + codigo;
            }

            // Si ya es embed, la dejamos igual
            return url;
        }

        private string SubirArchivo(HttpPostedFileBase archivo)
        {
            try
            {
                string[] extensiones = { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
                string extension = Path.GetExtension(archivo.FileName).ToLower();

                if (Array.IndexOf(extensiones, extension) < 0)
                    return "ERROR:Solo se permiten imágenes JPG, PNG, GIF o WEBP.";

                if (archivo.ContentLength > 10 * 1024 * 1024)
                    return "ERROR:La imagen no puede superar 10MB.";

                string nombreArchivo = Guid.NewGuid().ToString() + extension;
                string rutaFisica = Server.MapPath("~/Content/uploads/" + nombreArchivo);
                archivo.SaveAs(rutaFisica);

                return "/Content/uploads/" + nombreArchivo;
            }
            catch (Exception ex)
            {
                return "ERROR:Error al subir el archivo: " + ex.Message;
            }
        }
    }
}
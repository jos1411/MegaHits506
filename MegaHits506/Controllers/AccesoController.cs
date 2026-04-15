using MegaHits506.AccesoDatos;
using MegaHits506.Models;
using System.Web.Mvc;

namespace MegaHits506.Controllers
{
    public class AccesoController : BaseController
    {
        private ACUsuarios acUsuarios = new ACUsuarios();

        public ActionResult Login()
        {
            if (SesionActiva())
            {
                if (EsAdmin())
                    return RedirectToAction("Index", "Eventos");
                else
                    return RedirectToAction("Index", "Home");
            }
            return View();
        }

        [HttpPost]
        public ActionResult Login(string correo, string clave)
        {
            if (string.IsNullOrWhiteSpace(correo) || string.IsNullOrWhiteSpace(clave))
            {
                ViewBag.Error = "Correo y contraseña son requeridos.";
                return View();
            }

            try
            {
                Usuario usuario = acUsuarios.Login(correo, clave);

                if (usuario != null)
                {
                    Session["UsuarioId"] = usuario.Identificador;
                    Session["UsuarioNombre"] = usuario.NombreCompleto;
                    Session["UsuarioRol"] = usuario.Rol;

                    if (usuario.Rol == "Administrador")
                        return RedirectToAction("Index", "Eventos");
                    else
                        return RedirectToAction("Index", "Home");
                }

                ViewBag.Error = "Correo o contraseña incorrectos.";
                return View();
            }
            catch
            {
                ViewBag.Error = "Error al conectar con el servidor. Intentá de nuevo.";
                return View();
            }
        }

        public ActionResult Registro()
        {
            if (SesionActiva())
                return RedirectToAction("Index", "Home");

            return View();
        }

        [HttpPost]
        public ActionResult Registro(Usuario usuario)
        {
            if (SesionActiva())
                return RedirectToAction("Index", "Home");

            if (string.IsNullOrWhiteSpace(usuario.NombreCompleto) ||
                string.IsNullOrWhiteSpace(usuario.Correo) ||
                string.IsNullOrWhiteSpace(usuario.Clave))
            {
                ViewBag.Error = "Nombre, correo y contraseña son requeridos.";
                return View(usuario);
            }

            usuario.RoIdentificador = 2;
            string error = acUsuarios.Insertar(usuario, usuario.Correo);

            if (error != null)
            {
                ViewBag.Error = error;
                return View(usuario);
            }

            try
            {
                Usuario registrado = acUsuarios.Login(usuario.Correo, usuario.Clave);

                if (registrado != null)
                {
                    Session["UsuarioId"] = registrado.Identificador;
                    Session["UsuarioNombre"] = registrado.NombreCompleto;
                    Session["UsuarioRol"] = registrado.Rol;
                }
            }
            catch { }

            TempData["Mensaje"] = "¡Registro exitoso! Bienvenido a Mega Hits 506.";
            return RedirectToAction("Index", "Home");
        }

        public ActionResult CerrarSesion()
        {
            Session.Clear();
            return RedirectToAction("Login", "Acceso");
        }
    }
}
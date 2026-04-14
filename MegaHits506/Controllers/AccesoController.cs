using MegaHits506.AccesoDatos;
using MegaHits506.Models;
using System.Web.Mvc;

namespace MegaHits506.Controllers
{
    public class AccesoController : BaseController
    {
        private ACUsuarios acUsuarios = new ACUsuarios();

        // GET: /Acceso/Login
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

        // POST: /Acceso/Login
        [HttpPost]
        public ActionResult Login(string correo, string clave)
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

        // GET: /Acceso/Registro
        public ActionResult Registro()
        {
            if (SesionActiva())
                return RedirectToAction("Index", "Home");

            return View();
        }

        // POST: /Acceso/Registro
        [HttpPost]
        public ActionResult Registro(Usuario usuario)
        {
            if (SesionActiva())
                return RedirectToAction("Index", "Home");

            // Rol 2 = Cliente, siempre automático
            usuario.RoIdentificador = 2;
            acUsuarios.Insertar(usuario, usuario.Correo);

            // Después de registrarse iniciamos sesión automáticamente
            Usuario registrado = acUsuarios.Login(usuario.Correo, usuario.Clave);

            if (registrado != null)
            {
                Session["UsuarioId"] = registrado.Identificador;
                Session["UsuarioNombre"] = registrado.NombreCompleto;
                Session["UsuarioRol"] = registrado.Rol;
            }

            TempData["Mensaje"] = "¡Registro exitoso! Bienvenido a Mega Hits 506.";
            return RedirectToAction("Index", "Home");
        }

        // GET: /Acceso/CerrarSesion
        public ActionResult CerrarSesion()
        {
            Session.Clear();
            return RedirectToAction("Login", "Acceso");
        }
    }
}
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Web.Mvc;
using MegaHits506.AccesoDatos;
using MegaHits506.Models;

namespace MegaHits506.Controllers
{
    public class UsuariosController : BaseController
    {
        private ACUsuarios acUsuarios = new ACUsuarios();

        // GET: /Usuarios/
        public ActionResult Index()
        {
            if (!SesionActiva() || !EsAdmin())
                return RedirectToAction("Login", "Acceso");

            var lista = acUsuarios.Listar();
            return View(lista);
        }

        // GET: /Usuarios/Crear
        public ActionResult Crear()
        {
            if (!SesionActiva() || !EsAdmin())
                return RedirectToAction("Login", "Acceso");

            CargarRoles();
            return View();
        }

        // POST: /Usuarios/Crear
        [HttpPost]
        public ActionResult Crear(Usuario usuario)
        {
            if (!SesionActiva() || !EsAdmin())
                return RedirectToAction("Login", "Acceso");

            acUsuarios.Insertar(usuario, UsuarioNombre());
            TempData["Mensaje"] = "Usuario registrado correctamente.";
            return RedirectToAction("Index");
        }

        // GET: /Usuarios/Editar/5
        public ActionResult Editar(int? id)
        {
            if (!SesionActiva() || !EsAdmin())
                return RedirectToAction("Login", "Acceso");

            if (id == null)
                return RedirectToAction("Index");

            var usuario = acUsuarios.Obtener(id.Value);

            if (usuario == null)
                return RedirectToAction("Index");

            CargarRoles();
            return View(usuario);
        }

        // POST: /Usuarios/Editar
        [HttpPost]
        public ActionResult Editar(Usuario usuario)
        {
            if (!SesionActiva() || !EsAdmin())
                return RedirectToAction("Login", "Acceso");

            acUsuarios.Actualizar(usuario, UsuarioNombre());
            TempData["Mensaje"] = "Usuario actualizado correctamente.";
            return RedirectToAction("Index");
        }

        // GET: /Usuarios/Eliminar/5
        public ActionResult Eliminar(int? id)
        {
            if (!SesionActiva() || !EsAdmin())
                return RedirectToAction("Login", "Acceso");

            if (id == null)
                return RedirectToAction("Index");

            if (id.Value == UsuarioId())
            {
                TempData["Error"] = "No podés inactivar tu propio usuario.";
                return RedirectToAction("Index");
            }

            acUsuarios.Eliminar(id.Value, UsuarioNombre());
            TempData["Mensaje"] = "Usuario inactivado correctamente.";
            return RedirectToAction("Index");
        }

        // Carga roles para los dropdowns
        private void CargarRoles()
        {
            using (SqlConnection con = new SqlConnection(
                ConfigurationManager.ConnectionStrings["MegaHitsDB"].ConnectionString))
            {
                SqlCommand cmd = new SqlCommand("sp_list_roles", con);
                cmd.CommandType = CommandType.StoredProcedure;
                con.Open();
                SqlDataReader dr = cmd.ExecuteReader();
                var roles = new List<SelectListItem>();
                while (dr.Read())
                {
                    roles.Add(new SelectListItem
                    {
                        Value = dr["ro_identificador"].ToString(),
                        Text = dr["ro_descripcion"].ToString()
                    });
                }
                ViewBag.Roles = roles;
            }
        }
    }
}
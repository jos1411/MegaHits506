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

        public ActionResult Index()
        {
            if (!SesionActiva() || !EsAdmin())
                return RedirectToAction("Login", "Acceso");

            var lista = acUsuarios.Listar();
            return View(lista);
        }

        public ActionResult Crear()
        {
            if (!SesionActiva() || !EsAdmin())
                return RedirectToAction("Login", "Acceso");

            CargarRoles();
            return View();
        }

        [HttpPost]
        public ActionResult Crear(Usuario usuario)
        {
            if (!SesionActiva() || !EsAdmin())
                return RedirectToAction("Login", "Acceso");

            string error = acUsuarios.Insertar(usuario, UsuarioNombre());

            if (error != null)
            {
                ViewBag.Error = error;
                CargarRoles();
                return View(usuario);
            }

            TempData["Mensaje"] = "Usuario registrado correctamente.";
            return RedirectToAction("Index");
        }

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

        [HttpPost]
        public ActionResult Editar(Usuario usuario)
        {
            if (!SesionActiva() || !EsAdmin())
                return RedirectToAction("Login", "Acceso");

            string error = acUsuarios.Actualizar(usuario, UsuarioNombre());

            if (error != null)
            {
                ViewBag.Error = error;
                CargarRoles();
                return View(usuario);
            }

            TempData["Mensaje"] = "Usuario actualizado correctamente.";
            return RedirectToAction("Index");
        }

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

            string error = acUsuarios.Eliminar(id.Value, UsuarioNombre());

            if (error != null)
                TempData["Error"] = error;
            else
                TempData["Mensaje"] = "Usuario inactivado correctamente.";

            return RedirectToAction("Index");
        }

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
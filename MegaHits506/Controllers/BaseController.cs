using System.Web.Mvc;

namespace MegaHits506.Controllers
{
    public class BaseController : Controller
    {
        protected bool SesionActiva()
        {
            return Session["UsuarioId"] != null;
        }

        protected bool EsAdmin()
        {
            return Session["UsuarioRol"] != null &&
                   Session["UsuarioRol"].ToString() == "Administrador";
        }

        protected int UsuarioId()
        {
            return Session["UsuarioId"] != null
                ? (int)Session["UsuarioId"] : 0;
        }

        protected string UsuarioNombre()
        {
            return Session["UsuarioNombre"] != null
                ? Session["UsuarioNombre"].ToString() : "";
        }
    }
}
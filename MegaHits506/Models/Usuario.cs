using System;

namespace MegaHits506.Models
{
    public class Usuario
    {
        public int Identificador { get; set; }
        public string Cedula { get; set; }
        public string Correo { get; set; }
        public string Clave { get; set; }
        public string NombreCompleto { get; set; }
        public int RoIdentificador { get; set; }
        public string Rol { get; set; }
        public string Estado { get; set; }
    }
}
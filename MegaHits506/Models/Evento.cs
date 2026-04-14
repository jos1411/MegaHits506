using System;

namespace MegaHits506.Models
{
    public class Evento
    {
        public int Identificador { get; set; }
        public string Titulo { get; set; }
        public string Descripcion { get; set; }
        public DateTime? FechaEvento { get; set; }
        public string Ubicacion { get; set; }
        public string ImagenPortada { get; set; }
        public string Estado { get; set; }
    }
}
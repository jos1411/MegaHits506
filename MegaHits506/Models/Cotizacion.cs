using System;

namespace MegaHits506.Models
{
    public class Cotizacion
    {
        public int Identificador { get; set; }
        public int UsIdentificador { get; set; }
        public string Cliente { get; set; }
        public string Correo { get; set; }
        public DateTime FechaEventoDeseada { get; set; }
        public string TipoEvento { get; set; }
        public string Detalles { get; set; }
        public string TelefonoCliente { get; set; }
        public string EstadoSolicitud { get; set; }
        public string Estado { get; set; }
        public DateTime FechaAdicion { get; set; }
    }
}
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using MegaHits506.Models;

namespace MegaHits506.AccesoDatos
{
    public class ACEventos
    {
        private readonly string _connectionString =
            ConfigurationManager.ConnectionStrings["MegaHitsDB"].ConnectionString;

        // LISTAR
        public List<Evento> Listar()
        {
            List<Evento> lista = new List<Evento>();

            using (SqlConnection con = new SqlConnection(_connectionString))
            {
                SqlCommand cmd = new SqlCommand("sp_list_eventos", con);
                cmd.CommandType = CommandType.StoredProcedure;

                con.Open();
                SqlDataReader dr = cmd.ExecuteReader();

                while (dr.Read())
                {
                    lista.Add(new Evento
                    {
                        Identificador = Convert.ToInt32(dr["ev_identificador"]),
                        Titulo = dr["ev_titulo"].ToString(),
                        Descripcion = dr["ev_descripcion"].ToString(),
                        FechaEvento = dr["ev_fecha_evento"] == DBNull.Value ? (DateTime?)null : Convert.ToDateTime(dr["ev_fecha_evento"]),
                        Ubicacion = dr["ev_ubicacion"].ToString(),
                        ImagenPortada = dr["ev_imagen_portada"].ToString(),
                        Estado = dr["ev_estado"].ToString()
                    });
                }
            }

            return lista;
        }

        // OBTENER POR ID
        public Evento Obtener(int id)
        {
            Evento evento = null;

            using (SqlConnection con = new SqlConnection(_connectionString))
            {
                SqlCommand cmd = new SqlCommand("sp_get_eventos", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@Identificador", id);

                con.Open();
                SqlDataReader dr = cmd.ExecuteReader();

                if (dr.Read())
                {
                    evento = new Evento
                    {
                        Identificador = Convert.ToInt32(dr["ev_identificador"]),
                        Titulo = dr["ev_titulo"].ToString(),
                        Descripcion = dr["ev_descripcion"].ToString(),
                        FechaEvento = dr["ev_fecha_evento"] == DBNull.Value ? (DateTime?)null : Convert.ToDateTime(dr["ev_fecha_evento"]),
                        Ubicacion = dr["ev_ubicacion"].ToString(),
                        ImagenPortada = dr["ev_imagen_portada"].ToString(),
                        Estado = dr["ev_estado"].ToString()
                    };
                }
            }

            return evento;
        }

        // INSERTAR
        public void Insertar(Evento e, string adicionadoPor)
        {
            using (SqlConnection con = new SqlConnection(_connectionString))
            {
                SqlCommand cmd = new SqlCommand("sp_insert_eventos", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@Titulo", e.Titulo);
                cmd.Parameters.AddWithValue("@Descripcion", e.Descripcion ?? "");
                cmd.Parameters.AddWithValue("@FechaEvento", e.FechaEvento.HasValue ? (object)e.FechaEvento.Value : DBNull.Value);
                cmd.Parameters.AddWithValue("@Ubicacion", e.Ubicacion ?? "");
                cmd.Parameters.AddWithValue("@ImagenPortada", e.ImagenPortada ?? "");
                cmd.Parameters.AddWithValue("@AdicionadoPor", adicionadoPor);

                con.Open();
                cmd.ExecuteNonQuery();
            }
        }

        // ACTUALIZAR
        public void Actualizar(Evento e, string modificadoPor)
        {
            using (SqlConnection con = new SqlConnection(_connectionString))
            {
                SqlCommand cmd = new SqlCommand("sp_update_eventos", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@Identificador", e.Identificador);
                cmd.Parameters.AddWithValue("@Titulo", e.Titulo);
                cmd.Parameters.AddWithValue("@Descripcion", e.Descripcion ?? "");
                cmd.Parameters.AddWithValue("@FechaEvento", e.FechaEvento.HasValue ? (object)e.FechaEvento.Value : DBNull.Value);
                cmd.Parameters.AddWithValue("@Ubicacion", e.Ubicacion ?? "");
                cmd.Parameters.AddWithValue("@ImagenPortada", e.ImagenPortada ?? "");
                cmd.Parameters.AddWithValue("@ModificadoPor", modificadoPor);

                con.Open();
                cmd.ExecuteNonQuery();
            }
        }

        // ELIMINAR (inactiva)
        public void Eliminar(int id, string modificadoPor)
        {
            using (SqlConnection con = new SqlConnection(_connectionString))
            {
                SqlCommand cmd = new SqlCommand("sp_delete_eventos", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@Identificador", id);
                cmd.Parameters.AddWithValue("@ModificadoPor", modificadoPor);

                con.Open();
                cmd.ExecuteNonQuery();
            }
        }
    }
}
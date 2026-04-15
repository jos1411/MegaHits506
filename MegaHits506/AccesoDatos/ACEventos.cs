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
            try
            {
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
            }
            catch (Exception ex)
            {
                throw new Exception("Error al listar eventos: " + ex.Message);
            }
            return lista;
        }

        // OBTENER POR ID
        public Evento Obtener(int id)
        {
            Evento evento = null;
            try
            {
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
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener evento: " + ex.Message);
            }
            return evento;
        }

        // INSERTAR
        public string Insertar(Evento e, string adicionadoPor)
        {
            try
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
                return null;
            }
            catch (Exception ex)
            {
                return "Error al registrar evento: " + ex.Message;
            }
        }

        // ACTUALIZAR
        public string Actualizar(Evento e, string modificadoPor)
        {
            try
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
                return null;
            }
            catch (Exception ex)
            {
                return "Error al actualizar evento: " + ex.Message;
            }
        }

        // ELIMINAR
        public string Eliminar(int id, string modificadoPor)
        {
            try
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
                return null;
            }
            catch (Exception ex)
            {
                return "Error al eliminar evento: " + ex.Message;
            }
        }
    }
}
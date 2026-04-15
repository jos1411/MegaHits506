using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using MegaHits506.Models;

namespace MegaHits506.AccesoDatos
{
    public class ACGaleria
    {
        private readonly string _connectionString =
            ConfigurationManager.ConnectionStrings["MegaHitsDB"].ConnectionString;

        // LISTAR
        public List<Galeria> Listar()
        {
            List<Galeria> lista = new List<Galeria>();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionString))
                {
                    SqlCommand cmd = new SqlCommand("sp_list_galeria", con);
                    cmd.CommandType = CommandType.StoredProcedure;

                    con.Open();
                    SqlDataReader dr = cmd.ExecuteReader();

                    while (dr.Read())
                    {
                        lista.Add(new Galeria
                        {
                            Identificador = Convert.ToInt32(dr["ga_identificador"]),
                            EvIdentificador = Convert.ToInt32(dr["ga_ev_identificador"]),
                            Evento = dr["ga_evento"].ToString(),
                            Tipo = dr["ga_tipo"].ToString(),
                            Url = dr["ga_url"].ToString(),
                            Descripcion = dr["ga_descripcion"].ToString(),
                            Estado = dr["ga_estado"].ToString()
                        });
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Error al listar galería: " + ex.Message);
            }
            return lista;
        }

        // OBTENER POR ID
        public Galeria Obtener(int id)
        {
            Galeria galeria = null;
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionString))
                {
                    SqlCommand cmd = new SqlCommand("sp_get_galeria", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@Identificador", id);

                    con.Open();
                    SqlDataReader dr = cmd.ExecuteReader();

                    if (dr.Read())
                    {
                        galeria = new Galeria
                        {
                            Identificador = Convert.ToInt32(dr["ga_identificador"]),
                            EvIdentificador = Convert.ToInt32(dr["ga_ev_identificador"]),
                            Evento = dr["ga_evento"].ToString(),
                            Tipo = dr["ga_tipo"].ToString(),
                            Url = dr["ga_url"].ToString(),
                            Descripcion = dr["ga_descripcion"].ToString(),
                            Estado = dr["ga_estado"].ToString()
                        };
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener elemento: " + ex.Message);
            }
            return galeria;
        }

        // INSERTAR
        public string Insertar(Galeria g, string adicionadoPor)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionString))
                {
                    SqlCommand cmd = new SqlCommand("sp_insert_galeria", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@EvIdentificador", g.EvIdentificador);
                    cmd.Parameters.AddWithValue("@Tipo", g.Tipo);
                    cmd.Parameters.AddWithValue("@Url", g.Url);
                    cmd.Parameters.AddWithValue("@Descripcion", g.Descripcion ?? "");
                    cmd.Parameters.AddWithValue("@AdicionadoPor", adicionadoPor);

                    con.Open();
                    cmd.ExecuteNonQuery();
                }
                return null;
            }
            catch (Exception ex)
            {
                return "Error al agregar elemento: " + ex.Message;
            }
        }

        // ACTUALIZAR
        public string Actualizar(Galeria g, string modificadoPor)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionString))
                {
                    SqlCommand cmd = new SqlCommand("sp_update_galeria", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@Identificador", g.Identificador);
                    cmd.Parameters.AddWithValue("@Tipo", g.Tipo);
                    cmd.Parameters.AddWithValue("@Url", g.Url);
                    cmd.Parameters.AddWithValue("@Descripcion", g.Descripcion ?? "");
                    cmd.Parameters.AddWithValue("@ModificadoPor", modificadoPor);

                    con.Open();
                    cmd.ExecuteNonQuery();
                }
                return null;
            }
            catch (Exception ex)
            {
                return "Error al actualizar elemento: " + ex.Message;
            }
        }

        // ELIMINAR
        public string Eliminar(int id, string modificadoPor)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionString))
                {
                    SqlCommand cmd = new SqlCommand("sp_delete_galeria", con);
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
                return "Error al eliminar elemento: " + ex.Message;
            }
        }

        // LISTAR EVENTOS ACTIVOS (para dropdown)
        public List<Evento> ListarEventos()
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
                            Titulo = dr["ev_titulo"].ToString()
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

        // LISTAR GALERÍA DE UN EVENTO ESPECÍFICO (vista pública)
        public List<Galeria> ListarPorEvento(int evId)
        {
            List<Galeria> lista = new List<Galeria>();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionString))
                {
                    SqlCommand cmd = new SqlCommand("sp_list_galeria_por_evento", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@EvIdentificador", evId);

                    con.Open();
                    SqlDataReader dr = cmd.ExecuteReader();

                    while (dr.Read())
                    {
                        lista.Add(new Galeria
                        {
                            Identificador = Convert.ToInt32(dr["ga_identificador"]),
                            Tipo = dr["ga_tipo"].ToString(),
                            Url = dr["ga_url"].ToString(),
                            Descripcion = dr["ga_descripcion"].ToString()
                        });
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Error al listar galería del evento: " + ex.Message);
            }
            return lista;
        }
    }
}
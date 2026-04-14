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

            return lista;
        }

        // OBTENER POR ID
        public Galeria Obtener(int id)
        {
            Galeria galeria = null;

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

            return galeria;
        }

        // INSERTAR
        public void Insertar(Galeria g, string adicionadoPor)
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
        }

        // ACTUALIZAR
        public void Actualizar(Galeria g, string modificadoPor)
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
        }

        // ELIMINAR (inactiva)
        public void Eliminar(int id, string modificadoPor)
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
        }

        // LISTAR EVENTOS ACTIVOS (para dropdown al crear/editar)
        public List<Evento> ListarEventos()
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
                        Titulo = dr["ev_titulo"].ToString()
                    });
                }
            }

            return lista;
        }

        // LISTAR GALERÍA DE UN EVENTO ESPECÍFICO (vista pública de detalle)
        public List<Galeria> ListarPorEvento(int evId)
        {
            List<Galeria> lista = new List<Galeria>();

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

            return lista;
        }
    }
}
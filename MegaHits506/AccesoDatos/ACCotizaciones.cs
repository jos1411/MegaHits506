using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using MegaHits506.Models;

namespace MegaHits506.AccesoDatos
{
    public class ACCotizaciones
    {
        private readonly string _connectionString =
            ConfigurationManager.ConnectionStrings["MegaHitsDB"].ConnectionString;

        // LISTAR TODAS (admin)
        public List<Cotizacion> Listar()
        {
            List<Cotizacion> lista = new List<Cotizacion>();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionString))
                {
                    SqlCommand cmd = new SqlCommand("sp_list_cotizaciones", con);
                    cmd.CommandType = CommandType.StoredProcedure;

                    con.Open();
                    SqlDataReader dr = cmd.ExecuteReader();

                    while (dr.Read())
                    {
                        lista.Add(new Cotizacion
                        {
                            Identificador = Convert.ToInt32(dr["ct_identificador"]),
                            Cliente = dr["ct_cliente"].ToString(),
                            Correo = dr["ct_correo"].ToString(),
                            FechaEventoDeseada = Convert.ToDateTime(dr["ct_fecha_evento_deseada"]),
                            TipoEvento = dr["ct_tipo_evento"].ToString(),
                            Detalles = dr["ct_detalles"].ToString(),
                            TelefonoCliente = dr["ct_telefono_cliente"].ToString(),
                            EstadoSolicitud = dr["ct_estado_solicitud"].ToString(),
                            Estado = dr["ct_estado"].ToString(),
                            FechaAdicion = Convert.ToDateTime(dr["ct_fecha_adicion"])
                        });
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Error al listar cotizaciones: " + ex.Message);
            }
            return lista;
        }

        // LISTAR POR USUARIO (cliente)
        public List<Cotizacion> ListarPorUsuario(int usId)
        {
            List<Cotizacion> lista = new List<Cotizacion>();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionString))
                {
                    SqlCommand cmd = new SqlCommand("sp_list_cotizaciones_por_usuario", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@UsIdentificador", usId);

                    con.Open();
                    SqlDataReader dr = cmd.ExecuteReader();

                    while (dr.Read())
                    {
                        lista.Add(new Cotizacion
                        {
                            Identificador = Convert.ToInt32(dr["ct_identificador"]),
                            FechaEventoDeseada = Convert.ToDateTime(dr["ct_fecha_evento_deseada"]),
                            TipoEvento = dr["ct_tipo_evento"].ToString(),
                            Detalles = dr["ct_detalles"].ToString(),
                            TelefonoCliente = dr["ct_telefono_cliente"].ToString(),
                            EstadoSolicitud = dr["ct_estado_solicitud"].ToString(),
                            FechaAdicion = Convert.ToDateTime(dr["ct_fecha_adicion"])
                        });
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Error al listar solicitudes: " + ex.Message);
            }
            return lista;
        }

        // OBTENER POR ID
        public Cotizacion Obtener(int id)
        {
            Cotizacion cotizacion = null;
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionString))
                {
                    SqlCommand cmd = new SqlCommand("sp_get_cotizaciones", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@Identificador", id);

                    con.Open();
                    SqlDataReader dr = cmd.ExecuteReader();

                    if (dr.Read())
                    {
                        cotizacion = new Cotizacion
                        {
                            Identificador = Convert.ToInt32(dr["ct_identificador"]),
                            UsIdentificador = Convert.ToInt32(dr["ct_us_identificador"]),
                            Cliente = dr["ct_cliente"].ToString(),
                            Correo = dr["ct_correo"].ToString(),
                            FechaEventoDeseada = Convert.ToDateTime(dr["ct_fecha_evento_deseada"]),
                            TipoEvento = dr["ct_tipo_evento"].ToString(),
                            Detalles = dr["ct_detalles"].ToString(),
                            TelefonoCliente = dr["ct_telefono_cliente"].ToString(),
                            EstadoSolicitud = dr["ct_estado_solicitud"].ToString(),
                            Estado = dr["ct_estado"].ToString()
                        };
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener cotización: " + ex.Message);
            }
            return cotizacion;
        }

        // INSERTAR
        public string Insertar(Cotizacion c, string adicionadoPor)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionString))
                {
                    SqlCommand cmd = new SqlCommand("sp_insert_cotizaciones", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@UsIdentificador", c.UsIdentificador);
                    cmd.Parameters.AddWithValue("@FechaEventoDeseada", c.FechaEventoDeseada);
                    cmd.Parameters.AddWithValue("@TipoEvento", c.TipoEvento ?? "");
                    cmd.Parameters.AddWithValue("@Detalles", c.Detalles ?? "");
                    cmd.Parameters.AddWithValue("@TelefonoCliente", c.TelefonoCliente ?? "");
                    cmd.Parameters.AddWithValue("@AdicionadoPor", adicionadoPor);

                    con.Open();
                    cmd.ExecuteNonQuery();
                }
                return null;
            }
            catch (Exception ex)
            {
                return "Error al enviar solicitud: " + ex.Message;
            }
        }

        // CAMBIAR ESTADO
        public string CambiarEstado(int id, string estado, string modificadoPor)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionString))
                {
                    SqlCommand cmd = new SqlCommand("sp_update_estado_cotizaciones", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@Identificador", id);
                    cmd.Parameters.AddWithValue("@EstadoSolicitud", estado);
                    cmd.Parameters.AddWithValue("@ModificadoPor", modificadoPor);

                    con.Open();
                    cmd.ExecuteNonQuery();
                }
                return null;
            }
            catch (Exception ex)
            {
                return "Error al cambiar estado: " + ex.Message;
            }
        }

        // ELIMINAR
        public string Eliminar(int id, string modificadoPor)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionString))
                {
                    SqlCommand cmd = new SqlCommand("sp_delete_cotizaciones", con);
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
                return "Error al eliminar solicitud: " + ex.Message;
            }
        }
    }
}
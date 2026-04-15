using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using MegaHits506.Models;

namespace MegaHits506.AccesoDatos
{
    public class ACUsuarios
    {
        private readonly string _connectionString =
            ConfigurationManager.ConnectionStrings["MegaHitsDB"].ConnectionString;

        // LOGIN
        public Usuario Login(string correo, string clave)
        {
            Usuario usuario = null;
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionString))
                {
                    SqlCommand cmd = new SqlCommand("sp_login_usuarios", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@Correo", correo);
                    cmd.Parameters.AddWithValue("@Clave", clave);

                    con.Open();
                    SqlDataReader dr = cmd.ExecuteReader();

                    if (dr.Read())
                    {
                        usuario = new Usuario
                        {
                            Identificador = Convert.ToInt32(dr["us_identificador"]),
                            NombreCompleto = dr["us_nombre_completo"].ToString(),
                            Correo = dr["us_correo"].ToString(),
                            Estado = dr["us_estado"].ToString(),
                            RoIdentificador = Convert.ToInt32(dr["us_ro_identificador"]),
                            Rol = dr["us_rol"].ToString()
                        };
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Error al iniciar sesión: " + ex.Message);
            }
            return usuario;
        }

        // LISTAR
        public List<Usuario> Listar()
        {
            List<Usuario> lista = new List<Usuario>();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionString))
                {
                    SqlCommand cmd = new SqlCommand("sp_list_usuarios", con);
                    cmd.CommandType = CommandType.StoredProcedure;

                    con.Open();
                    SqlDataReader dr = cmd.ExecuteReader();

                    while (dr.Read())
                    {
                        lista.Add(new Usuario
                        {
                            Identificador = Convert.ToInt32(dr["us_identificador"]),
                            Cedula = dr["us_cedula"].ToString(),
                            Correo = dr["us_correo"].ToString(),
                            NombreCompleto = dr["us_nombre_completo"].ToString(),
                            Estado = dr["us_estado"].ToString(),
                            Rol = dr["us_rol"].ToString()
                        });
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Error al listar usuarios: " + ex.Message);
            }
            return lista;
        }

        // OBTENER POR ID
        public Usuario Obtener(int id)
        {
            Usuario usuario = null;
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionString))
                {
                    SqlCommand cmd = new SqlCommand("sp_get_usuarios", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@Identificador", id);

                    con.Open();
                    SqlDataReader dr = cmd.ExecuteReader();

                    if (dr.Read())
                    {
                        usuario = new Usuario
                        {
                            Identificador = Convert.ToInt32(dr["us_identificador"]),
                            Cedula = dr["us_cedula"].ToString(),
                            Correo = dr["us_correo"].ToString(),
                            NombreCompleto = dr["us_nombre_completo"].ToString(),
                            Estado = dr["us_estado"].ToString(),
                            RoIdentificador = Convert.ToInt32(dr["us_ro_identificador"]),
                            Rol = dr["us_rol"].ToString()
                        };
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener usuario: " + ex.Message);
            }
            return usuario;
        }

        // INSERTAR — retorna string con error o null si fue exitoso
        public string Insertar(Usuario u, string adicionadoPor)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionString))
                {
                    SqlCommand cmd = new SqlCommand("sp_insert_usuarios", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@Cedula", u.Cedula ?? "");
                    cmd.Parameters.AddWithValue("@Correo", u.Correo);
                    cmd.Parameters.AddWithValue("@Clave", u.Clave);
                    cmd.Parameters.AddWithValue("@NombreCompleto", u.NombreCompleto);
                    cmd.Parameters.AddWithValue("@RoIdentificador", u.RoIdentificador);
                    cmd.Parameters.AddWithValue("@AdicionadoPor", adicionadoPor);

                    con.Open();
                    cmd.ExecuteNonQuery();
                }
                return null; // null = éxito
            }
            catch (SqlException ex)
            {
                // Error 2627 = violación de UNIQUE (correo duplicado)
                if (ex.Number == 2627)
                    return "El correo electrónico ya está registrado.";

                return "Error al registrar usuario: " + ex.Message;
            }
            catch (Exception ex)
            {
                return "Error inesperado: " + ex.Message;
            }
        }

        // ACTUALIZAR — retorna string con error o null si fue exitoso
        public string Actualizar(Usuario u, string modificadoPor)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionString))
                {
                    SqlCommand cmd = new SqlCommand("sp_update_usuarios", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@Identificador", u.Identificador);
                    cmd.Parameters.AddWithValue("@Cedula", u.Cedula ?? "");
                    cmd.Parameters.AddWithValue("@Correo", u.Correo);
                    cmd.Parameters.AddWithValue("@NombreCompleto", u.NombreCompleto);
                    cmd.Parameters.AddWithValue("@RoIdentificador", u.RoIdentificador);
                    cmd.Parameters.AddWithValue("@ModificadoPor", modificadoPor);

                    con.Open();
                    cmd.ExecuteNonQuery();
                }
                return null;
            }
            catch (SqlException ex)
            {
                if (ex.Number == 2627)
                    return "El correo electrónico ya está en uso por otro usuario.";

                return "Error al actualizar usuario: " + ex.Message;
            }
            catch (Exception ex)
            {
                return "Error inesperado: " + ex.Message;
            }
        }

        // ELIMINAR
        public string Eliminar(int id, string modificadoPor)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionString))
                {
                    SqlCommand cmd = new SqlCommand("sp_delete_usuarios", con);
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
                return "Error al inactivar usuario: " + ex.Message;
            }
        }
    }
}
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

            return usuario;
        }

        // LISTAR
        public List<Usuario> Listar()
        {
            List<Usuario> lista = new List<Usuario>();

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

            return lista;
        }

        // OBTENER POR ID
        public Usuario Obtener(int id)
        {
            Usuario usuario = null;

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

            return usuario;
        }

        // INSERTAR
        public void Insertar(Usuario u, string adicionadoPor)
        {
            using (SqlConnection con = new SqlConnection(_connectionString))
            {
                SqlCommand cmd = new SqlCommand("sp_insert_usuarios", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@Cedula", u.Cedula);
                cmd.Parameters.AddWithValue("@Correo", u.Correo);
                cmd.Parameters.AddWithValue("@Clave", u.Clave);
                cmd.Parameters.AddWithValue("@NombreCompleto", u.NombreCompleto);
                cmd.Parameters.AddWithValue("@RoIdentificador", u.RoIdentificador);
                cmd.Parameters.AddWithValue("@AdicionadoPor", adicionadoPor);

                con.Open();
                cmd.ExecuteNonQuery();
            }
        }

        // ACTUALIZAR
        public void Actualizar(Usuario u, string modificadoPor)
        {
            using (SqlConnection con = new SqlConnection(_connectionString))
            {
                SqlCommand cmd = new SqlCommand("sp_update_usuarios", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@Identificador", u.Identificador);
                cmd.Parameters.AddWithValue("@Cedula", u.Cedula);
                cmd.Parameters.AddWithValue("@Correo", u.Correo);
                cmd.Parameters.AddWithValue("@NombreCompleto", u.NombreCompleto);
                cmd.Parameters.AddWithValue("@RoIdentificador", u.RoIdentificador);
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
                SqlCommand cmd = new SqlCommand("sp_delete_usuarios", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@Identificador", id);
                cmd.Parameters.AddWithValue("@ModificadoPor", modificadoPor);

                con.Open();
                cmd.ExecuteNonQuery();
            }
        }
    }
}
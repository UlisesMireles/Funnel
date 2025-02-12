using Funnel.Data.Interfaces;
using Funnel.Models;
using Funnel.Models.Base;
using Funnnel.Logic.Interfaces;
using Funnnel.Logic.Utils;
using Microsoft.IdentityModel.Tokens;
using System.Security.Cryptography;
using System.Text;

namespace Funnnel.Logic
{
    public class LoginService : ILoginService
    {
        private readonly ILoginData _loginData;
        private readonly IEmail _email;
        public LoginService(ILoginData loginData, IEmail email)
        {
            _loginData = loginData;
            _email = email;
        }
        public async Task<UsuarioLogin> Autenticar(string user, string contrasena)
        {
            if (!string.IsNullOrEmpty(contrasena))
                contrasena = Encriptar(contrasena);
            var respuesta = await _loginData.Autenticar(user, contrasena);
            return respuesta;
        }

        public async Task<BaseOut> ObtenerVersion()
        {
            return await _loginData.ObtenerVersion();
        }

        public async Task<BaseOut> ResetPassword(string usuario)
        {
            var datosUsuario = new UsuarioReset();
            var respuesta = new BaseOut();
            datosUsuario = await _loginData.ValidarUsuario(usuario);
            if (datosUsuario.IdAdministrador == 0)
            {
                respuesta.Result = false;
                respuesta.ErrorMessage = "El Usuario " + usuario + " no existe";
            }
            else
            {
                var cuerpoCorreo = await _loginData.ObtenerCuerpoCorreoReset(usuario);
                if (!cuerpoCorreo.IsNullOrEmpty())
                {
                    string passDesEncrypt = Desencriptar(datosUsuario.Clave);
                    cuerpoCorreo = cuerpoCorreo.Replace("{Contraseña}", passDesEncrypt);
                    var correo = _email.EnviarCorreo(datosUsuario.Correo, "Recuperación de contraseña Sistema Funnel  SFS", cuerpoCorreo);
                    if (correo.Result)
                    {
                        respuesta.Result = correo.Result;
                        respuesta.ErrorMessage = "Se ha enviado tu contraseña al correo <b>" + datosUsuario.Correo.Substring(0, 6) + "...</b>";
                    } 
                    else
                    {
                        respuesta.Result = correo.Result;
                        respuesta.ErrorMessage = correo.ErrorMessage;
                    }     
                }
            }
            return respuesta;
        }

        public static string Encriptar(string texto)
        {
            try
            {
                string key = "2911&E"; //llave para encriptar datos
                byte[] keyArray;
                byte[] Arreglo_a_Cifrar = UTF8Encoding.UTF8.GetBytes(texto);
                //Se utilizan las clases de encriptación MD5
                MD5CryptoServiceProvider hashmd5 = new MD5CryptoServiceProvider();
                keyArray = hashmd5.ComputeHash(UTF8Encoding.UTF8.GetBytes(key));
                hashmd5.Clear();
                //Algoritmo TripleDES
                TripleDESCryptoServiceProvider tdes = new TripleDESCryptoServiceProvider();
                tdes.Key = keyArray;
                tdes.Mode = CipherMode.ECB;
                tdes.Padding = PaddingMode.PKCS7;
                ICryptoTransform cTransform = tdes.CreateEncryptor();
                byte[] ArrayResultado = cTransform.TransformFinalBlock(Arreglo_a_Cifrar, 0, Arreglo_a_Cifrar.Length);
                tdes.Clear();
                //se regresa el resultado en forma de una cadena
                texto = Convert.ToBase64String(ArrayResultado, 0, ArrayResultado.Length);
            }
            catch (Exception)
            {

            }
            return texto;
        }

        public static string Desencriptar(string textoEncriptado)
        {
            try
            {
                string key = "2911&E";
                byte[] keyArray;
                byte[] Array_a_Descifrar = Convert.FromBase64String(textoEncriptado);
                //algoritmo MD5
                MD5CryptoServiceProvider hashmd5 = new MD5CryptoServiceProvider();
                keyArray = hashmd5.ComputeHash(UTF8Encoding.UTF8.GetBytes(key));
                hashmd5.Clear();
                TripleDESCryptoServiceProvider tdes = new TripleDESCryptoServiceProvider();
                tdes.Key = keyArray;
                tdes.Mode = CipherMode.ECB;
                tdes.Padding = PaddingMode.PKCS7;
                ICryptoTransform cTransform = tdes.CreateDecryptor();
                byte[] resultArray = cTransform.TransformFinalBlock(Array_a_Descifrar, 0, Array_a_Descifrar.Length);
                tdes.Clear();
                textoEncriptado = UTF8Encoding.UTF8.GetString(resultArray);
            }
            catch (Exception ex)
            {

            }
            return textoEncriptado;
        }
    }
}

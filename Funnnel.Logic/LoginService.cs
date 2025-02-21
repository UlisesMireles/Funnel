using Funnel.Data.Interfaces;
using Funnel.Models;
using Funnel.Models.Base;
using Funnnel.Logic.Interfaces;
using Funnnel.Logic.Utils;
using Microsoft.IdentityModel.Tokens;

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
                contrasena = Encrypt.Encriptar(contrasena);
            var respuesta = await _loginData.Autenticar(user, contrasena);
            return respuesta;
        }

        public async Task<TwoFactor> TwoFactor(UsuarioDosPasos usuario)
        {
            return await _loginData.TwoFactor(usuario);
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
                    string passDesEncrypt = Encrypt.Desencriptar(datosUsuario.Clave);
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
    }
}

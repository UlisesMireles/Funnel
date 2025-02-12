using Funnel.Models.Base;
using Funnnel.Logic.Interfaces;
using Microsoft.Extensions.Configuration;
using System.Net;
using System.Net.Mail;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Funnnel.Logic.Utils
{
    public class Email : IEmail
    {
        public IConfiguration _configuration { get; }
        private readonly string _txtremitente;
        private readonly string _smtp;
        private readonly string _port;
        private readonly string _passremitente;

        public Email(IConfiguration configuration) 
        {
            _configuration = configuration;
            _txtremitente = configuration["EmailServer:usuarioSMTP"];
            _smtp = configuration["EmailServer:ServidorSMTP"];
            _port = configuration["EmailServer:PuertoSMTP"];
            _passremitente = configuration["EmailServer:pwdSMTP"];
        }

        public BaseOut EnviarCorreo(string sTo, string sAsunto, string sMensaje)
        {
            BaseOut result = new BaseOut();
            result.Result = false;
            result.ErrorMessage = string.Empty;
            try
            {
                string[] sDestinatarios = sTo.Split(';');
                MailMessage msg = new MailMessage();
                if (sTo.IndexOf(';') >= 0)
                {
                    for (int i = 0; i < sDestinatarios.Length; i++)
                        msg.To.Add(new MailAddress(sDestinatarios[i]));
                }
                else
                {
                    msg.To.Add(new MailAddress(sTo));
                }
                msg.From = new MailAddress(_txtremitente);

                msg.Subject = sAsunto;
                msg.Priority = MailPriority.Normal;
                msg.Body = sMensaje;
                msg.IsBodyHtml = true;

                SmtpClient clienteSmtp = new SmtpClient(_smtp);
                clienteSmtp.Host = _smtp;
                clienteSmtp.Port = int.Parse(_port);
                clienteSmtp.EnableSsl = true;
                clienteSmtp.DeliveryMethod = SmtpDeliveryMethod.Network;
                clienteSmtp.Credentials = new NetworkCredential(_txtremitente, _passremitente);

                clienteSmtp.Send(msg);
                result.Result = true;
            }
            catch (Exception ex)
            {
                result.Result = false;
                result.ErrorMessage = "Error al enviar el correo a " + sTo + " " + ex.Message;
            }
            return result;
        }
    }
}

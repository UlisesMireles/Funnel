using Funnel.Data;
using Funnel.Data.Interfaces;
using Funnel.Models;
using Funnnel.Logic.Interfaces;

namespace Funnnel.Logic
{
    public class LoginService : ILoginService
    {
        private readonly ILoginData _loginData;
        public LoginService(ILoginData loginData)
        {
            _loginData = loginData;
        }
        public async Task<List<Prueba>> Prueba()
        {
            return await _loginData.Prueba();
        }
    }
}

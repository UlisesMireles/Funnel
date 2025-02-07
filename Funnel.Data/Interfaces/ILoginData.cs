using Funnel.Models;

namespace Funnel.Data.Interfaces
{
    public interface ILoginData
    {
        public Task<List<Prueba>> Prueba();
    }
}

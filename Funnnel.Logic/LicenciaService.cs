using Funnel.Data.Interfaces;
using Funnel.Models;
using Funnel.Models.Base;
using Funnnel.Logic.Interfaces;

namespace Funnnel.Logic
{
    public class LicenciaService : ILicenciaService
    {
        private readonly ILicenciaData _licenciaData;
        public LicenciaService( ILicenciaData licenciaData)
        {
            _licenciaData = licenciaData;
        }
        public async Task<BaseOut> INS_UPD_Licencia(INS_UPD_Licencia request)
        {
            return await _licenciaData.INS_UPD_Licencia(request);
        }
        public async Task<List<SEL_Licencias>> SEL_Licencias()
        {
            return await _licenciaData.SEL_Licencias();
        }

    }
}

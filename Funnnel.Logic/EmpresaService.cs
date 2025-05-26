using Funnel.Data.Interfaces;
using Funnel.Models;
using Funnel.Models.Base;
using Funnel.Models.Dto;
using Funnnel.Logic.Interfaces;
using Microsoft.AspNetCore.Http;

namespace Funnnel.Logic
{
    public class EmpresaService : IEmpresaService
    {
        private readonly IEmpresaData _EmpresaData;
        public EmpresaService(IEmpresaData EmpresaData)
        {
            _EmpresaData = EmpresaData;
        }
        public async Task<BaseOut> GuardarEmpresa(GuardarEmpresaDto request)
        {
            return await _EmpresaData.GuardarEmpresa(request);
        }
        public async Task<List<EmpresasDto>> ConsultarEmpresas()
        {
            return await _EmpresaData.ConsultarEmpresas();
        }
        public async Task<List<AdminsEmpresaDto>> ConsultaAdminsEmpresas()
        {
            return await _EmpresaData.ConsultaAdminsEmpresas();
        }
        public async Task<List<ComboLicenciasDto>> ComboLicencias()
        {
            return await _EmpresaData.ComboLicencias();
        }
        public Task<BaseOut> GuardarImagenEmpresa(List<IFormFile> imagen, GuardarEmpresaDto request)
        {
            return _EmpresaData.GuardarImagenEmpresa(imagen, request);
        }
        public async Task<BaseOut> ObtenerImagenEmpresa(int IdEmpresa)
        {
            return await _EmpresaData.ObtenerImagenEmpresa(IdEmpresa);
        }
    }
}

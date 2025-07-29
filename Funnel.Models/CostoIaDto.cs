namespace Funnel.Models
{

    public class CostoIaDto
    {
        public int IdEmpresa { get; set; }
        public string NombreEmpresa { get; set; }
        public decimal CostoTotalL { get; set; }
        public int TokenEntrada { get; set; }
        public int TokenSalida { get; set; }
        public  DateTime FechaPregunta { get; set; }
    }
}

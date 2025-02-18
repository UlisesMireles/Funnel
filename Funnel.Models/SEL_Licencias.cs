namespace Funnel.Models
{
    //Llena el dropdown de la parte licencias
    public class Catalog_Licencias
    {
        public int IdLicencia{ get; set; }
        public string? NombreLicencia{ get; set; }
    }
    //Llena la tabla de la parte licencias
    public class  SEL_Licencias
    {
        public int IdLicencia { get; set; }
        public string NombreLicencia { get; set; }
        public int CantidadUsuarios{ get; set; }
        public int CantidadOportunidades{ get; set; }
        public int Activo { get; set; }
    }
}

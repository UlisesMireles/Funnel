export interface Empresa {
  IdEmpresa: number;
  NombreEmpresa?: string; // ? indica que el campo es opcional
  Alias?: string;
  RFC?: string;
  VInicio: Date;
  VTerminacion: Date;
  IdLicencia: number;
  NombreLicencia?: string;
  CantidadUsuarios: number;
  CantidadOportunidades: number;
  Administrador?: string;
  IdAdministrador: number;
  Nombre?: string;
  ApellidoPaterno?: string;
  ApellidoMaterno?: string;
  UsuarioAdministrador?: string;
  CorreoAdministrador?: string;
  UserReal: number;
  OportEmp: number;
  OportAct: number;
  UrlSitio?: string;
  Activo: number;
  UsuarioCreador: number;
}

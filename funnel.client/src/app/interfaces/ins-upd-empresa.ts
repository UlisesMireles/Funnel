export interface INSUPDEmpresa {
  bandera: string;
  idEmpresa: number;
  nombreEmpresa: string |undefined;
  idAdministrador: number;
  idLicencia: number;
  alias: string|undefined;
  rfc: string|undefined;
  vInicio: Date;
  vTerminacion: Date;
  usuarioCreador: number;
  nombre: string|undefined;
  apellidoPaterno: string | undefined;
  apellidoMaterno: string | undefined;
  iniciales: string | undefined;
  correo: string | undefined;
  usuario: string | undefined;
  urlSitio: string | undefined;
  activo: number | undefined;
}

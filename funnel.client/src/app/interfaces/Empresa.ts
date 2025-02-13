// Se utiliza para la insertar o actualizar empresa
export interface requestEmpresa {
  bandera: string;
  idEmpresa: number;
  nombreEmpresa: string | undefined;
  idAdministrador: number;
  idLicencia: number;
  alias: string | undefined;
  rfc: string | undefined;
  vInicio: Date;
  vTerminacion: Date;
  usuarioCreador: number;
  nombre: string | undefined;
  apellidoPaterno: string | undefined;
  apellidoMaterno: string | undefined;
  iniciales: string | undefined;
  correo: string | undefined;
  usuario: string | undefined;
  urlSitio: string | undefined;
  activo: number | undefined;
}

// Se utiliza para la llenar la tabla en la vista
export interface dataEmpresa {
  idEmpresa: number;
  nombreEmpresa?: string;
  alias?: string;
  rfc?: string;
  vInicio: Date;
  vTerminacion: Date;
  idLicencia: number;
  nombreLicencia?: string;
  cantidadUsuarios: number;
  cantidadOportunidades: number;
  administrador?: string;
  idAdministrador: number;
  nombre?: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  usuarioAdministrador?: string;
  correoAdministrador?: string;
  userReal: number;
  oportEmp: number;
  oportAct: number;
  urlSitio?: string;
  activo: number;
  usuarioCreador: number;
}

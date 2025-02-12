export interface Empresa {
  idEmpresa: number;
  nombreEmpresa?: string; // ? indica que el campo es opcional
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

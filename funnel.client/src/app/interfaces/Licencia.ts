import { requestEmpresa } from './Empresa';
// Dropdown perteneciente a empresas licencias
export interface dropdownLicencia {
  idLicencia: number;
  nombreLicencia?: string| undefined;
}
export interface requestLicencia{
    bandera: string| undefined;
    idLicencia: number;
    nombreLicencia: string | undefined;
    cantidadUsuarios: number;
    cantidadOportunidades: number;
    idUsuario:number;
}
export interface SEL_Licencia{
    idLicencia: number;
    nombreLicencia:string| undefined;
    cantidadUsuarios: number;
    cantidadOportunidades:number;
}

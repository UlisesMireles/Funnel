import { requestEmpresa } from './Empresa';
// Dropdown perteneciente a empresas licencias
export interface dropdownLicencia {
  idLicencia: number;
  nombreLicencia?: string;
}
export interface requestLicencia{
    bandera: string;
    idLicencia: number;
    nombreLicencia: string;
    cantidadUsuarios: number;
    cantidadOportunidades: number;
    idUsuario:number;
}
export interface SEL_Licencia{
    idLicencia: number;
    nombreLicencia:string;
    cantidadUsuarios: number;
    cantidadOportunidades:number;
}

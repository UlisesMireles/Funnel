export interface SEL_Sectores {
  idSector: number,
  nombreSector: string,
  descripcionSector:string,
  fechaCreacion:string,
  usuarioCreador:string,
  fechaModificacion:string,
  usuarioModifico:string,
  desEstatusActivo:string,
}
export interface SEL_Sectores_CMB{
  idSector: number,
  nombreSector: string,
  descripcionSector: string
}
export interface requestSector{
  bandera:string,
  idSector: number,
  nombreSector:string,
  descripcionSector:string,
  idUsuarioCreador:number,
  activo: number,
}

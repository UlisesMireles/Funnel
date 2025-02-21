export interface UsuarioData {
  usuario:string;
  pass:string;
}
// export interface TwoFactor{
//   codigo:number;
//   tipoMensaje:number;
// }
export interface TwoFactor{
  usuario:string;
  codigo:number| null;
}

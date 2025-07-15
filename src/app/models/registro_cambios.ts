export interface RegistroCambio {
  FechayHora: string; // formato ISO string
  NoTabla: number;
  NoCampo: number;
  ValorNuevo: string;
  SystemIdRegistro: string;
  SystemIdRegistroPrincipal: string;
  TipodeCambio: string; // usualmente sería '1'
  CodAgrupacionCambios: string;
}

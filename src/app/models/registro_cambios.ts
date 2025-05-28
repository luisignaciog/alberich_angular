export interface RegistroCambio {
  FechayHora: string; // formato ISO string
  NoTabla: number;
  NoCampo: number;
  ValorNuevo: string;
  SystemIdRegistro: string;
  TipodeCambio: string; // usualmente sería '1'
}

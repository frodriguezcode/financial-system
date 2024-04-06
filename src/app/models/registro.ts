export interface Registro {
    id?: string,
    Elemento?:string,
    idCategoria?: string,
    idFlujo?:string,
    Cuenta?: string,
    Valor?: string,
    idSocioNegocio ?:string, 
    FechaRegistro?: string,
    idEmpresa?:string
}


interface RegistroEditar {
    Elemento: string;
    Cuenta: string;
    Valor: number;
    idFlujo: number;
    NumMes?: number; // Optional property
    NumSemana?: number; // Optional property
    AnioRegistro?: number; // Optional property
    Semana?: string; // Optional property
    MesRegistro?: string; // Optional property
    Nuevo: boolean;
    Activo: boolean;
    Editando: boolean;
    idSocioNegocio?: number; // Optional property
    idEmpresa?: number; // Optional property
    idMatriz?: number; // Optional property
    idCategoria?: number; // Optional property
    idSucursal: number;
    FechaRegistro?: Date; // Optional property
    id?: number; // Optional property
  }
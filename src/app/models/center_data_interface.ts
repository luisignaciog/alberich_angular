export interface CompanyData {
  "@odata.context": string;
  "@odata.etag": string;
  SystemId: "b4e1af38-b421-f011-add3-00155d037f01",
  No: string;
  Name: string;
  Name2: string;
  Address: string;
  Address2: string;
  City: string;
  PhoneNo: string;
  CountryRegionCode: string;
  VATRegistrationNo: string;
  PostCode: string;
  County: string;
  Email: string;
  MobilePhoneNo: string;
  CodTransportista: string;
  NIMATransportista: string;
  CertificadoTitularidadBancariaPresentado: boolean;
  TarjetaNIFEmpresaPresentada: boolean;
  SystemModifiedAt: string;
  centrosempresasgreenbc: centers[];
  contactosempresasgreenbc: contacts[];
  cambiosempresasgreenbc: cambiosempresasgreenbc[];
  [key: string]: any; // <-- Esto permite indexar por string
}

export interface centers {
  "@odata.etag": string;
  NoEmpresaGreenBC: string;
  Code: string;
  Name: string;
  Name2: string;
  Address: string;
  Address2: string;
  City: string;
  PhoneNo: string;
  CountryRegionCode: string;
  PostCode: string;
  County: string;
  EMail: string;
  CodProductor: string;
  CodGestor: string;
  CodTransportista: string;
  EMailEnvioServicio: string;
  EMailEnvioDocAmbiental: string;
  SystemModifiedAt: string;
  SystemId: string;
}

export interface contacts {
  No: string;
  SystemId: string;
  Name: string;
  Name2: string;
  PhoneNo: string;
  EMail: string;
}

export interface cambiosempresasgreenbc {
  No_Mov: number;
  Fecha_y_Hora: string;
  No_Tabla: number;
  Titulo_de_Tabla: string;
  No_Campo: number;
  Titulo_de_Campo: string;
  Tipo_de_Cambio: string;
  Valor_Anterior: string;
  Valor_Nuevo: string;
  Clave_Primaria: string;
  Clave_Primaria_Campo_No_1: number;
  Titulo_Clave_Prim_Campo_No_1: string;
  Valor_Clave_Prim_Campo_No_1: string;
  Clave_Primaria_Campo_No_2: number;
  Titulo_Clave_Prim_Campo_No_2: string;
  Valor_Clave_Prim_Campo_No_2: string;
  Clave_Primaria_Campo_No_3: number;
  Titulo_Clave_Prim_Campo_No_3: string;
  Valor_Clave_Prim_Campo_No_3: string;
  Record_ID: string;
  SystemId_Registro: string;
  SystemId_Registro_Principal: string;
  Cod_Agrupacion_Cambios: string;
}

export function createEmptyCompanyData (): CompanyData {
  return {
    "@odata.context": "",
    "@odata.etag": "",
    SystemId: "b4e1af38-b421-f011-add3-00155d037f01",
    No: "",
    Name: "",
    Name2: "",
    Address: "",
    Address2: "",
    City: "",
    PhoneNo: "",
    CountryRegionCode: "",
    VATRegistrationNo: "",
    PostCode: "",
    County: "",
    Email: "",
    MobilePhoneNo: "",
    CodTransportista: "",
    NIMATransportista: "",
    CertificadoTitularidadBancariaPresentado: false,
    TarjetaNIFEmpresaPresentada: false,
    SystemModifiedAt: "",
    centrosempresasgreenbc: [],
    contactosempresasgreenbc: [],
    cambiosempresasgreenbc: []
  };
}

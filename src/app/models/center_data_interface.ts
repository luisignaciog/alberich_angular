export interface CenterData {
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
  SystemModifiedAt: string;
  centrosempresasgreenbc: centers[];
  contactosempresasgreenbc: contacts[];
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

export function createEmptyCenterData (): CenterData {
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
    SystemModifiedAt: "",
    centrosempresasgreenbc: [],
    contactosempresasgreenbc: []
  };
}

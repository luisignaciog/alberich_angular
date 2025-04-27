export interface LoginData {
  "@odata.context": string;
  "@odata.etag": string;
  No: string;
  DARTGBCWEPasswordWeb: string;
  SystemId: string;
}

export function createEmptyLoginData(): LoginData {
  return {
    "@odata.context": "",
    "@odata.etag": "",
    No: "",
    DARTGBCWEPasswordWeb: "",
    SystemId: ""
  };
}

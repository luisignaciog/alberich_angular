export interface CountryData {
  value: CountryDataValue[];
}
export interface CountryDataValue {
  SystemId: string;
  Code: string;
  Name: string;
}

export function createEmptyCountryData(): CountryData {
  return {
    value: []
  };
}

declare module "pc-vn" {
  export interface Province {
    code: string;
    name: string;
  }

  export interface District {
    code: string;
    name: string;
    province_code: string;
  }

  export interface Ward {
    code: string;
    name: string;
    district_code: string;
  }

  export function getProvinces(): Province[];
  export function getDistricts(): District[];
  export function getWards(): Ward[];
  export function getDistrictsByProvinceCode(provinceCode: string): District[];
  export function getWardsByDistrictCode(districtCode: string): Ward[];
  export function getWardsByProvinceCode(provinceCode: string): Ward[];

  const pcVN: {
    getProvinces: typeof getProvinces;
    getDistricts: typeof getDistricts;
    getWards: typeof getWards;
    getDistrictsByProvinceCode: typeof getDistrictsByProvinceCode;
    getWardsByDistrictCode: typeof getWardsByDistrictCode;
    getWardsByProvinceCode: typeof getWardsByProvinceCode;
  };

  export default pcVN;
}

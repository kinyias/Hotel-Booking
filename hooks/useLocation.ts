import {getProvinces, getDistrictsByProvinceCode, getProvinceByCode, getDistrictByCode} from "vn-provinces";
const useLocation = () => {
  const getAllCities = () => {
    return getProvinces().sort((a, b) => a.name.localeCompare(b.name));
  };
  const getAllDistricsByProvinceCode = (provincesCode: string) =>{
    return getDistrictsByProvinceCode(provincesCode);
  }
  const getCityByCode = (code: string) => {
    return getProvinceByCode(code);
  }

  const getDistByCode = (code: string) => {
    return getDistrictByCode(code);
  }

  return {
    getAllCities,
    getAllDistricsByProvinceCode,
    getCityByCode,
    getDistByCode,
  }
};

export default useLocation;

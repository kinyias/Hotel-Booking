import {getProvinces, getDistrictsByProvinceCode} from "vn-provinces";
const userLocation = () => {
  const getAllCities = () => {
    return getProvinces().sort((a, b) => a.name.localeCompare(b.name));
  };
  const getAllDistricsByProvinceCode = (provincesCode: string) =>{
    return getDistrictsByProvinceCode(provincesCode);
  }

  return {
    getAllCities,
    getAllDistricsByProvinceCode
  }
};

export default userLocation;

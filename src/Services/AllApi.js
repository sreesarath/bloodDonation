import base_url from "./BaseURL";
import commonApi from "./CommonApi";

export const RegisterApi=async(data)=>{
  return await commonApi(`${base_url}/register`,'POST',data,'')
}
export const LoginApi=async(data)=>{
  return await commonApi(`${base_url}/login`,'POST',data,'')
}

export const donorRegiterApi=async(data,token)=>{
    const header={
       Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data"
    }
    return await commonApi(`${base_url}/donor-register`,'POST',data,header)

}
export const getAllDonorsApi=async(token)=>{
      const header = {
    Authorization: `Bearer ${token}`
  }
     return await commonApi(`${base_url}/all-donors`,'GET',"",header)
}
 export const createRequestApi=async(data ,token)=>{
         const header = {
    Authorization: `Bearer ${token}`
  }
   
    return await commonApi(`${base_url}/request`,'POST',data,header)
 }
 export const getNearbyDonorsApi=async(lat,lng,token)=>{
         const header = {
            Authorization: `Bearer ${token}`
 }
     return await commonApi(`${base_url}/nearby?lat=${lat}&lng=${lng}`,'GET',"",header)
 }
 export const getMyRequestApi=async(token)=>{
             const header = {
            Authorization: `Bearer ${token}`
 }
 return await commonApi(`${base_url}/my-request`,'GET',"",header)

 }
 export const deleteRequestApi=async(id,token)=>{
                 const header = {
            Authorization: `Bearer ${token}`
 }
 return await commonApi(`${base_url}/delete-request/${id}`,'DELETE',null,header)
 }
 export const getNearbyRequestApi=async(lat, lng,token)=>{
const header={
    Authorization: `Bearer ${token}`
}
return await commonApi(`${base_url}/nearby-request?lat=${lat}&lng=${lng}`,'GET',null,header)
 }
 export const acceptRequestApi=async(id,token)=>{
     const header = {
    Authorization: `Bearer ${token}`
   }
    return await commonApi(`${base_url}/accept-request/${id}`,'PUT',{},header)
 }
export const rejectRequestApi=async(id,data,token)=>{
    const header={
         Authorization: `Bearer ${token}`
    }
    return await commonApi(`${base_url}/reject-request/${id}`,'PUT',data,header)
}
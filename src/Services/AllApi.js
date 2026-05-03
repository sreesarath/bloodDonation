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
 export const acceptRequestApi=async(id,data,token)=>{
     const header = {
    Authorization: `Bearer ${token}`
   }
    return await commonApi(`${base_url}/accept-request/${id}`,'PUT',data,header)
 }
export const rejectRequestApi=async(id,data,token)=>{
    const header={
         Authorization: `Bearer ${token}`
    }
    return await commonApi(`${base_url}/reject-request/${id}`,'PUT',data,header)
}
export const completeDonationApi=async(id,data,token)=>{
    const header={
         Authorization: `Bearer ${token}`
    }
    return await commonApi(`${base_url}/complete-donation/${id}`,'PUT',data,header)
}
export const rateDonorApi = async (id, data, token) => {
  const header = {
    Authorization: `Bearer ${token}`
  }
  return await commonApi(`${base_url}/rate-donor/${id}`, 'PUT', data, header)
}
export const getMyProfileApi=async(token)=>{
   const header = {
    Authorization: `Bearer ${token}`
  }
  return await commonApi(`${base_url}/getmyprofile`,'GET',"",header)
}
export const updateProfileApi=async(data,token)=>{
   const header = {
    Authorization: `Bearer ${token}`
  }
  return await commonApi(`${base_url}/updateprofile`,'PUT',data,header)
}
export const uploadImageApi=async(data,token)=>{
   const header = {
    Authorization: `Bearer ${token}`
  }
  return await commonApi(`${base_url}/uploadImg`,'POST',data,header,true)
}
export const deleteAccountApi=async(token)=>{
   const header = {
    Authorization: `Bearer ${token}`
  }
  return await commonApi(`${base_url}/delete-account`,'DELETE',"",header)
}
export const toggleAvailiblityApi=async(token)=>{
   const header = {
    Authorization: `Bearer ${token}`
  }
  return await commonApi(`${base_url}/toggle`,'PATCH',"",header)
}
export const getDonorByIdApi=async(id,token)=>{
   const header = {
    Authorization: `Bearer ${token}`
  }
  return await commonApi(`${base_url}/donorProfile/${id}`,'GET',null,header)
}
export const getAdminDash=async(token,range)=>{
const header={
  Authorization: `Bearer ${token}`
}
return await commonApi(`${base_url}/adminDash?range=${range}`,'GET',"",header)
}
export const genarateReportApi=async(token,range)=>{
 const header={
  Authorization: `Bearer ${token}`
} 
return await commonApi(`${base_url}/admin-report?range=${range}`,'GET',"",header,false,"blob")

}
export const getPendingDonorsApi=async(token)=>{
 const header={
  Authorization: `Bearer ${token}`
}
return await commonApi(`${base_url}/pending-donors`,'GET',"",header)
}
export const approveDonorApi=async(id,token)=>{
 const header={
  Authorization: `Bearer ${token}`
}
return await commonApi(`${base_url}/admin-approved/${id}`,'PUT',"",header)
}
export const rejectDonorApi=async(id,token)=>{
 const header={
  Authorization: `Bearer ${token}`
}
return await commonApi(`${base_url}/admin-rejected/${id}`,'PUT',"",header)
}
export const getDonorRatingApi=async(id,token)=>{
 const header={
  Authorization: `Bearer ${token}`
}
return await commonApi(`${base_url}/avgRating/${id}`,'GET',null,header)
}
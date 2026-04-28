import axios from "axios";

const commonApi = async (reqUrl, reqMethod, reqData, reqHeaders) => {
    const config = {
        url: reqUrl,
        method: reqMethod,
        headers: reqHeaders || {} 
    };

    // Only add data and Content-Type if reqData is provided and not empty
    if (reqData) {
        config.data = reqData;
        // Only set application/json if the user didn't provide a different type 
        // (like multipart/form-data for image uploads)
       if (!(reqData instanceof FormData)) {
            if (!config.headers["Content-Type"]) {
                config.headers["Content-Type"] = "application/json";
            }
        }
    }

    return await axios(config)
        .then(res => res)
        .catch(err => err.response || err);
};

export default commonApi;
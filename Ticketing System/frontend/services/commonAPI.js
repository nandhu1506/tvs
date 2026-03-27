  import axios from "axios";

  const commonAPI = async (httpMethod, url, reqBody, reqHeader) => {
    try {
      const res = await axios({
        method: httpMethod,
        url,
        data: reqBody,
        headers: reqHeader || { "Content-Type": "application/json" },
        responseType: reqHeader?.responseType || "json",
      });
      return res;
    } catch (err) {
      if (err.response) return err.response;
      throw err;
    }
  };

  export default commonAPI;



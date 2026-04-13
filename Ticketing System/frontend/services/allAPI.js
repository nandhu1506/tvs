import { serverURL } from "../config"
import commonAPI from "./commonAPI"

// register API
export const registerAPI = async (reqBody) => {
  return await commonAPI("POST", `${serverURL}/register`, reqBody)
}

// forgot password API
export const forgotPasswordAPI = async (reqBody) => {
  return await commonAPI(
    "POST", `${serverURL}/forgot-password`, reqBody);
};

// verify OTP API
export const verifyOtpAPI = async (reqBody) => {
  return await commonAPI(
    "POST", `${serverURL}/verify-otp`, reqBody);
};

// reset password API
export const resetPasswordAPI = async (reqBody) => {
  return await commonAPI(
    "POST", `${serverURL}/reset-password`, reqBody);
};

// login API
export const loginAPI = async (reqBody) => {
  return await commonAPI("POST", `${serverURL}/login`, reqBody)
}


// change password API
export const changePasswordAPI = async (reqBody) => {
  const token = sessionStorage.getItem("token");
  return await commonAPI("POST", `${serverURL}/change-password`, reqBody,
    {
      Authorization: `Bearer ${token}`,
    }
  )
}


// addRequest API
export const addRequestAPI = async (reqBody) => {
  const token = sessionStorage.getItem("token");

  return await commonAPI("POST", `${serverURL}/addticket`, reqBody,
    {
      Authorization: `Bearer ${token}`,
    }
  );
};

// get tickets API
export const getAllTicketsAPI = async ({ page, limit, status, project }) => {
  let query = `?page=${page}&limit=${limit}`;
  const token = sessionStorage.getItem("token");
  if (status) query += `&status=${status}`;
  if (project) query += `&project=${project}`;

  return await commonAPI("GET", `${serverURL}/tickets${query}`, null,
    {
      Authorization: `Bearer ${token}`,
    });
};

// getticketAPI
export const getTicketAPI = async (id) => {
  const token = sessionStorage.getItem("token");
  return await commonAPI("GET", `${serverURL}/view/${id}`, null,
    {
      Authorization: `Bearer ${token}`,
    }
  );
};

// Update ticket 
export const updateTicketAPI = async (ticketId, payload) => {
  const token = sessionStorage.getItem("token");
  return await commonAPI("PUT", `${serverURL}/view/${ticketId}`, payload,
    {
      Authorization: `Bearer ${token}`,
    }
  );
};

// get all users
export const getUsersAPI = async () => {
  const token = sessionStorage.getItem("token");
  return await commonAPI("GET", `${serverURL}/users`, null,
    {
      Authorization: `Bearer ${token}`,
    }
  );
};

// send replay
export const sendReplyAPI = async (formData) => {
  const token = sessionStorage.getItem("token");
  return await commonAPI("POST", `${serverURL}/ticket/reply`, formData,
    {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    }
  );
};

// get projects
export const getProjectsAPI = async () => {
  const token = sessionStorage.getItem("token");
  return await commonAPI("GET", `${serverURL}/projects`, null,
    {
      Authorization: `Bearer ${token}`,
    }
  );
};

// Export tickets
export const exportTicketsAPI = async (fromDate, toDate, project) => {
  const token = sessionStorage.getItem("token");
  return await commonAPI("GET", `${serverURL}/export?fromDate=${fromDate}&toDate=${toDate}&project=${project}`, null,
    {
      Authorization: `Bearer ${token}`,
      responseType: "blob",
    }
  );
};


const baseUrl = "http://192.168.100.241:9999";
import axios from "axios";

export const CreateImage = (data: File) => {
  const formData = new FormData();
  formData.append("tenantId", "test");
  formData.append("module", "test");
  formData.append("fileName", data.name);
  formData.append("file", data);
  return axios.post(`${baseUrl}/api/file/upload/public`, formData);
};

import axios from "axios";
const url = "/api/persons";

const getAll = () => {
  const request = axios.get(url);
  return request.then((response) => response.data);
};

const create = (newObject) => {
  const request = axios.post(url, newObject);
  return request.then((response) => response.data);
};

const deleteContact = (id) => {
  const request = axios.delete(`${url}/${id}`);
  return request.then((response) => response.data);
};

const updateNumber = (id, object) => {
  const request = axios.put(`${url}/${id}`, object);
  return request.then((response) => response.data);
};

const phonebookService = {
  getAll,
  create,
  deleteContact,
  updateNumber,
};

export default phonebookService;

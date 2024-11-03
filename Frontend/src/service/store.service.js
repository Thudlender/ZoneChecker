import api from "./api"
const STORE_API = import.meta.env.VITE_STORE_API 

//get all Libraries
const getAllStore = async () => {
    return await api.get(STORE_API);
};

const getstoreById = async (id) => {
    return await api.get(`${STORE_API}/${id}`);
}

const updatestore  = async (id, store) => {
    return await api.put(STORE_API + `/${id}`, store);
}

const deletestore = async (id) => {
    return api.delete(STORE_API + `/${id}`);
};

const addstore = async (store) => {
    return await api.post(STORE_API, store);
};

const StoreService = {
    getAllStore,
  getstoreById,
  updatestore,
  deletestore,
  addstore,
};

export default StoreService;
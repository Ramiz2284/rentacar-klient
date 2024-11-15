// src/api.js
import axios from 'axios'

const api = axios.create({
	/* baseURL: 'https://rentacar.pcref.site:8443/api', */
	baseURL: 'https://rentacar.pcref.site:8443/api',
})

// Добавление токена аутентификации к каждому запросу, если токен существует
api.interceptors.request.use(
	config => {
		const token = localStorage.getItem('token')
		if (token) {
			config.headers.Authorization = `Bearer ${token}`
		}
		return config
	},
	error => Promise.reject(error)
)

export const fetchCars = () => api.get('/cars')
export const createCar = data => api.post('/cars', data)
export const updateCar = (id, data) => api.put(`/cars/${id}`, data)
export const deleteCar = id => api.delete(`/cars/${id}`)

export default api

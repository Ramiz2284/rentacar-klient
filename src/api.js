// src/api.js
import axios from 'axios'

const api = axios.create({
	baseURL: 'http://localhost:5000/api', // Замените на адрес вашего сервера
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

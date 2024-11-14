// src/components/CarManagement.js
import React, { useContext, useEffect, useState } from 'react'
import { createCar, deleteCar, fetchCars, updateCar } from '../api'
import { AuthContext } from '../AuthContext' // Подключаем контекст аутентификации
import './css/CarManagement.css'

const CarManagement = () => {
	const { user } = useContext(AuthContext) // Достаем данные пользователя из контекста

	const isAdmin = user?.isAdmin // Проверяем, является ли пользователь администратором

	const [cars, setCars] = useState([])
	const [formData, setFormData] = useState({
		name: '',
		description: '',
		price: '',
		images: [],
		existingImages: [],
	})
	const [editingCar, setEditingCar] = useState(null)
	const [isModalOpen, setIsModalOpen] = useState(false)

	useEffect(() => {
		const getCars = async () => {
			const { data } = await fetchCars()
			setCars(data)
		}
		getCars()
	}, [])

	const handleChange = e => {
		const { name, value, files } = e.target
		if (name === 'images') {
			setFormData({ ...formData, images: files })
		} else {
			setFormData({ ...formData, [name]: value })
		}
	}

	const handleSubmit = async e => {
		e.preventDefault()
		const data = new FormData()
		data.append('name', formData.name)
		data.append('description', formData.description)
		data.append('price', formData.price)

		// Добавляем новые изображения
		for (let i = 0; i < formData.images.length; i++) {
			data.append('images', formData.images[i])
		}

		// Передаем только актуальные существующие изображения
		data.append('existingImages', JSON.stringify(formData.existingImages))

		if (editingCar) {
			await updateCar(editingCar._id, data)
			setEditingCar(null)
		} else {
			await createCar(data)
		}

		// Обновляем список автомобилей после создания/обновления
		const { data: updatedCars } = await fetchCars()
		setCars(updatedCars)
		setFormData({
			name: '',
			description: '',
			price: '',
			images: [],
			existingImages: [],
		})
		setIsModalOpen(false)
	}

	const handleEdit = car => {
		setEditingCar(car)
		setFormData({
			name: car.name,
			description: car.description,
			price: car.price,
			images: [],
			existingImages: car.images || [],
		})
		setIsModalOpen(true)
	}

	const handleDelete = async carId => {
		await deleteCar(carId)
		const { data: updatedCars } = await fetchCars()
		setCars(updatedCars)
	}

	const handleImageRemove = (index, isExisting) => {
		if (isExisting) {
			const updatedExistingImages = formData.existingImages.filter(
				(_, i) => i !== index
			)
			setFormData({ ...formData, existingImages: updatedExistingImages })
		} else {
			const updatedImages = Array.from(formData.images).filter(
				(_, i) => i !== index
			)
			setFormData({ ...formData, images: updatedImages })
		}
	}

	return (
		<div>
			<p>Редактировать список</p>

			{isAdmin && (
				<form onSubmit={handleSubmit} className='car-form'>
					<input
						name='name'
						placeholder='Название'
						value={formData.name}
						onChange={handleChange}
						required
					/>
					<textarea
						name='description'
						placeholder='Описание'
						value={formData.description}
						onChange={handleChange}
						required
					/>
					<input
						name='price'
						placeholder='Цена'
						type='number'
						value={formData.price}
						onChange={handleChange}
						required
					/>
					<input type='file' name='images' onChange={handleChange} multiple />
					<button type='submit'>
						{editingCar ? 'Обновить автомобиль' : 'Добавить автомобиль'}
					</button>
				</form>
			)}

			<div className='car-list'>
				{cars.map(car => (
					<div key={car._id} className='car-card'>
						{car.images && car.images.length > 0 ? (
							<img
								src={`http://localhost:5000/${car.images[0]}`}
								alt={car.name}
								className='car-image'
							/>
						) : (
							<div className='no-image'>Нет изображения</div>
						)}
						<h3 className='car-name'>{car.name}</h3>
						<p className='car-price'>Цена: ${car.price}</p>

						{isAdmin && (
							<div className='car-actions'>
								<button onClick={() => handleEdit(car)}>Редактировать</button>
								<button onClick={() => handleDelete(car._id)}>Удалить</button>
							</div>
						)}
					</div>
				))}
			</div>

			{isModalOpen && (
				<div className='modal'>
					<div className='modal-content'>
						<span
							className='close-manage'
							onClick={() => setIsModalOpen(false)}
						>
							&times;
						</span>

						<form onSubmit={handleSubmit}>
							<input
								name='name'
								placeholder='Название'
								value={formData.name}
								onChange={handleChange}
								required
							/>
							<textarea
								name='description'
								placeholder='Описание'
								value={formData.description}
								onChange={handleChange}
								required
							/>
							<input
								name='price'
								placeholder='Цена'
								type='number'
								value={formData.price}
								onChange={handleChange}
								required
							/>
							<input
								type='file'
								name='images'
								onChange={handleChange}
								multiple
							/>

							<div className='existing-images'>
								{formData.existingImages.map((image, index) => (
									<div key={index} className='image-preview'>
										<img
											src={`http://localhost:5000/${image}`}
											alt={`Фото ${index + 1}`}
											width='80'
										/>
										<button
											type='button'
											onClick={() => handleImageRemove(index, true)}
										>
											Удалить
										</button>
									</div>
								))}
							</div>

							<div className='existing-images'>
								{Array.from(formData.images).map((image, index) => (
									<div key={index} className='image-preview'>
										<img
											src={URL.createObjectURL(image)}
											alt={`Новое фото ${index + 1}`}
											width='80'
										/>
										<button
											type='button'
											onClick={() => handleImageRemove(index, false)}
										>
											Удалить
										</button>
									</div>
								))}
							</div>

							<button type='submit'>
								{editingCar ? 'Обновить автомобиль' : 'Добавить автомобиль'}
							</button>
						</form>
					</div>
				</div>
			)}
		</div>
	)
}

export default CarManagement

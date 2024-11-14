// src/components/CarList.js
import React, { useEffect, useState } from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick-theme.css'
import 'slick-carousel/slick/slick.css'
import { fetchCars } from '../api'
import './css/CarList.css'

const CarList = () => {
	const [cars, setCars] = useState([])
	const [selectedCar, setSelectedCar] = useState(null)

	useEffect(() => {
		const getCars = async () => {
			const { data } = await fetchCars()
			setCars(data)
		}
		getCars()
	}, [])

	const handleCarClick = car => {
		setSelectedCar(car)
	}

	const handleCloseModal = () => {
		setSelectedCar(null)
	}

	// Настройки слайдера
	const sliderSettings = {
		dots: true,
		infinite: true,
		speed: 500,
		slidesToShow: 1,
		slidesToScroll: 1,
	}

	// Функция для создания ссылки на WhatsApp с сообщением
	const handleOrder = () => {
		const message = `Здравствуйте! Я хочу заказать автомобиль:\n\nМодель: ${selectedCar.name}\nОписание: ${selectedCar.description}\nЦена: ${selectedCar.price}$\n\nПожалуйста, свяжитесь со мной для уточнения деталей.`
		const phoneNumber = '905444558407'
		const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
			message
		)}`
		window.open(url, '_blank')
	}

	return (
		<div>
			<h1 className='carlist-h1'>Аренда авто в Анталии</h1>
			<h2 className='carlist-h2'>Список автомобилей</h2>
			<div className='car-list'>
				{cars.map(car => (
					<div
						key={car._id}
						onClick={() => handleCarClick(car)}
						className='car-card'
					>
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
					</div>
				))}
			</div>

			{/* Модальное окно для отображения полной информации */}
			{selectedCar && (
				<div className='modal'>
					<div className='modal-content'>
						<span className='close' onClick={handleCloseModal}>
							&times;
						</span>

						{/* Слайдер для отображения нескольких изображений */}
						{selectedCar.images && selectedCar.images.length > 0 ? (
							<Slider {...sliderSettings}>
								{selectedCar.images.map((image, index) => (
									<div key={index}>
										<img
											src={`http://localhost:5000/${image}`}
											alt={`${selectedCar.name} ${index + 1}`}
											width='300'
										/>
									</div>
								))}
							</Slider>
						) : (
							<p>Нет доступных изображений</p>
						)}

						<h2>{selectedCar.name}</h2>
						<p>{selectedCar.description}</p>
						<p>Цена: ${selectedCar.price}</p>
						{/* Кнопка для заказа */}
						<button onClick={handleOrder} className='order-button'>
							Заказать
						</button>
					</div>
				</div>
			)}
		</div>
	)
}

export default CarList

// src/components/Register.js
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './css/Register.css' // Подключаем CSS файл

const Register = () => {
	const [formData, setFormData] = useState({
		email: '',
		password: '',
		isAdmin: false,
	})
	const [message, setMessage] = useState('')
	const navigate = useNavigate()

	const handleChange = e => {
		const { name, value, type, checked } = e.target
		setFormData({
			...formData,
			[name]: type === 'checkbox' ? checked : value,
		})
	}

	const handleSubmit = async e => {
		e.preventDefault()
		try {
			const response = await fetch('http://localhost:5000/api/auth/register', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData),
			})
			if (response.ok) {
				setMessage('Регистрация прошла успешно!')
				setFormData({ email: '', password: '', isAdmin: false })
				setTimeout(() => {
					navigate('/войти')
				}, 1500)
			} else {
				const data = await response.json()
				setMessage(`Ошибка: ${data.message}`)
			}
		} catch (error) {
			setMessage(`Ошибка: ${error.message}`)
		}
	}

	return (
		<div className='register-container'>
			<h2>Регистрация</h2>
			<form onSubmit={handleSubmit}>
				<div>
					<label>Email:</label>
					<input
						type='email'
						name='email'
						value={formData.email}
						onChange={handleChange}
						required
					/>
				</div>
				<div>
					<label>Пароль:</label>
					<input
						type='password'
						name='password'
						value={formData.password}
						onChange={handleChange}
						required
					/>
				</div>
				<div className='checkbox-container'>
					<label>Администратор:</label>
					<input
						type='checkbox'
						name='isAdmin'
						checked={formData.isAdmin}
						onChange={handleChange}
					/>
				</div>
				<button type='submit'>Зарегистрироваться</button>
			</form>
			{message && <p>{message}</p>}
		</div>
	)
}

export default Register

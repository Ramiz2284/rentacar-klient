// src/components/Login.js
import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../AuthContext'
import LogoutButton from './LogoutButton'
import './css/Login.css' // Подключаем CSS файл

const Login = () => {
	const [formData, setFormData] = useState({ email: '', password: '' })
	const [message, setMessage] = useState('')
	const { login } = useContext(AuthContext)
	const navigate = useNavigate()

	const handleChange = e => {
		const { name, value } = e.target
		setFormData({ ...formData, [name]: value })
	}

	const handleSubmit = async e => {
		e.preventDefault()
		try {
			const response = await fetch(
				'https://rentacar.pcref.site:8443/api/auth/login',
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(formData),
				}
			)
			const data = await response.json()
			if (response.ok) {
				setMessage('Вход выполнен успешно!')
				localStorage.setItem('token', data.token)

				const userData = JSON.parse(atob(data.token.split('.')[1]))
				login(userData, data.token)

				navigate('/')
			} else {
				setMessage(`Ошибка: ${data.message}`)
			}
		} catch (error) {
			setMessage(`Ошибка: ${error.message}`)
		}
	}

	return (
		<div className='login-container'>
			<h2>Авторизация</h2>
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
				<button type='submit'>Войти</button>
			</form>
			{message && <p>{message}</p>}
			<LogoutButton />
		</div>
	)
}

export default Login

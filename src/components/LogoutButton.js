// src/components/LogoutButton.js
import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../AuthContext'

const LogoutButton = () => {
	const { logout } = useContext(AuthContext)
	const navigate = useNavigate()

	const handleLogout = () => {
		logout()
		navigate('/') // Перенаправляем на страницу входа
	}

	return <button onClick={handleLogout}>Выйти</button>
}

export default LogoutButton

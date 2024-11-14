// src/AuthContext.js
import React, { createContext, useEffect, useState } from 'react'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null)

	useEffect(() => {
		const token = localStorage.getItem('token')
		if (token) {
			const userData = JSON.parse(atob(token.split('.')[1]))
			setUser(userData)
		}
	}, [])

	const login = (userData, token) => {
		localStorage.setItem('token', token)
		setUser(userData)
	}

	const logout = () => {
		localStorage.removeItem('token')
		setUser(null)
	}

	return (
		<AuthContext.Provider value={{ user, login, logout }}>
			{children}
		</AuthContext.Provider>
	)
}

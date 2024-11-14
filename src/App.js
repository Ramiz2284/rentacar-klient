// src/App.js
import React from 'react'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { AuthProvider } from './AuthContext'
import CarList from './components/CarList'
import CarManagement from './components/CarManagement'
import './components/css/Body.css'
import Login from './components/Login'
import Register from './components/Register'

function App() {
	return (
		<AuthProvider>
			{' '}
			{/* Оборачиваем все приложение в AuthProvider */}
			<Router>
				<Routes>
					<Route path='/' element={<CarList />} />
					<Route path='/редактироватьавто' element={<CarManagement />} />
					<Route path='/регистрация' element={<Register />} />
					<Route path='/войти' element={<Login />} />
				</Routes>
			</Router>
		</AuthProvider>
	)
}

export default App

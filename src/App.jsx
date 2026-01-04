import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import Sobre from './pages/Sobre'
import ComoFunciona from './pages/ComoFunciona'
import Contato from './pages/Contato'
import VendaDeAutomoveis from './pages/servicos/VendaDeAutomoveis'
import AluguelDeAutomoveis from './pages/servicos/AluguelDeAutomoveis'
import VendaDePecas from './pages/servicos/VendaDePecas'
import VendaSeuAutomovel from './pages/servicos/VendaSeuAutomovel'
import Reboque from './pages/servicos/Reboque'

function App() {
	return (
		<Router>
			<Header />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/sobre" element={<Sobre />} />
				<Route path="/como-funciona" element={<ComoFunciona />} />
				<Route path="/contato" element={<Contato />} />

				<Route path="/servicos/venda-de-automoveis" element={<VendaDeAutomoveis />} />
				<Route path="/servicos/aluguel-de-automoveis" element={<AluguelDeAutomoveis />} />
				<Route path="/servicos/venda-de-pecas" element={<VendaDePecas />} />
				<Route path="/servicos/venda-seu-automovel" element={<VendaSeuAutomovel />} />
				<Route path="/servicos/reboque" element={<Reboque />} />

			</Routes>
		</Router>
	)
}

export default App

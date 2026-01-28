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
import Aluguel from './pages/stand/Aluguel'
import DetalhesAluguel from './pages/stand/DetalhesAluguel'
import Compra from './pages/stand/Compra'
import DetalhesCompra from './pages/stand/DetalhesCompra'
import PecasAcessorios from './pages/stand/PecasAcessorios'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import NotFound from './pages/NotFound'
import Parceiros from './pages/Parceiros'
import GPS from './pages/servicos/GPS'
import SeguroAutomovel from './pages/servicos/SeguroAutomovel'

function App() {
	return (
		<Router>
			<ScrollToTop />
			<Header />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/sobre" element={<Sobre />} />
				<Route path="/como-funciona" element={<ComoFunciona />} />
				<Route path="/contato" element={<Contato />} />
				<Route path="/parceiros" element={<Parceiros />} />

				<Route path="/servicos/venda-de-automoveis" element={<VendaDeAutomoveis />} />
				<Route path="/servicos/aluguel-de-automoveis" element={<AluguelDeAutomoveis />} />
				<Route path="/servicos/venda-de-pecas" element={<VendaDePecas />} />
				<Route path="/servicos/venda-seu-automovel" element={<VendaSeuAutomovel />} />
				<Route path="/servicos/reboque" element={<Reboque />} />
				<Route path="/servicos/gps" element={<GPS />} />
				<Route path="/servicos/seguro-automovel" element={<SeguroAutomovel />} />

				{/* Stand routes */}
				<Route path="/stand/aluguel" element={<Aluguel />} />
				<Route path="/stand/aluguel/:id" element={<DetalhesAluguel />} />
				<Route path="/stand/compra" element={<Compra />} />
				<Route path="/stand/compra/:id" element={<DetalhesCompra />} />
				<Route path="/stand/pecas-acessorios" element={<PecasAcessorios />} />

				{/* 404 route - keep last */}
				<Route path="*" element={<NotFound />} />

			</Routes>
			<Footer />
		</Router>
	)
}

export default App

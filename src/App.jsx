import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { pageview } from './analytics'
import Header from './components/Header'
import Home from './pages/Home'
import Sobre from './pages/Sobre'
import ComoFunciona from './pages/ComoFunciona'
import Contato from './pages/Contato'
import AluguelDeAutomoveis from './pages/servicos/AluguelDeAutomoveis'
import VendaSeuAutomovel from './pages/VendaSeuAutomovel'
import Reboque from './pages/servicos/Reboque'
import DetalhesAluguel from './pages/servicos/DetalhesAluguel'
import Compra from './pages/stand/Compra'
import DetalhesCompra from './pages/stand/DetalhesCompra'
import PecasAcessorios from './pages/stand/PecasAcessorios'
import DetalhesPecas from './pages/stand/DetalhesPecas'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import NotFound from './pages/NotFound'
import Parceiros from './pages/Parceiros'
import GPS from './pages/servicos/GPS'
import SeguroAutomovel from './pages/servicos/SeguroAutomovel'

function Analytics() {
	const location = useLocation();
	
	useEffect(() => {
		pageview(location.pathname + location.search);
	}, [location]);
	
	return null;
}

function App() {
	return (
		<Router>
			<Analytics />
			<ScrollToTop />
			<Header />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/sobre" element={<Sobre />} />
				<Route path="/como-funciona" element={<ComoFunciona />} />
				<Route path="/contato" element={<Contato />} />
				<Route path="/parceiros" element={<Parceiros />} />
				<Route path="/venda-seu-automovel" element={<VendaSeuAutomovel />} />

				{/* Peças e Acessórios routes */}
				<Route path="/servicos/gps" element={<GPS />} />
				<Route path="/servicos/reboque" element={<Reboque />} />
				<Route path="/servicos/seguro-automovel" element={<SeguroAutomovel />} />
				<Route path="/servicos/aluguel-de-automoveis" element={<AluguelDeAutomoveis />} />
				<Route path="/servicos/aluguel-de-automoveis/:id" element={<DetalhesAluguel />} />

				{/* Stand routes */}
				<Route path="/stand/compra" element={<Compra />} />
				<Route path="/stand/compra/:id" element={<DetalhesCompra />} />
				<Route path="/stand/pecas-acessorios" element={<PecasAcessorios />} />
				<Route path="/stand/pecas-acessorios/:id" element={<DetalhesPecas />} />

				{/* 404 route - keep last */}
				<Route path="*" element={<NotFound />} />

			</Routes>
			<Footer />
		</Router>
	)
}

export default App

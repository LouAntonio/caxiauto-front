import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { pageview } from './analytics'
import { AuthProvider } from './contexts/AuthContext'
import { AdminProvider } from './contexts/AdminContext'
import Header from './components/Header'
import ProtectedRoute from './components/ProtectedRoute'
import ProtectedAdminRoute from './components/ProtectedAdminRoute'
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
import Auth from './pages/Auth'
import RecuperarSenha from './pages/RecuperarSenha'
import ContaLayout from './pages/conta/Layout'
import Dashboard from './pages/conta/Dashboard'
import Veiculos from './pages/conta/Veiculos'
import VeiculosAluguel from './pages/conta/VeiculosAluguel'
import Favoritos from './pages/conta/Favoritos'
import Documentos from './pages/conta/Documentos'
import Reservas from './pages/conta/Reservas'
import Assinatura from './pages/conta/Assinatura'
import Avaliacoes from './pages/conta/Avaliacoes'
import Denuncias from './pages/conta/Denuncias'
import PerfilVendedor from './pages/PerfilVendedor'
// Admin Pages
import AdminLogin from './pages/caxiauto/AdminLogin'
import AdminLayout from './pages/caxiauto/AdminLayout'
import AdminDashboard from './pages/caxiauto/AdminDashboard'
import AdminVehicles from './pages/caxiauto/AdminVehicles'
import AdminPecas from './pages/caxiauto/AdminPecas'
import AdminCategorias from './pages/caxiauto/AdminCategorias'
import AdminUsers from './pages/caxiauto/AdminUsers'
import AdminSellers from './pages/caxiauto/AdminSellers'
import AdminReports from './pages/caxiauto/AdminReports'
import AdminReviews from './pages/caxiauto/AdminReviews'
import AdminManufacturers from './pages/caxiauto/AdminManufacturers'
import AdminClasses from './pages/caxiauto/AdminClasses'
import AdminPartners from './pages/caxiauto/AdminPartners'
import AdminPlans from './pages/caxiauto/AdminPlans'
import AdminHighlightPackages from './pages/caxiauto/AdminHighlightPackages'

function Analytics() {
	const location = useLocation();
	
	useEffect(() => {
		pageview(location.pathname + location.search);
	}, [location]);
	
	return null;
}

function AppContent() {
	const location = useLocation();
	const isAdminRoute = location.pathname === '/caxiauto' || location.pathname.startsWith('/caxiauto/');

	return (
		<AuthProvider>
			<AdminProvider>
				<Analytics />
				<ScrollToTop />
				{!isAdminRoute && <Header />}
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

						{/* Auth routes */}
						<Route path="/auth" element={<Auth />} />
						<Route path="/recuperar-senha" element={<RecuperarSenha />} />

						{/* Perfil público do vendedor */}
						<Route path="/vendedor/:id" element={<PerfilVendedor />} />

						{/* Protected routes - Painel de Conta */}
						<Route
							path="/minha-conta"
							element={
								<ProtectedRoute>
									<ContaLayout />
								</ProtectedRoute>
							}
						>
							<Route index element={<Dashboard />} />
							<Route path="veiculos" element={<Veiculos />} />
							<Route path="veiculos-aluguel" element={<VeiculosAluguel />} />
							<Route path="reservas" element={<Reservas />} />
							<Route path="favoritos" element={<Favoritos />} />
							<Route path="documentos" element={<Documentos />} />
							<Route path="assinatura" element={<Assinatura />} />
							<Route path="avaliacoes" element={<Avaliacoes />} />
							<Route path="denuncias" element={<Denuncias />} />
						</Route>

						{/* Admin Routes - Painel Administrativo */}
						<Route path="/caxiauto/login" element={<AdminLogin />} />
						<Route
							path="/caxiauto"
							element={
								<ProtectedAdminRoute>
									<AdminLayout />
								</ProtectedAdminRoute>
							}
						>
							<Route index element={<AdminDashboard />} />
							<Route path="dashboard" element={<AdminDashboard />} />
							<Route path="veiculos" element={<AdminVehicles />} />
							<Route path="pecas" element={<AdminPecas />} />
							<Route path="categorias" element={<AdminCategorias />} />
							<Route path="usuarios" element={<AdminUsers />} />
							<Route path="vendedores" element={<AdminSellers />} />
							<Route path="denuncias" element={<AdminReports />} />
							<Route path="avaliacoes" element={<AdminReviews />} />
							<Route path="fabricantes" element={<AdminManufacturers />} />
							<Route path="classes" element={<AdminClasses />} />
							<Route path="parceiros" element={<AdminPartners />} />
							<Route path="planos" element={<AdminPlans />} />
							<Route path="pacotes-destaque" element={<AdminHighlightPackages />} />
						</Route>

						{/* 404 route - keep last */}
						<Route path="*" element={<NotFound />} />

				</Routes>
				{!isAdminRoute && <Footer />}
			</AdminProvider>
		</AuthProvider>
	)
}

function App() {
	return (
		<Router>
			<AppContent />
		</Router>
	)
}

export default App

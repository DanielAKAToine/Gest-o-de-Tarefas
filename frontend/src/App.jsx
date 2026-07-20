import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './componentes/Navbar';
import Home from './paginas/Home/Home';
import Auth from './paginas/Auth/Login';
import Tarefas from './paginas/Tarefas/Tarefas';
import Registo from './paginas/Auth/Registo';

export default function App() {
  const [autenticado, setAutenticado] = useState(false);

  return (
    <BrowserRouter>
      <Navbar autenticado={autenticado} onLogout={() => setAutenticado(false)} />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={
          autenticado ? <Navigate to="/tarefas" /> : <Auth onLoginSuccess={() => setAutenticado(true)} />
        } />

        <Route path="/tarefas" element={
          autenticado ? <Tarefas /> : <Navigate to="/login" />
        } />

        <Route path="/registo" element={<Registo />} />

      </Routes>
    </BrowserRouter>
  );
}
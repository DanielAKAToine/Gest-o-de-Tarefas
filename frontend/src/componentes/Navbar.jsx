import { Link } from 'react-router-dom';
import './Navbar.css';

export default function Navbar({ autenticado, onLogout }) {
    return (
        <nav className="navbar">
            <Link to="/" className="navbar-logo-link">
                <h2 className="navbar-logo">TaskApp</h2>
            </Link>

            <div className="navbar-links">
                {!autenticado ? (
                    <>
                        <Link to="/login" className="nav-link">Login</Link>
                        <Link to="/registo" className="nav-link">Registo</Link>
                    </>
                ) : (
                    <>
                        <Link to="/tarefas" className="nav-link">Tarefas</Link>
                        <Link to="/perfil" className="nav-link">Perfil</Link>
                        <button onClick={onLogout} className="btn-logout">Sair</button>
                    </>
                )}
            </div>
        </nav>
    );
}
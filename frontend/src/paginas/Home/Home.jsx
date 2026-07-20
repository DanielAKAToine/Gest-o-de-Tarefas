import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
    return (
        <div className="home-container">
            <h1>Bem-vindo à App de Tarefas Super Fáceis! 🚀</h1>
            <p>Organiza o teu dia a dia num piscar de olhos.</p>
            <div className="home-action">
                <Link to="/login" className="home-button">
                    Começar Agora
                </Link>
            </div>
        </div>
    );
}
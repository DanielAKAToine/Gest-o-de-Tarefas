import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

export default function Login({ onLoginSuccess }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const resposta = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (!resposta.ok) {
                const dadosErro = await resposta.json();
                alert(dadosErro.erro || 'Erro ao fazer login.');
                return;
            }

            const dados = await resposta.json();

            if (onLoginSuccess) onLoginSuccess();

            navigate('/tarefas');

        } catch (erro) {
            console.error("Detalhes do erro:", erro);
            alert("Erro ao ligar ao servidor Spring Boot!");
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Bem-vindo de Volta</h2>
                <p className="login-subtitle">Introduz as tuas credenciais para acederes às tuas tarefas.</p>

                <form onSubmit={handleLogin} className="login-form">
                    <div className="form-group">
                        <label htmlFor="email">E-mail</label>
                        <input
                            type="email"
                            id="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="exemplo@email.com"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Introduz a tua password"
                        />
                    </div>

                    <button type="submit" className="btn-login">Entrar</button>
                </form>

                <p className="login-footer">
                    Ainda não tens conta? <Link to="/registo">Regista-te aqui</Link>
                </p>
            </div>
        </div>
    );
}
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Registo.css';

export default function Registo() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmarPassword, setConfirmarPassword] = useState('');
    const navigate = useNavigate();

    const obterForcaPassword = () => {
        if (!password) return { nivel: 0, texto: '', cor: '' };

        const temTamanhoCerto = password.length >= 8;
        const temMaiuscula = /[A-Z]/.test(password);
        const temNumero = /[0-9]/.test(password);
        let criteriosCumpridos = 0;

        if (temTamanhoCerto) criteriosCumpridos++;

        if (temMaiuscula) criteriosCumpridos++;

        if (temNumero) criteriosCumpridos++;

        if (criteriosCumpridos === 3) {
            return { nivel: 4, texto: 'Forte', cor: 'forte' };
        }


        if (criteriosCumpridos === 2) {
            return { nivel: 3, texto: 'Média', cor: 'media' };
        }


        if (criteriosCumpridos === 1) {
            return { nivel: 2, texto: 'Fraca', cor: 'fraca' };
        }

        return { nivel: 1, texto: 'Muito Fraca', cor: 'muito-fraca' };
    };

    const infoForca = obterForcaPassword();

    const handleRegisto = async (e) => {
        e.preventDefault();

        if (!nome || !email || !password || !confirmarPassword) {
            alert("Por favor, preencha todos os campos!");
            return;
        }

        if (password !== confirmarPassword) {
            alert("As passwords não coincidem!");
            return;
        }

        try {
            const resposta = await fetch('http://localhost:8080/api/auth/registo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nome, email, password })
            });

            const dados = await resposta.json();

            if (!resposta.ok) {
                alert(dados.erro || 'Ocorreu um erro ao criar a conta.');
                return;
            }

            alert("Conta criada com sucesso! Podes agora fazer o teu login.");
            navigate('/login');

        } catch (erro) {
            console.error("Erro na ligação ao servidor:", erro);
            alert("Não foi possível ligar ao servidor Spring Boot. Confirma se o backend está a correr!");
        }
    };

    return (
        <div className="registo-container">
            <div className="registo-card">
                <h2>Criar Conta</h2>
                <p className="registo-subtitle">Regista-te para começares a organizar as tuas tarefas.</p>

                <form onSubmit={handleRegisto} className="registo-form">
                    <div className="form-group">
                        <label htmlFor="nome">Nome Completo</label>
                        <input
                            type="text"
                            id="nome"
                            required
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            placeholder="Januário Silva"
                        />
                    </div>

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
                            placeholder="Escolhe uma password forte"
                        />

                        {password && (
                            <div className="password-strength-wrapper">
                                <div className="strength-bar-container">
                                    <div className={`strength-bar ${infoForca.cor} nivel-${infoForca.nivel}`}></div>
                                </div>
                                <span className={`strength-text ${infoForca.cor}`}>{infoForca.texto}</span>
                            </div>
                        )}
                        <span className="password-hint">Deve conter 8 caracteres, pelo menos uma letra maiúscula e um número.</span>
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmarPassword">Confirmar Password</label>
                        <input
                            type="password"
                            id="confirmarPassword"
                            required
                            value={confirmarPassword}
                            onChange={(e) => setConfirmarPassword(e.target.value)}
                            placeholder="Repete a password"
                        />
                    </div>

                    <button type="submit" className="btn-registo">Registar</button>
                </form>

                <p className="registo-footer">
                    Já tens uma conta? <Link to="/login">Faz Login</Link>
                </p>
            </div>
        </div>
    );
}
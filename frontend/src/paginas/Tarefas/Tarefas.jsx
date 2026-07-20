import { useState, useEffect } from 'react';
import './Tarefas.css';

export default function Tarefas() {
    const [tarefas, setTarefas] = useState([]);
    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');

    const carregarTarefas = async () => {
        try {
            const resposta = await fetch('http://localhost:8080/tarefas');
            if (resposta.ok) {
                const dados = await resposta.json();
                setTarefas(dados);
            }
        } catch (erro) {
            console.error('Erro ao procurar tarefas:', erro);
        }
    };

    useEffect(() => { carregarTarefas(); }, []);

    const criarTarefa = async (e) => {
        e.preventDefault();
        if (!titulo.trim()) return alert('O título é obrigatório!');
        const novaTarefa = { titulo, descricao, concluida: false };
        try {
            const resposta = await fetch('http://localhost:8080/tarefas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(novaTarefa),
            });
            if (resposta.ok) {
                setTitulo(''); setDescricao(''); carregarTarefas();
            }
        } catch (erro) { alert('Erro ao ligar ao servidor.'); }
    };

    const eliminarTarefa = async (id) => {
        try {
            const resposta = await fetch(`http://localhost:8080/tarefas/${id}`, { method: 'DELETE' });
            if (resposta.ok) carregarTarefas();
        } catch (erro) { alert('Erro ao eliminar.'); }
    };

    const alternarStatusTarefa = async (id) => {
        try {
            const resposta = await fetch(`http://localhost:8080/tarefas/${id}/alternar`, { method: 'PUT' });
            if (resposta.ok) carregarTarefas();
        } catch (erro) { alert('Erro ao atualizar.'); }
    };

    return (
        <div className="container-tarefas">
            <h1>Gestão de Tarefas</h1>
            <form onSubmit={criarTarefa} className="formulario-tarefas">
                <h3>Nova Tarefa</h3>
                <input type="text" placeholder="Título..." value={titulo} onChange={(e) => setTitulo(e.target.value)} className="input-texto" />
                <textarea placeholder="Descrição..." value={descricao} onChange={(e) => setDescricao(e.target.value)} className="textarea-texto" />
                <button type="submit" className="botao-submeter">Adicionar Tarefa</button>
            </form>
            <hr className="linha-divisoria" />
            <h3>As Minhas Tarefas</h3>
            {tarefas.length === 0 ? (
                <p className="texto-vazio">Nenhuma tarefa encontrada.</p>
            ) : (
                <ul className="lista-tarefas">
                    {tarefas.map((tarefa) => (
                        <li key={tarefa.id} className="item-tarefa">
                            <div className="conteudo-tarefa">
                                <input type="checkbox" checked={tarefa.concluida} onChange={() => alternarStatusTarefa(tarefa.id)} className="checkbox-tarefa" />
                                <div className={tarefa.concluida ? "tarefa-concluida" : ""}>
                                    <strong className="titulo-tarefa">{tarefa.titulo}</strong>
                                    <p className="descricao-tarefa">{tarefa.descricao}</p>
                                </div>
                            </div>
                            <button onClick={() => eliminarTarefa(tarefa.id)} className="botao-eliminar">Eliminar</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
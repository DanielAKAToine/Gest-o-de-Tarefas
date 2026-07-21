import { useState, useEffect } from 'react';
import './Tarefas.css';

const CATEGORIAS = [
    { id: 'TODAS', nome: 'Todas' },
    { id: 'DOMESTICA', nome: '🏠 Doméstica' },
    { id: 'TRABALHO', nome: '💼 Trabalho' },
    { id: 'PAGAMENTO', nome: '💳 Pagamentos' },
    { id: 'ESTUDOS', nome: '📚 Estudos' },
    { id: 'PESSOAL', nome: '👤 Pessoal' },
    { id: 'OUTRO', nome: '📌 Outro' }
];

export default function Tarefas() {
    const [tarefas, setTarefas] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [categoria, setCategoria] = useState('DOMESTICA');
    const [filtroCategoria, setFiltroCategoria] = useState('TODAS');

    useEffect(() => {
        carregarTarefas();
    }, []);

    const carregarTarefas = async () => {
        try {
            const res = await fetch('http://localhost:8080/api/tarefas');
            if (res.ok) {
                const dados = await res.json();
                setTarefas(dados);
            } else {
                console.error("Erro ao carregar tarefas:", res.status);
            }
        } catch (erro) {
            console.error("Erro de rede ao carregar tarefas:", erro);
        }
    };

    const handleAdicionarTarefa = async (e) => {
        e.preventDefault();
        if (!titulo.trim()) return;

        const novaTarefa = {
            titulo,
            descricao,
            categoria,
            status: 'PENDENTE'
        };

        try {
            const res = await fetch('http://localhost:8080/api/tarefas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(novaTarefa)
            });

            if (res.ok) {
                setTitulo('');
                setDescricao('');
                setCategoria('DOMESTICA');
                setIsModalOpen(false);
                carregarTarefas();
            } else {
                console.error("Erro do servidor ao guardar:", res.status);
            }
        } catch (erro) {
            console.error("Erro ao adicionar tarefa:", erro);
        }
    };

    const handleMudarStatus = async (tarefa, novoStatus) => {
        try {
            const tarefaAtualizada = { ...tarefa, status: novoStatus };
            const res = await fetch(`http://localhost:8080/api/tarefas/${tarefa.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(tarefaAtualizada)
            });

            if (res.ok) {
                carregarTarefas();
            }
        } catch (erro) {
            console.error("Erro ao atualizar status:", erro);
        }
    };

    const handleEliminar = async (id) => {
        try {
            const res = await fetch(`http://localhost:8080/api/tarefas/${id}`, {
                method: 'DELETE'
            });
            if (res.ok) carregarTarefas();
        } catch (erro) {
            console.error("Erro ao eliminar tarefa:", erro);
        }
    };

    const tarefasFiltradas = tarefas.filter(t =>
        filtroCategoria === 'TODAS' || t.categoria === filtroCategoria
    );

    return (
        <div className="tarefas-container">
            <div className="header-tarefas">
                <h2>Gestão de Tarefas</h2>
                <button
                    className="btn-nova-tarefa"
                    onClick={() => setIsModalOpen(true)}
                >
                    + Nova Tarefa
                </button>
            </div>

            {isModalOpen && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Nova Tarefa</h3>
                            <button
                                className="btn-fechar"
                                onClick={() => setIsModalOpen(false)}
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleAdicionarTarefa} className="form-tarefa-modal">
                            <input
                                type="text"
                                placeholder="Título da tarefa..."
                                value={titulo}
                                onChange={(e) => setTitulo(e.target.value)}
                                required
                            />

                            <textarea
                                placeholder="Descrição..."
                                value={descricao}
                                onChange={(e) => setDescricao(e.target.value)}
                            />

                            <div className="form-row">
                                <label>Tipo de Tarefa:</label>
                                <select
                                    value={categoria}
                                    onChange={(e) => setCategoria(e.target.value)}
                                >
                                    {CATEGORIAS.filter(c => c.id !== 'TODAS').map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.nome}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="modal-actions">
                                <button
                                    type="button"
                                    className="btn-cancelar"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Cancelar
                                </button>
                                <button type="submit" className="btn-adicionar">
                                    Adicionar Tarefa
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="filtros-container">
                <span>Organizar por Categoria:</span>
                <div className="botoes-filtro">
                    {CATEGORIAS.map(cat => (
                        <button
                            key={cat.id}
                            className={`btn-filtro ${filtroCategoria === cat.id ? 'ativo' : ''}`}
                            onClick={() => setFiltroCategoria(cat.id)}
                        >
                            {cat.nome}
                        </button>
                    ))}
                </div>
            </div>

            <div className="lista-tarefas">
                <h3>As Minhas Tarefas ({tarefasFiltradas.length})</h3>

                {tarefasFiltradas.length === 0 ? (
                    <p className="sem-tarefas">Nenhuma tarefa encontrada nesta categoria.</p>
                ) : (
                    tarefasFiltradas.map(t => (
                        <div key={t.id} className={`card-tarefa status-${t.status?.toLowerCase()}`}>
                            <div className="card-header">
                                <span className={`badge-categoria cat-${t.categoria?.toLowerCase()}`}>
                                    {CATEGORIAS.find(c => c.id === t.categoria)?.nome || t.categoria}
                                </span>

                                <select
                                    className={`select-status status-${t.status?.toLowerCase()}`}
                                    value={t.status || 'PENDENTE'}
                                    onChange={(e) => handleMudarStatus(t, e.target.value)}
                                >
                                    <option value="PENDENTE">⏳ Pendente</option>
                                    <option value="EM_PROGRESSO">⚙️ Em Tratamento</option>
                                    <option value="CONCLUIDA">✅ Concluída</option>
                                </select>
                            </div>

                            <h4 className={t.status === 'CONCLUIDA' ? 'concluida-texto' : ''}>{t.titulo}</h4>
                            <p className="descricao">{t.descricao}</p>

                            <div className="card-footer">
                                <button onClick={() => handleEliminar(t.id)} className="btn-eliminar">Eliminar</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
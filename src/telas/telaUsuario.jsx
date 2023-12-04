import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { buscarUsuarios, adicionarUsuario } from '../redux/usuarioReducer';
import { Link } from 'react-router-dom';

export default function TelaUsuario() {
    const dispatch = useDispatch();
    const { estado, mensagem, usuarios } = useSelector(state => state.usuario);
    const [novoUsuario, setNovoUsuario] = useState({
        nickname: '',
        urlAvatar: '',
    });

    useEffect(() => {
        console.log('Iniciando o useEffect');
        dispatch(buscarUsuarios());
    }, [dispatch]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNovoUsuario(prevUsuario => ({
            ...prevUsuario,
            [name]: value,
        }));
    };

    const handleAdicionarUsuario = () => {
        console.log(novoUsuario);
        dispatch(adicionarUsuario(novoUsuario));
        setNovoUsuario({
            nickname: '',
            urlAvatar: '',
        });
    };

    console.log('Estado Atual:', estado);
    if (estado === 1) {
        console.log('Renderizando Lista de Usuários');
        return (
            <div>
                <h1>Usuários:</h1>
                <ul>
                    {usuarios.map(usuario => (
                        <li key={usuario.id}>{usuario.nickname}</li>
                    ))}
                </ul>

                <div>
                    <h2>Adicionar Novo Usuário</h2>
                    <label>Nickname:</label>
                    <input
                        type="text"
                        name="nickname"
                        value={novoUsuario.nickname}
                        onChange={handleInputChange}
                    />
                    <br />
                    <label>URL Avatar:</label>
                    <input
                        type="text"
                        name="urlAvatar"
                        value={novoUsuario.urlAvatar}
                        onChange={handleInputChange}
                    />
                    <br />
                    <button onClick={handleAdicionarUsuario}>Adicionar Usuário</button>
                </div>
                <Link to="/">
                    <button>Voltar</button>
                </Link>
            </div>
        );
    } else if (estado === 2) {
        console.log('Renderizando "Carregando..."');
        return <p>Carregando...</p>;
    } else if (estado === 3) {
        console.log('Renderizando "Erro"', mensagem);
        return <p>Erro: {mensagem}</p>;
    } else {
        console.log('Estado não reconhecido:', estado);
        return null;
    }
}

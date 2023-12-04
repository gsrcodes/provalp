import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { buscarMensagens, adicionarMensagem } from '../redux/mensagemReducer';
import { buscarUsuarios } from '../redux/usuarioReducer';

export default function TelaMensagem() {
  const dispatch = useDispatch();
  const { estado: estadoMensagens, mensagem, mensagens } = useSelector(state => state.mensagem);
  const { estado: estadoUsuarios, usuarios } = useSelector(state => state.usuario);
  const [novaMensagem, setNovaMensagem] = useState({ mensagem: '', usuarioId: ''});

  useEffect(() => {
    console.log('Iniciando o useEffect');
    dispatch(buscarMensagens());
    dispatch(buscarUsuarios());
  }, [dispatch]);

  console.log('Estado Atual Mensagens:', estadoMensagens);
  console.log('Estado Atual Usuários:', estadoUsuarios);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNovaMensagem(prevMensagem => ({
      ...prevMensagem,
      [name]: name === "usuarioId" ? parseInt(value) : value,
    }));
  };  

  const handleEnviarMensagem = () => {
    dispatch(adicionarMensagem(novaMensagem));
    setNovaMensagem({ mensagem: '', usuarioId: '' });
  };

  if (estadoMensagens === 1 && estadoUsuarios === 1) { // OCIOSO
    console.log('Renderizando Lista de Mensagens');
    return (
        <div>
            <h1>Mensagens:</h1>
            <ul>
            {mensagens.map(mensagem => (
                <li key={mensagem.id}>
                    {console.log(mensagem)}
                    {mensagem.usuario && (
                    <strong>{mensagem.usuario.nickname}:</strong>
                    )}{' '}
                    {mensagem.mensagem}
                </li>
            ))}
            </ul>
            <div>
            <h2>Enviar Mensagem:</h2>
            <label htmlFor="usuarioId">Escolha o Usuário:</label>
            <select
                id="usuarioId"
                name="usuarioId"
                value={novaMensagem.usuarioId}
                onChange={handleInputChange}
            >
                {usuarios.map(usuario => (
                <option key={usuario.id} value={usuario.id}>
                    {usuario.nickname}
                </option>
            ))}
            </select>
            <br />
            <label htmlFor="mensagem">Mensagem:</label>
            <input
                type="text"
                id="mensagem"
                name="mensagem"
                value={novaMensagem.mensagem}
                onChange={handleInputChange}
            />
            <br/>
                <button onClick={handleEnviarMensagem}>Enviar</button>
            </div>
            <Link to="/provalp2">
                <button>Voltar</button>
            </Link>
        </div>
    );
  } else if (estadoMensagens === 2 || estadoUsuarios === 2) {
    console.log('Renderizando "Carregando..."');
    return <p>Carregando...</p>;
  } else if (estadoMensagens === 3 || estadoUsuarios === 3) {
    console.log('Renderizando "Erro"', mensagem);
    return <p>Erro: {mensagem}</p>;
  } else {
    console.log('Estado não reconhecido:', estadoMensagens, estadoUsuarios);
    return null;
  }
}
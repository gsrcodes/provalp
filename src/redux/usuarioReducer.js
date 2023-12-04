import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ESTADO from '../recursos/estado';

const urlBase = 'https://backend-bcc-2-b.vercel.app/usuario';

export const buscarUsuarios = createAsyncThunk('usuario/buscarUsuarios', async (id = null) => {
    try {
        const url = id ? `${urlBase}/${id}` : urlBase;
        const resposta = await fetch(url, { method: 'GET' });
        const dados = await resposta.json();

        if (dados.status) {
            return {
                status: true,
                listaUsuarios: dados.listaUsuarios || [dados.usuario],
                mensagem: ''
            };
        } else {
            return {
                status: false,
                listaUsuarios: [],
                mensagem: 'Ocorreu um erro ao recuperar os usuários do servidor.'
            };
        }
    } catch (erro) {
        return {
            status: false,
            listaUsuarios: [],
            mensagem: 'Ocorreu um erro ao recuperar os usuários do servidor:' + erro.message
        };
    }
});


export const adicionarUsuario = createAsyncThunk('usuario/adicionar', async (usuario) => {
    try {
        const resposta = await fetch(urlBase, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(usuario)
        });
        if (!resposta.ok) {
            throw new Error('Erro ao adicionar o usuário.');
        }
        const dados = await resposta.json();
        return {
            status: dados.status,
            mensagem: dados.mensagem,
            usuario: { ...usuario, id: dados.id }
        };
    } catch (erro) {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao adicionar o usuário:' + erro.message,
            usuario
        };
    }
});


export const atualizarUsuario = createAsyncThunk('usuario/atualizar', async (usuario) => {
    const { id, nickname, urlAvatar } = usuario;
    const resposta = await fetch(`${urlBase}/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nickname, urlAvatar })
    }).catch(erro => {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao atualizar o usuário:' + erro.message
        };
    });

    if (resposta.ok) {
        const dados = await resposta.json();
        return {
            status: dados.status,
            mensagem: dados.mensagem,
            usuario
        };
    } else {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao atualizar o usuário.',
            usuario
        };
    }
});

export const removerUsuario = createAsyncThunk('usuario/remover', async (id) => {
    const resposta = await fetch(`${urlBase}/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    }).catch(erro => {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao remover o usuário:' + erro.message,
            id
        };
    });

    if (resposta.ok) {
        const dados = await resposta.json();
        return {
            status: dados.status,
            mensagem: dados.mensagem,
            id
        };
    } else {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao remover o usuário.',
            id
        };
    }
});

const initialState = {
    estado: ESTADO.OCIOSO,
    mensagem: "",
    usuarios: [],
};

const usuarioSlice = createSlice({
    name: 'usuario',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(buscarUsuarios.pending, (state) => {
                state.estado = ESTADO.PENDENTE;
                state.mensagem = "Buscando usuários...";
            })
            .addCase(buscarUsuarios.fulfilled, (state, action) => {
                if (action.payload.status) {
                    state.estado = ESTADO.OCIOSO;
                    state.mensagem = action.payload.mensagem;
                    state.usuarios = action.payload.listaUsuarios;
                } else {
                    state.estado = ESTADO.ERRO;
                    state.mensagem = action.payload.mensagem;
                }
            })
            .addCase(buscarUsuarios.rejected, (state, action) => {
                state.estado = ESTADO.ERRO;
                state.mensagem = action.error.message;
            })
            .addCase(adicionarUsuario.fulfilled, (state, action) => {
                state.estado = ESTADO.OCIOSO;
                state.usuarios.push(action.payload.usuario);
                state.mensagem = action.payload.mensagem;
            })
            .addCase(adicionarUsuario.pending, (state) => {
                state.estado = ESTADO.PENDENTE;
                state.mensagem = "Adicionando usuário...";
            })
            .addCase(adicionarUsuario.rejected, (state, action) => {
                state.mensagem = "Erro ao adicionar o usuário: " + action.error.message;
                state.estado = ESTADO.ERRO;
            })
            .addCase(atualizarUsuario.fulfilled, (state, action) => {
                state.estado = ESTADO.OCIOSO;
                const indice = state.usuarios.findIndex(user => user.id === action.payload.usuario.id);
                state.usuarios[indice] = action.payload.usuario;
                state.mensagem = action.payload.mensagem;
            })
            .addCase(atualizarUsuario.pending, (state) => {
                state.estado = ESTADO.PENDENTE;
                state.mensagem = "Atualizando usuário...";
            })
            .addCase(atualizarUsuario.rejected, (state, action) => {
                state.mensagem = "Erro ao atualizar o usuário: " + action.error.message;
                state.estado = ESTADO.ERRO;
            })
            .addCase(removerUsuario.fulfilled, (state, action) => {
                state.estado = ESTADO.OCIOSO;
                state.mensagem = action.payload.mensagem;
                state.usuarios = state.usuarios.filter(user => user.id !== action.payload.id);
            })
            .addCase(removerUsuario.pending, (state) => {
                state.estado = ESTADO.PENDENTE;
                state.mensagem = "Removendo usuário...";
            })
            .addCase(removerUsuario.rejected, (state, action) => {
                state.mensagem = "Erro ao remover o usuário: " + action.error.message;
                state.estado = ESTADO.ERRO;
            });
    }
});

export default usuarioSlice.reducer;
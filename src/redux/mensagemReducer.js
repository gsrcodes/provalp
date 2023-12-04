import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ESTADO from '../recursos/estado';
const urlBase = 'https://backend-bcc-2-b.vercel.app/mensagem';

export const buscarMensagens = createAsyncThunk('mensagem/buscarMensagens', async () => {
    try {
        const resposta = await fetch(urlBase, { method: 'GET' });
        const dados = await resposta.json();
        if (dados.status) {
            return {
                status: true,
                listaMensagens: dados.listaMensagens,
                mensagem: ''
            };
        } else {
            return {
                status: false,
                listaMensagens: [],
                mensagem: 'Ocorreu um erro ao recuperar as mensagens da base de dados.'
            };
        }
    } catch (erro) {
        return {
            status: false,
            listaMensagens: [],
            mensagem: 'Ocorreu um erro ao recuperar as mensagens da base de dados:' + erro.message
        };
    }
});

export const adicionarMensagem = createAsyncThunk('mensagem/adicionar', async (mensagem) => {
    try {
        mensagem.usuario = { id: mensagem.usuarioId };

        const resposta = await fetch(urlBase, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(mensagem)
        });

        if (!resposta.ok) {
            throw new Error('Erro ao adicionar a mensagem.');
        }

        const dados = await resposta.json();
        return {
            status: dados.status,
            mensagem: dados.mensagem,
            mensagem: { ...mensagem, id: dados.id }
        };
    } catch (erro) {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao adicionar a mensagem:' + erro.message,
            mensagem
        };
    }
});


export const atualizarLidoMensagem = createAsyncThunk('mensagem/atualizarLido', async (atualizacao) => {
    try {
        const resposta = await fetch(urlBase, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(atualizacao)
        });

        if (!resposta.ok) {
            throw new Error('Erro ao atualizar a mensagem.');
        }

        const dados = await resposta.json();
        return {
            status: dados.status,
            mensagem: dados.mensagem
        };
    } catch (erro) {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao atualizar a mensagem:' + erro.message
        };
    }
});

export const removerMensagem = createAsyncThunk('mensagem/remover', async (mensagem) => {
    try {
        const resposta = await fetch(urlBase, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(mensagem)
        });

        if (!resposta.ok) {
            throw new Error('Erro ao remover a mensagem.');
        }

        const dados = await resposta.json();
        return {
            status: dados.status,
            mensagem: dados.mensagem,
            mensagem
        };
    } catch (erro) {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao remover a mensagem:' + erro.message,
            mensagem
        };
    }
});

const initialState = {
    estado: ESTADO.OCIOSO,
    mensagem: "",
    mensagens: [],
};

const mensagemSlice = createSlice({
    name: 'mensagem',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(buscarMensagens.pending, (state, action) => {
                state.estado = ESTADO.PENDENTE;
                state.mensagem = "Buscando mensagens...";
            })
            .addCase(buscarMensagens.fulfilled, (state, action) => {
                if (action.payload.status) {
                    state.estado = ESTADO.OCIOSO;
                    state.mensagem = action.payload.mensagem;
                    state.mensagens = action.payload.listaMensagens;
                } else {
                    state.estado = ESTADO.ERRO;
                    state.mensagem = action.payload.mensagem;
                }
            })
            .addCase(buscarMensagens.rejected, (state, action) => {
                state.estado = ESTADO.ERRO;
                state.mensagem = action.error.message;
            })
            .addCase(adicionarMensagem.fulfilled, (state, action) => {
                state.estado = ESTADO.OCIOSO;
                state.mensagens.push(action.payload.mensagem);
                state.mensagem = action.payload.mensagem;
            })
            .addCase(adicionarMensagem.pending, (state, action) => {
                state.estado = ESTADO.PENDENTE;
                state.mensagem = "Adicionando mensagem...";
            })
            .addCase(adicionarMensagem.rejected, (state, action) => {
                state.mensagem = "Erro ao adicionar a mensagem: " + action.error.message;
                state.estado = ESTADO.ERRO;
            })
            .addCase(atualizarLidoMensagem.fulfilled, (state, action) => {
                state.estado = ESTADO.OCIOSO;
                const indice = state.mensagens.findIndex(mensagem => mensagem.id === action.payload.mensagem.id);
                state.mensagens[indice] = action.payload.mensagem;
                state.mensagem = action.payload.mensagem;
            })
            .addCase(atualizarLidoMensagem.pending, (state, action) => {
                state.estado = ESTADO.PENDENTE;
                state.mensagem = "Atualizando leitura da mensagem...";
            })
            .addCase(atualizarLidoMensagem.rejected, (state, action) => {
                state.mensagem = "Erro ao atualizar a leitura da mensagem: " + action.error.message;
                state.estado = ESTADO.ERRO;
            })
            .addCase(removerMensagem.fulfilled, (state, action) => {
                state.estado = ESTADO.OCIOSO;
                state.mensagem = action.payload.mensagem;
                state.mensagens = state.mensagens.filter(mensagem => mensagem.id !== action.payload.mensagem.id);
            })
            .addCase(removerMensagem.pending, (state, action) => {
                state.estado = ESTADO.PENDENTE;
                state.mensagem = "Removendo mensagem...";
            })
            .addCase(removerMensagem.rejected, (state, action) => {
                state.mensagem = "Erro ao remover a mensagem: " + action.error.message;
                state.estado = ESTADO.ERRO;
            });
    }
});

export default mensagemSlice.reducer;
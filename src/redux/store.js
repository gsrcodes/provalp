import { configureStore } from '@reduxjs/toolkit';
import usuarioSlice from './usuarioReducer';
import mensagemSlice from './mensagemReducer';

const store = configureStore({
  reducer: {
    usuario: usuarioSlice,
    mensagem: mensagemSlice, 
  },
});

export default store;
import TelaMenu from "./telas/telaMenu.jsx";
import Tela404 from "./telas/tela404.jsx";
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import store from "./redux/store";
import { Provider } from "react-redux";
import { ToastContainer} from "react-toastify";
import TelaMensagem from "./telas/telaMensagem.jsx";
import TelaUsuario from "./telas/telaUsuario.jsx";


function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/mensagem" element={<TelaMensagem />} />
            <Route path="/usuario" element={<TelaUsuario />} />
            <Route path="/provalp" element={<TelaMenu/>} />
            <Route path="*" element={<Tela404 />} />
          </Routes>
        </BrowserRouter>
      </Provider>
      <ToastContainer/>
    </div>
  );
}

export default App;
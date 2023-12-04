import React from 'react';
import { Link } from 'react-router-dom';

export default function TelaMenu(props) {
    return (
        <div>
            <h1>Menu</h1>
            <Link to="/mensagem">
                <button>Enviar mensagem</button>
            </Link>
            <Link to="/usuario">
                <button>Cadastrar usuario</button>
            </Link>
        </div>
    );
}

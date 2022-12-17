import "./App.css";
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import BaseHome from "./components/Home/BaseHome";
import Home from "./components/Home/Home/Home";
import Jogo from "./components/Home/Jogo/Jogo";
import Jogos from "./components/Home/Jogos/Jogos";
import NovoJogo from "./components/Home/NovoJogo/NovoJogo";
import Participante from "./components/Home/Participante/Participante";
import Participantes from "./components/Home/Participantes/Participantes";

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route element={<BaseHome />}>
                        <Route index element={<Home />} />
                        <Route path="/novoJogo" element={<NovoJogo />} />
                        <Route path="/jogos" element={<Jogos />} />
                        <Route path="/jogos/:id" element={<Jogo />} />
                        <Route path="/participantes" element={<Participantes />} />
                        <Route path="/participantes/:id" element={<Participante />} />
                        <Route path="*" element={<div>teste</div>} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;

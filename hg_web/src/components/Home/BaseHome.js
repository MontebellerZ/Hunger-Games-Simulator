import { Outlet, useNavigate } from "react-router-dom";
import Header from "../Header/Header";
// import Menu from "../Menu/Menu";
import "./BaseHome.css";
import Background from "../../imgs/greenforest.png";

function BaseHome({}) {
    return (
        <div id="BaseHome">
            <Header />

            <section id="BaseHomeOutlet">
                <Outlet />
            </section>
        </div>
    );
}

export default BaseHome;

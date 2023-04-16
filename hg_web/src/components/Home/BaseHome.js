import { Outlet } from "react-router-dom";
import Header from "../Header/Header";
import "./BaseHome.css";

function BaseHome() {
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

import Login from "./pages/login/Login.tsx";
import {Routes, Route, Outlet} from "react-router-dom";
import Home from "./pages/home/Home.tsx";
import Signup from "./pages/signup/Signup.tsx";

const App = ()=>{
    return(
        <Routes>
            <Route path="/" element={<Outlet/>}>

                {/*public routes*/}
                <Route index element={<Home/>}/>
                <Route path={"/login"} element={<Login/>}/>
                <Route path={"/signup"} element={<Signup/>}/>
            </Route>
        </Routes>
    )
}

export default App
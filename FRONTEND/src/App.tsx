import Login from "./pages/Login.tsx";
import {Routes, Route, Outlet} from "react-router-dom";
import Home from "./pages/Home.tsx";
import Signup from "./pages/Signup.tsx";
import RequiredAuth from "./features/auth/requiredAuth.tsx";
import DashBoard from "./pages/Dash.tsx";
import Notes from "./pages/Notes.tsx";
import Layout from "./components/Layout.tsx";

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Outlet/>}>
                {/*public routes*/}
                <Route index element={<Home/>}/>
                <Route path={"login"} element={<Login/>}/>
                <Route path={"signup"} element={<Signup/>}/>

                {/*normal people routes*/}
                <Route element={<RequiredAuth allowedRoles={['people', 'admin']}/>}>
                    <Route path={'dash'} element={<Layout/>}>
                        <Route index element={<DashBoard/>}/>

                        {/*normal people notes route*/}
                        <Route path={'notes'}>
                            <Route index element={<Notes/>}/>

                        </Route>


                        {/*admin routes*/}

                    </Route>
                </Route>
            </Route>
        </Routes>
    )
}

export default App
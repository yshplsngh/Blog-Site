import Login from "./pages/Login.tsx";
import {Routes, Route, Outlet} from "react-router-dom";
import Home from "./pages/Home.tsx";
import Signup from "./pages/Signup.tsx";
import RequiredAuth from "./features/auth/requiredAuth.tsx";
import DashBoard from "./pages/Dash.tsx";
import NotesList from "./pages/Notes/NotesList.tsx";
import Layout from "./components/Layout.tsx";
import Prefetch from "./features/auth/prefetch.tsx";
import EditNote from "./pages/Notes/EditNote.tsx";
import Error404 from "./pages/Error404.tsx";
import ViewNote from "./pages/Notes/ViewNote.tsx";

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Outlet/>}>
                {/*public routes*/}
                <Route index element={<Home/>}/>
                <Route path={"login"} element={<Login/>}/>
                <Route path={"signup"} element={<Signup/>}/>
                <Route element={<RequiredAuth allowedRoles={['people', 'admin']}/>}>
                    <Route element={<Prefetch/>}>
                        <Route path={'dash'} element={<Layout/>}>
                            <Route index element={<DashBoard/>}/>

                            {/*normal people notes route*/}
                            <Route path={'notes'}>
                                <Route index element={<NotesList/>}/>
                                <Route path={'edit/:noteId'} element={<EditNote/>}/>
                                <Route path={'view/:noteId'} element={<ViewNote/>}/>
                            </Route>
                            {/*admin routes*/}

                        </Route>

                    </Route>
                </Route>
                <Route path={'*'} element={<Error404/>}/>
            </Route>
        </Routes>
    )
}

export default App
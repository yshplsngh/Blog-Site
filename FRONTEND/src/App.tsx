import {Routes, Route, Outlet} from "react-router-dom";
import {lazy, Suspense} from "react";
import {lazyJSXType} from "./routes.ts";
import {NoteRoutes} from './routes.ts'

import Login from "./pages/Login.tsx";
import RequiredAuth from "./features/auth/requiredAuth.tsx";
import Prefetch from "./features/auth/prefetch.tsx";
import Home from './pages/Home.tsx'
import Loading from "./components/Loading.tsx";

import UsersList from "./pages/Admin/UsersList.tsx";
import ViewUserDetail from "./pages/Admin/ViewUserDetail.tsx";
import ViewUserAllNotes from "./pages/Admin/ViewUserAllNotes.tsx";
const Signup:lazyJSXType = lazy(()=>import('./pages/Signup.tsx'))
const Layout:lazyJSXType = lazy(()=>import('./components/Layout.tsx'))
const DashBoard:lazyJSXType = lazy(()=>import('./pages/Dash.tsx'))
const Error404:lazyJSXType = lazy(()=>import('./pages/Error404.tsx'))
const AdminAuthorization:lazyJSXType = lazy(()=>import('./pages/AdminAuthorization.tsx'))


const App = () => {
    return (
        <Suspense fallback={<Loading/>}>
            <Routes>
                <Route path="/" element={<Outlet/>}>

                    {/*public routes*/}
                    <Route index element={<Home/>}/>
                    <Route path={"login"} element={<Login/>}/>
                    <Route path={"signup"} element={<Signup/>}/>
                    {/*protected routes*/}
                    <Route element={<RequiredAuth allowedRoles={['people', 'admin']}/>}>
                        <Route element={<Prefetch/>}>
                            <Route path={'dash'} element={<Layout/>}>
                                <Route index element={<DashBoard/>}/>

                                {/*normal people notes route*/}
                                <Route path={'notes'}>
                                    {NoteRoutes.map((Single)=>(
                                        <Route
                                            key={Single.path}
                                            element={<Single.element/>}
                                            {...(Single.path.length === 0 ? { index: true } : { path: Single.path })}
                                        />
                                    ))}
                                </Route>

                                {/*admin routes*/}
                                <Route element={<RequiredAuth allowedRoles={['admin']}/>}>
                                    <Route path={'users'} element={<UsersList/>}/>
                                    <Route path={'users/detail/viewAllNotes/:userId'} element={<ViewUserAllNotes/>}/>
                                    <Route path={'users/detail/:userId'} element={<ViewUserDetail/>}/>
                                </Route>
                            </Route>
                        </Route>
                    </Route>
                    <Route path={'/Restricted'} element={<AdminAuthorization/>}/>
                    <Route path={'*'} element={<Error404/>}/>
                </Route>
            </Routes>
        </Suspense>
    )
}

export default App
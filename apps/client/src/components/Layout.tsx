import Header from "./Header.tsx";
import { Outlet } from "react-router-dom";
import Footer from "./Footer.tsx";

const Layout = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};
export default Layout;

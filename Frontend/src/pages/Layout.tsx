import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
   <>
    <div>
   <h2 className="text-center mt-10 text-3xl text-blue-600">Asset Tracking System </h2>
    </div>
    <div className="container">
        <Outlet/>
    </div>
   </>
  );
};

export default Layout;

import { Outlet, useNavigation } from "react-router";


const MainLayout = () => {


  return (
    <div
      
      className="flex flex-col min-h-screen"
    >
      {/* Pass darkMode + setDarkMode to Navbar */}
      {/* <NavBar darkMode={darkMode} setDarkMode={setDarkMode} /> */}

      <div className="flex-grow">
        <Outlet />
      </div>

      {/* <Footer /> */}
    </div>
  );
};

export default MainLayout;

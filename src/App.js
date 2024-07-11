import { BrowserRouter, Route, useLocation, Routes } from "react-router-dom";
import "./App.css";
import Features from "./components/Culture/Culture";
import Team from "./pages/AboutPage/AboutPage";
import Home from "./pages/Home/Home";
import Contact from "./components/Contact/Contact";
import Login from "./pages/Login/Login";
import Installation from "./components/ServicesPages/Installactions/Installation";
import Consulting from "./components/ServicesPages/Consulting/Consulting";
import MonitoringService from "./components/ServicesPages/MonitoringServices/MonitoringServices";
import Dashboard from "./Dashboard/Dashboard";
import Support from "./pages/Support/Support";
import Achievements from "./pages/Achievements/Achievements";
import NotFound from "./pages/NotFound/Notfound";
//theme
import "primereact/resources/themes/lara-light-indigo/theme.css";
//core
import "primereact/resources/primereact.min.css";
import { Ecommerce,Customers,Bar,Pie,Line,Reports,} from "./Dashboard/pages";
import { ReportDatails } from "./Dashboard/pages/ReportDatails";
import { Mapa } from "./Dashboard/pages/Mapa";
import { CameraLiveView } from "./Dashboard/components/CameraLiveView";
import Cameras from "./Dashboard/pages/Cameras";
import { Stacked } from "./Dashboard/components";
import { FormPage } from "./components/FormPage/FormPage";
import { Users } from "./Dashboard/pages/Users";
import { Agents } from "./Dashboard/pages/Agents";
import { UserDatails } from "./Dashboard/pages/UserDatails";
import { Cases } from "./Dashboard/pages/Cases";
import { UserContext } from "./context/UserContext";
import  NewReport from "./Dashboard/pages/NewReport";
import EditReport from "./Dashboard/pages/EditReport";
import { useContext } from "react";
import PieLevels from "./Dashboard/pages/Charts/PieLevels";
import { Properties } from "./Dashboard/pages/Properties";
import React, { useEffect } from "react";
function App() {


// No activar wrapper, genera un error al entrar al dashboard, (apaga el equipo)
  // const Wrapper = ({ children }) => {
  //   const location = useLocation();
  //   useEffect(() => {
  //     document.documentElement.scrollTo(0, 0);
  //   }, [location.pathname]);
  //   return children;
  // };
  
  const {userLogged} = useContext(UserContext);
  return (
      <BrowserRouter>
      {/* <Wrapper> */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path={"/services"} element={<Features />} />
            <Route path={"/about"} element={<Team />} />
            <Route path={"/contact"} element={<Contact />} />
            <Route path={"/plan"} element={<FormPage />} />
            <Route path={"/login"} element={<Login />} />
            <Route path={"/monitoring"} element={<MonitoringService />} />
            <Route path={"/installations"} element={<Installation />} />
            <Route path={"/consulting"} element={<Consulting />} />
            <Route path={"/support"} element={<Support />} />
            <Route path={"/notfound"} element={<NotFound />} />
            <Route path={"/achievements"} element={<Achievements />} />
            <Route path="*" element={<NotFound/>}/>
            <Route path={"/dashboard"} element={userLogged ? <Dashboard /> : <Login />}>
              {/* Dashboard */}
               <Route path="/dashboard" element={<Ecommerce />} />
              <Route path="/dashboard/ecommerce" element={<Ecommerce />} />
              {/* Pages Dashboard*/}
              {/* Reportes*/}
              <Route path="/dashboard/reports" element={<Reports />} />
              <Route path="/dashboard/NewReport" element={<NewReport />} />
              <Route path="/dashboard/EditReport" element={<EditReport />} />
              <Route path="/dashboard/report-details/:id" element={<ReportDatails />} />
              
              {/* */}
              <Route path="/dashboard/cameras" element={<Cameras />} />
              <Route path="/dashboard/Notifications" element={<Customers />} />
              <Route path="/dashboard/mapa" element={<Mapa />} />
              <Route path="/dashboard/Users" element={<Users />} />
              <Route path="/dashboard/UserDetails" element={<UserDatails />} />
              <Route path="/dashboard/Agents" element={<Agents />} />
              <Route path="/dashboard/Cases" element={<Cases />} />
              <Route path="/dashboard/properties" element={<Properties />} />

              {/* Charts */}

             {/*  <Route path="/dashboard/line" element={<Line />} /> */}
              <Route path="/dashboard/bar" element={<Bar />} />
              <Route path="/dashboard/pie-reports" element={<Pie />} />
              <Route path="/dashboard/pie-levels" element={<PieLevels />} />
              <Route path="/dashboard/stacked" element={<Stacked />} />
              <Route path="/dashboard/camera/live-view" element={<CameraLiveView />}/> </Route>
          </Routes>
        {/* </Wrapper> */}
      </BrowserRouter>
  );
}

export default App;

  import { Route, Routes } from "react-router-dom";
  import AddRequest from "./pages/AddRequest";
  import Home from "./pages/Home";
  import Samp from "./Samp";
  import Login from "./pages/Login";
  import ViewTicket from "./pages/ViewTicket";
  import ExportStatement from "./pages/ExportStatement";
  import { ToastContainer } from "react-toastify";
  import Pnf from "./Pnf";
  import ProtectedRoute from "../services/ProtectedRoute";


  function App() {


    return (
      <>
        <Routes>
          <Route path="/" element={<Login/> } />
          <Route path="/Home" element={ <ProtectedRoute><Home/></ProtectedRoute> } />  
          <Route path="/addRequest" element={ <ProtectedRoute><AddRequest/></ProtectedRoute> } />
          <Route path="/viewticket/:id" element={ <ProtectedRoute><ViewTicket/></ProtectedRoute> } />
          <Route path="/export" element={ <ProtectedRoute><ExportStatement/></ProtectedRoute> } />
          <Route path="/*" element={ <ProtectedRoute><Pnf/></ProtectedRoute> } />
        </Routes>
        <ToastContainer />
      </>
    );
  }

  export default App;
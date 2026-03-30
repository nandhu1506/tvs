  import { Route, Routes } from "react-router-dom";
  import AddRequest from "./pages/AddRequest";
  import Home from "./pages/Home";
  import Login from "./pages/Login";
  import ViewTicket from "./pages/ViewTicket";
  import ExportStatement from "./pages/ExportStatement";
  import { ToastContainer } from "react-toastify";
  import Pnf from "./Pnf";
  import ProtectedRoute from "../services/ProtectedRoute";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyOTP from "./pages/VerifyOtp";



  function App() {


    return (
      <>
        <Routes>
          <Route path="/" element={<Login/> } />
          <Route path="/Home" element={ <ProtectedRoute><Home/></ProtectedRoute> } />  
          <Route path="/addRequest" element={ <ProtectedRoute><AddRequest/></ProtectedRoute> } />
          <Route path="/viewticket/:id" element={ <ProtectedRoute><ViewTicket/></ProtectedRoute> } />
          <Route path="/export" element={ <ProtectedRoute><ExportStatement/></ProtectedRoute> } />
          <Route path="/forgot-password" element={ <ForgotPassword/> } />
          <Route path="/verify-otp" element={ <VerifyOTP/> } />
          <Route path="/reset-password" element={ <ResetPassword/> } />
          <Route path="/*" element={ <ProtectedRoute><Pnf/></ProtectedRoute> } />
        </Routes>
        <ToastContainer />
      </>
    );
  }

  export default App;
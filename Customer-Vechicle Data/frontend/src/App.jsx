import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from './Pages/Home';
import ViewCustomers from './Pages/ViewCustomers';
import ViewVehicles from './Pages/ViewVehicle';
import ViewAllVehicles from './Pages/ViewAllVechicles';
import AddVehicle from './Pages/AddVehicle';
import AddCustomer from './Pages/AddCustomer';
import EditCustomer from './Pages/EditCustomer';
import EditVehicle from './Pages/EditVehicle';
import Login from './Pages/Login';
import Protected from './components/protected';
import VehicleReport from './Pages/VehicleReport';
import CustomerReport from './Pages/CustomerReport';
import Reports from './Pages/Reports';
import VehicleByCustomerReport from './Pages/VehicleByCustomerReport';
import Pnf from './Pages/Pnf';
import Users from './Pages/Users';
import AddUser from './Pages/AddUser';
import UserProfile from './Pages/UserProfile';
import EditProfile from './Pages/EditProfile';


function App() {
  return (
    <BrowserRouter>

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Protected><Home /></Protected>} />
        <Route path='/addcustomer' element={<Protected><AddCustomer /></Protected>} />
        <Route path="/customers" element={<Protected><ViewCustomers /></Protected>} />
        <Route path="/customers/edit/:id" element={<Protected><EditCustomer /></Protected>} />
        <Route path="/addvehicle" element={<Protected><AddVehicle /></Protected>} />
        <Route path="/vehicles" element={<Protected><ViewAllVehicles /></Protected>} />
        <Route path="/vehicles/edit/:id" element={<Protected><EditVehicle /></Protected>} />
        <Route path="/customers/:customerId/vehicles" element={<Protected><ViewVehicles /></Protected>} />
        <Route path='/reports' element={<Protected><Reports /></Protected>} />
        <Route path="/customerreports" element={<Protected><CustomerReport /></Protected>} />
        <Route path="/vehiclereports" element={<Protected><VehicleReport /></Protected>} />
        <Route path="/reports/vehiclesbycustomer" element={<Protected><VehicleByCustomerReport /></Protected>} />
        <Route path='/users' element={<Protected><Users/></Protected>}/>
        <Route path='/users/add' element={<Protected><AddUser/></Protected>}/>
        <Route path='/profile' element={<Protected><UserProfile/></Protected>}/>
        <Route path='/profile/edit' element={<Protected><EditProfile></EditProfile></Protected>}/>
        <Route path='/*' element={<Pnf />} />

      </Routes>

      <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} newestOnTop={true}
            closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />

    </BrowserRouter>
  );
}

export default App;
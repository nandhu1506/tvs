import { Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
const ToastContainer = lazy(() =>
  import("react-toastify").then(module => ({
    default: module.ToastContainer
  }))
);
const ProtectedRoute = lazy(()=>import("../services/ProtectedRoute")) ;
const AddRequest = lazy(() => import("./pages/AddRequest"));
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const ViewTicket = lazy(() => import("./pages/ViewTicket"));
const ExportStatement = lazy(() => import("./pages/ExportStatement"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const VerifyOTP = lazy(() => import("./pages/VerifyOtp"));
const Pnf = lazy(() => import("./Pnf"));


const Loader = () => (
  <div className="flex justify-center items-center h-screen">
    Loading...
  </div>
);

function App() {
  return (
    <>
        <Routes>
          
          <Route path="/" element={
            <Suspense fallback={<Loader />}>
              <Login />
              </Suspense>
            } />
          
          <Route path="/home" element={
            <Suspense fallback={<Loader />}>
              <ProtectedRoute><Home /></ProtectedRoute>
            </Suspense>
          } />

          <Route path="/addRequest" element={
            <Suspense fallback={<Loader />}>
              <ProtectedRoute><AddRequest /></ProtectedRoute>
            </Suspense>
          } />

          <Route path="/viewticket/:id" element={
            <Suspense fallback={<Loader />}>
              <ProtectedRoute><ViewTicket /></ProtectedRoute>
            </Suspense>
          } />

          <Route path="/export" element={
            <Suspense fallback={<Loader />}>
              <ProtectedRoute><ExportStatement /></ProtectedRoute>
            </Suspense>
          } />

          <Route path="/forgot-password" element={
            <Suspense fallback={<Loader />}>
              <ForgotPassword />
            </Suspense>
          } />
          <Route path="/verify-otp" element={
            <Suspense fallback={<Loader />}>
              <VerifyOTP />
            </Suspense>
          } />
          <Route path="/reset-password" element={
            <Suspense fallback={<Loader />}>
              <ResetPassword />
            </Suspense>
          } />

          <Route path="*" element={
           <Pnf />
          } />
        </Routes>
      
      <Suspense fallback={null}>
        <ToastContainer />
      </Suspense>
    </>
  );
}

export default App;
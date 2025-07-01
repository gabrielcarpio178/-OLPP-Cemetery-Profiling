import UserAccess from "./components/UserAccess";
import Dashboard from "./components/Dashboard";
import Groups from "./components/Groups";
import Login from "./components/Login"
import Payment from "./components/Payment";
import Settings from "./components/Settings";
import ProtectedRoutes from "./components/util/ProtectedRoute";
import { BrowserRouter, Routes, Route } from "react-router";
import MasterList from "./components/MasterList";
import Records from "./components/subpage/Records"
import History from "./components/subpage/History"
import CoverPage from "./components/CoverPage";
function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CoverPage />} />
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoutes/>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/groups" element={<Groups />} />
            <Route path="/payment" element={<Payment/>} >
              <Route path="records" element={<Records/>}/>
              <Route path="history" element={<History/>}/>
            </Route>
            <Route path="/settings" element={<Settings />} />
            <Route path="/user_access" element={<UserAccess />} />
            <Route path="/master_list" element={<MasterList />} />
          </Route>
        </Routes>
      </BrowserRouter>  
    </>
  )
}

export default App

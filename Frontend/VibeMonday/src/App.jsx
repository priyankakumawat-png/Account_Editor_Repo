

import { BrowserRouter, Route, Routes, } from "react-router-dom";
import { Box } from "@vibe/core";
import NavBar from "./Components/Navbar/NavBar.jsx";
import MenuBar from "./Components/Navbar/MenuBar.jsx";
import './App.css'
import CustomerList from "./Components/Customer/CustomerList.jsx";
import PlanAndDetails from "./Components/Plans&Detail/PlanAndDetails.jsx";
import CustomerDetail from "./Components/Customer/CustomerDetail.jsx";
import EmailCenter from "./Components/EmailCenter/EmailCenter.jsx";
import SignIn from "./Components/Login/SignIn.jsx";
import CreateNewEmail from "./Components/EmailCenter/CreateNewEmail.jsx";
import UpdateEmail from "./Components/EmailCenter/UpdateEmail.jsx";
import CustomerEmailTemplate from './Components/EmailCenter/CustomerEmailTemplate.jsx'
// import Home from "./Home.jsx";

import ProtectedRoute from "./ProtectedRoute.jsx";
import ProtectedLayout from "./ProtectedLayout.jsx";
import EmailMarketing from "./Components/EmailCenter/EmailMarketing.jsx";
function App() {



  return (

    <Box style={{ height: "auto", width: "100%", backgroundColor: "#F6F7FB" }} className='home-conti'>

      {/* <NavBar /> */}




      {/* <Box style={{ display: "flex", gap: "10px", padding: "20px" }}> */}
        {/* <MenuBar /> */}

        {/* <Box style={{ flex: 1, padding: "24px", background: "#fff", minHeight: "100vh" }} > */}
          <BrowserRouter>
            <Routes>
              {/* Public */}
              <Route path="/signin" element={<SignIn />} />

              {/* Protected */}
              <Route element={<ProtectedRoute />}>
                <Route element={<ProtectedLayout />}>
                  <Route path="/" element={<CustomerList />} />
                  <Route path="/plananddetails" element={<PlanAndDetails />} />
                  <Route path="/customerdetails/:id" element={<CustomerDetail />} />
                  <Route path="/emailcenter" element={<EmailCenter />} />
                  <Route path="/createnewemail" element={<CreateNewEmail />} />
                  <Route path="/updateemail/:id" element={<UpdateEmail />} />
                  <Route path="/customeremailtemplate" element={<CustomerEmailTemplate />} />
                  <Route path="/emailmarketing" element={<EmailMarketing />} />
                </Route>
              </Route>
            </Routes>
          </BrowserRouter>
        </Box>
      // </Box>
    // </Box>





  );
}
export default App;
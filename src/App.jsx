import { useState } from 'react'

import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './Pages/Home'
import Header from './Components/Header'
import Footer from './Components/Footer'
import Donors from './Pages/Donors'

import Login from './Pages/Login'
import Register from './Pages/Register'
import BloodRequest from './Pages/BloodRequest'
import DonorResterForm from './Pages/DonorRegisterForm'
import AllRequests from './Pages/AllRequests'
import DashBoardPage from './Admin-Pages/DashBoardPage'
import ApprovalPage from './Admin-Pages/ApprovalPage'
import DonorsPage from './Admin-Pages/DonorsPage'
import { ToastContainer } from 'react-toastify'
import NotFound from './Pages/NotFound'
import ProfilePage from './Pages/ProfilePage'
import DonorProfile from './Pages/DonorProfile'




function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Routes>
      <Route path={'/'} element={<Home/>}></Route>
      <Route path={'/header'} element={<Header/>}></Route>
      <Route path={'/donors'} element={<Donors/>}></Route>
      <Route path={'/all-request'} element={<AllRequests/>}></Route>
    
      <Route path={'/footer'} element={<Footer/>}></Route>
      <Route path={'/login'} element={<Login/>}></Route>
      
      <Route path={'/request'} element={<BloodRequest/>}></Route>
      <Route path={'/donor-register'} element={<DonorResterForm/>}></Route>
       <Route path="/register" element={<Register/>} />
       {/* userprofile */}
       <Route path='/donorProfile/:id' element={<DonorProfile/>}></Route>
       <Route path='/profile' element={<ProfilePage/>}></Route>

       {/* admin */}

         <Route path="/admin" element={<DashBoardPage/>} />
         <Route path="/admin-approval" element={<ApprovalPage/>} />
         <Route path="/admin-donors" element={<DonorsPage/>} />

    {/* page not found */}
     <Route path="/*" element={<NotFound/>} />

    </Routes>
    <ToastContainer position="top-right" autoClose={2000} />
      
    </>
  )
}

export default App

import LandingPage from '@/components/LandingPage'
import AdminDashboard from '@/Pages/Admin/AdminDashboard'
import AdminHomePage from '@/Pages/Admin/AdminHomePage'
import AdminLogin from '@/Pages/Admin/AdminLogin'
import AdminProfile from '@/Pages/Admin/AdminProfile'
import AdminRegister from '@/Pages/Admin/AdminRegister'
import Analytics from '@/Pages/Admin/Analytics'
import IssueManagement from '@/Pages/Admin/IssueManagement'
import CitizenDashboard from '@/Pages/Citizen/CitizenDashboard'
import CitizenHomePage from '@/Pages/Citizen/CitizenHomePage'
import CitizenLogin from '@/Pages/Citizen/CitizenLogin'
import CitizenProfile from '@/Pages/Citizen/CitizenProfile'
import CitizenRegister from '@/Pages/Citizen/CitizenRegister'
import GovtSchemesPage from '@/Pages/Citizen/GovtSchemesPage'
import NearbyIssuesMap from '@/Pages/Citizen/NearbyIssuesMap'
import ReportIssue from '@/Pages/Citizen/ReportIssue'
import TrackIssue from '@/Pages/Citizen/TrackIssue'
import React from 'react'
import { Route, Routes } from 'react-router-dom'

const AppRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<LandingPage/>}/>
        <Route path='/citizenhome' element={<CitizenHomePage/>}/>
         <Route path='/citizenlogin' element={<CitizenLogin/>}/>
          <Route path='/citizenregister' element={<CitizenRegister/>}/>
          <Route path='/citizendashboard' element={<CitizenDashboard/>}/>
        <Route path='/citizenprofile' element={<CitizenProfile/>}/>
        <Route path='/govtscheme' element={<GovtSchemesPage/>}/>
        <Route path='/nearbyissues' element={<NearbyIssuesMap/>}/>
        <Route path='/reportissue' element={<ReportIssue/>}/>
        <Route path='/trackissue' element={<TrackIssue/>}/>


        {/* Admin Routes */}
        <Route path='/adminhome' element={<AdminHomePage/>}/>
         <Route path='/adminlogin' element={<AdminLogin/>}/>
          <Route path='/adminregister' element={<AdminRegister/>}/>
        <Route path='/admindashboard' element={<AdminDashboard/>}/>
        <Route path='/adminprofile' element={<AdminProfile/>}/>
        <Route path='/issuemanagement' element={<IssueManagement/>}/>
        <Route path='/analytics' element={<Analytics/>}/>

      </Routes>
    </div>
  )
}

export default AppRoutes

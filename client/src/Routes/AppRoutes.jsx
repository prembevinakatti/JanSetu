import LandingPage from '@/components/LandingPage'
import AdminDashboard from '@/Pages/Admin/AdminDashboard'
import AdminHomePage from '@/Pages/Admin/AdminHomePage'
import AdminProfile from '@/Pages/Admin/AdminProfile'
import Analytics from '@/Pages/Admin/Analytics'
import IssueManagement from '@/Pages/Admin/IssueManagement'
import StatusUpdate from '@/Pages/Admin/StatusUpdate'
import CitizenHomePage from '@/Pages/Citizen/CitizenHomePage'
import CitizenProfile from '@/Pages/Citizen/CitizenProfile'
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
        <Route path='/citizenprofile' element={<CitizenProfile/>}/>
        <Route path='/govtscheme' element={<GovtSchemesPage/>}/>
        <Route path='/nearbyissues' element={<NearbyIssuesMap/>}/>
        <Route path='/reportissue' element={<ReportIssue/>}/>
        <Route path='/trackissue' element={<TrackIssue/>}/>
        <Route path='/adminhome' element={<AdminHomePage/>}/>
        <Route path='/admindashboard' element={<AdminDashboard/>}/>
        <Route path='/adminprofile' element={<AdminProfile/>}/>
        <Route path='/issuemanagement' element={<IssueManagement/>}/>
        <Route path='/analytics' element={<Analytics/>}/>
        <Route path='/statusupdate' element={<StatusUpdate/>}/>

      </Routes>
    </div>
  )
}

export default AppRoutes

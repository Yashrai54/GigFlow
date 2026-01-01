import React,{useState,useEffect} from 'react'
import { Router,Route,Routes } from 'react-router-dom'
import Signup from '../pages/Signup'
import Signin from '../pages/Signin'
import Home from '../pages/Home'
import ProtectedRoute from '../components/ProtectedRoute'
import Project from '../pages/Project'
import NearbyProjects from '../pages/NearbyProjects'

const App = () => (
     <Routes>
         <Route path='/signup' element={<Signup/>}></Route>
         <Route path='/signin' element={<Signin/>}></Route>
         <Route path='/' element={<ProtectedRoute>
          <Home/>
         </ProtectedRoute>}></Route>
         <Route path='/project' element={<ProtectedRoute>
            <Project/>
         </ProtectedRoute>}></Route>
         <Route path='/near' element={
            <ProtectedRoute>
                <NearbyProjects/>
            </ProtectedRoute>
         }>

         </Route>
     </Routes>
)

export default App
import React from 'react'
import { Routes,Route } from 'react-router-dom';
import NavBar from './Components/Navbar'
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './Components/Home.jsx';
import Login from './Components/Login.jsx';
// import Register from './Components/Register.jsx';
import Register from './Components/Register ';


 const App = () => {
  return (
    <div>
      <NavBar />
      {/* <Register /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />

      </Routes>
    </div>
  )
}

export default App

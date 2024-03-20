import React from 'react';
import { Link, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Student from './pages/Student';
import Mentor from './pages/Mentor';

function App() {

  const padding = {
    padding : '20px',
    fontSize : '24px'
  };

  return (
    <Router>

    <div>
      <Link to="/" style={padding} >Home</Link>
      <Link to="/student" style={padding} >Student</Link>
      <Link to="/mentor" style={padding} >Mentor</Link>
    </div>

    <Routes>
      <Route path='/' element = {<Home/>} />
      <Route path='/student' element = {<Student/>} />
      <Route path='/mentor' element = {<Mentor/>} />
    </Routes>

    </Router>
  )
}

export default App
import { useState } from 'react'
import { BrowserRouter as Router, Route ,Routes} from 'react-router-dom'
import Navbar from './NavBar'
import Welcome from './Welcome'
import SignIn from './signin'
import SignUp from './SignUp'
import Home from './Home'


function App() {
  

  return (
    <Router>
      <div className="App">
        <div className="content">
          <Navbar />
            <Routes>
              <Route exact path="/" element={<Welcome />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/home" element={<Home />} />
              <Route path="*" element={<h1>Not Found</h1>} />
            </Routes>
        </div>
      </div>
      </Router>
    
  )
}

export default App

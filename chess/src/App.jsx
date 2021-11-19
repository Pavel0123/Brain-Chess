import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import Navbar from './components/Navbar.jsx';
import HomeScreen from "./screens/HomeScreen.jsx";
import PlayScreen from "./screens/game/PlayScreen.jsx"
import './App.css';

function App() {
  let routes = (
    <Routes>
      <Route path="" element={<Navigate replace to="/home" />}/>
      <Route path="/*" element={<Navigate replace to="/404" />}/>

      <Route path="/home" element={<HomeScreen/>}/>
      <Route path="/play" element={<PlayScreen/>}/>
    </Routes>
  );
  return (
    <div className="App">
          <Router>
            <Navbar/>
                {routes}
           </Router>
    </div>
  );
}

export default App;

import React, {useEffect} from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import Navbar from './components/Navbar.jsx';
import FallbackScreen from "./screens/FallbackScreen.jsx"
import HomeScreen from "./screens/HomeScreen.jsx";
import PlayScreen from "./screens/game/PlayScreen.jsx"
import BoardScreen from "./screens/BoardsScreen.jsx"
import BoardsScreen from "./screens/game/BoardScreen.jsx"
import AcountScreen from "./screens/AccountScreen.jsx"
import './App.css';
import {login, logout, disconect, signIn, auth} from "./firebase"

function App() {

  useEffect(() => {
    if(auth?.currentUser) {
      login();
      disconect();
    }
  }, [auth?.currentUser]);

  const routes = (
    <Routes>
      <Route path="" element={<Navigate replace to="/home" />}/>
      <Route path="/*" element={<Navigate replace to="/404" />}/>
      
      <Route path="/404" element={<FallbackScreen/>}/>
      <Route path="/home" element={<HomeScreen/>}/>
      <Route path="/play" element={<PlayScreen/>}/>
      <Route path="/account" element={<AcountScreen/>}/>
      <Route path="/boards" element={<BoardScreen/>}/>
      <Route path="/board-creator-:id" element={<BoardsScreen/>}/>
    </Routes>
  );
  return (
    <div className="App">
          <Router>
            <Navbar/>
              <div className="container">
                {routes}
              </div>
           </Router>
    </div>
  );
}

export default App;

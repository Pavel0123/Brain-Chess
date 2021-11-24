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
import QueueScreen from "./screens/game/QueueScreen.jsx"
import './App.css';
import {login, logout, disconect, signIn, auth} from "./firebase"

function App() {

  useEffect(() => {
    if(auth?.currentUser) {
      login();
      disconect();
    }
  }, [auth?.currentUser]);


  //autorized routes
  const Queue = () => auth?.currentUser ? <QueueScreen/> : <Navigate replace to="/login" />;
  const Play = () => auth?.currentUser ? <PlayScreen/> : <Navigate replace to="/login" />;
  const Account = () => auth?.currentUser ? <AcountScreen/> : <Navigate replace to="/login" />;
  const Board = () => auth?.currentUser ? <BoardScreen/>: <Navigate replace to="/login" />;
  const BoardCreator = () => auth?.currentUser ? <BoardsScreen/> : <Navigate replace to="/login" />;

  //all routes
  const routes = (
    <Routes>
      <Route path="" element={<Navigate replace to="/home" />}/>
      <Route path="/*" element={<Navigate replace to="/404" />}/>
      
      <Route path="/404" element={<FallbackScreen/>}/>
      <Route path="/home" element={<HomeScreen/>}/>
  
      <Route path="/queue" element={<Queue/>}/>
      <Route path="/play" element={<Play/>}/>
      <Route path="/account" element={<Account/>}/>
      <Route path="/boards" element={<Board/>}/>
      <Route path="/board-creator-:id" element={<BoardCreator/>}/>
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

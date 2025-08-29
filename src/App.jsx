import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useEffect } from "react"
import Body from "./components/Body"
import Login from "./components/Login"
import Signup from "./components/Signup"
import Profile from "./components/Profile"
import { Provider } from "react-redux"
import appStore from "./utils/appstore"
import Feed from "./components/Feed"
import Requests from "./components/Requests"
import Connections from "./components/Connections"

function App() {
  // Disable right-click context menu
  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
      return false;
    };

    document.addEventListener('contextmenu', handleContextMenu);
    
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  return (
    <>
    <Provider store={appStore}>
        <BrowserRouter basename="/">
          <Routes>
            <Route path="/" element={<Body/>}>
              <Route path="/login" element={<Login/>}></Route>
              <Route path="/signup" element={<Signup/>}></Route>
              <Route path="/profile" element={<Profile/>}></Route>
              <Route path="/feed" element={<Feed/>}></Route>
              <Route path="/connections" element={<Connections/>}></Route>
              <Route path="/requestReview" element={<Requests/>}></Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  )
}

export default App

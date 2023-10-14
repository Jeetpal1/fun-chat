import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Chat from "./Component/Chat";
import Login from "./Component/Login";
import Sidebar from "./Component/Sidebar";
import { useStateValue } from "./StateProvider";

function App() {
  const [{ user }, dispatch] = useStateValue();
  return (
    // I am gonna use BEM naming convention to keep it clean 😉
    <div className="app">
      {!user ? (
        <h1>
          <Login />
        </h1>
      ) : (
        <>
        <h2 className="warning__message">Please rotate your mobile screeen. Website works in Landscape mode on phone screens. Alternatively, Open it in a pc.</h2>
          <div className="app_body">
            <Router>
              <Sidebar />
              <Routes>
                <Route
                  path="/rooms/:roomId"
                  element={
                    <>
                      <Chat />
                    </>
                  }
                />
                <Route path="/" element={<>{/* <Chat /> */}</>} />
              </Routes>
            </Router>
          </div>
        </>
      )}
    </div>
  );
}

export default App;

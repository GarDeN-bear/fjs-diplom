import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/common/Header";
import Menu from "./components/common/Menu";
import Main from "./components/Main";
import { AuthContextProvider } from "./components/context/auth/AuthContext";

function App() {
  return (
    <Router>
      <AuthContextProvider>
        <Header />
        <div className="container">
          <Menu />
          <Routes>
            <Route path="/*" element={<Main />} />
          </Routes>
        </div>
      </AuthContextProvider>
    </Router>
  );
}

export default App;

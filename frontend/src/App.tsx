import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/common/Header";
import Menu from "./components/common/Menu";
import Main from "./components/hotels/Main";

function App() {
  return (
    <Router>
      <Header />
      <div className="container">
        <Menu />
        <Routes>
          <Route path="/" element={<Main />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

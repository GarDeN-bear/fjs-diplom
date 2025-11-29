import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/common/Header";
import Menu from "./components/common/Menu";
import Main from "./components/Main";

import { EditProvider } from "./components/context/EditContext";
import { HotelsProvider } from "./components/context/HotelsContext";

function App() {
  return (
    <Router>
      <Header />
      <div className="container">
        <HotelsProvider>
          <EditProvider>
            <Menu />
            <Routes>
              <Route path="/*" element={<Main />} />
            </Routes>
          </EditProvider>
        </HotelsProvider>
      </div>
    </Router>
  );
}

export default App;

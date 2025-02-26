import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Registro1 from "../components/Registro1";
import RegistroNext from "../components/RegistroNext";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Registro1 />} />
        <Route path="/RegistroNext" element={<RegistroNext />} />
      </Routes>
    </Router>
  );
}

export default App;

import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import ClasificacionEquipos from "./components/ClasificacionEquipos";
import ClasificacionPilotos from "./components/ClasificacionPilotos";
import Comentarios from "./components/Comentarios";
import Crear from "./components/Crear";
import Dashboard from "./components/Dashboard";
import DatosPiloto from "./components/DatosPiloto";
import EditarPerfil from "./components/EditarPerfil";
import Guia from "./components/Guia";
import GuiaCircuitos from "./components/GuiaCircuitos";
import GuiaEquipos from "./components/GuiaEquipos";
import GuiaPilotos from "./components/GuiaPilotos";
import IniciarSesion from "./components/IniciarSesion";
import Inicio from "./components/Inicio";
import OtroPerfil from "./components/OtroPerfil";
import PerfilDatos from "./components/PerfilDatos";
import PerfilPublicaciones from "./components/PerfilPublicaciones";
import PublicacionesOtroUsuario from "./components/PublicacionesOtroUsuario";
import Registro1 from "./components/Registro1";
import RegistroNext from "./components/RegistroNext";
import Resultados from "./components/Resultados";
import { UsuarioProvider } from "./context/UsuarioContext";

const Layout = () => {
  return (
    <div style={{ display: "flex", flexDirection: "row", backgroundColor: "#15151E", height: "auto", width: "100vw" }}>
      <Dashboard />
      <div style={{ width: "2px", background: "rgba(255, 255, 255, 0.2)" }}></div>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "center", flex: 1, paddingTop: "2vh" }}>
        <Routes>
          <Route path="/Inicio" element={<Inicio />} />
          <Route path="/Crear" element={<Crear />} />
          <Route path="/Perfil" element={<PerfilDatos />} />
          <Route path="/Resultados" element={<Resultados />} />
          <Route path="/Clasificacion" element={<ClasificacionPilotos />} />
          <Route path="/Guia" element={<Guia />} />
          <Route path="/PerfilPublicaciones" element={<PerfilPublicaciones />} />
          <Route path="/ClasificacionEquipos" element={<ClasificacionEquipos />} />
          <Route path="/GuiaPilotos" element={<GuiaPilotos />} />
          <Route path="/GuiaEquipos" element={<GuiaEquipos />} />
          <Route path="/GuiaCircuitos" element={<GuiaCircuitos />} />
          <Route path="/EditarPerfil" element={<EditarPerfil />} />
          <Route path="/Comentarios" element={<Comentarios />} />
          <Route path="/OtroPerfil" element={<OtroPerfil />} />
          <Route path="/PublicacionesOtroUsuario" element={<PublicacionesOtroUsuario />} />
          <Route path="/DatosPiloto" element={<DatosPiloto />} />
        </Routes>
      </div>
    </div>
  );
};

function App() {
  return (
    <UsuarioProvider>
      <Router>
        <Routes>
          {/* Redirigir a / si está en la raíz */}
          <Route path="/" element={<Navigate to="/IniciarSesion" replace />} />

          {/* Rutas sin Dashboard */}
          <Route path="/IniciarSesion" element={<IniciarSesion />} />
          <Route path="/Registro1" element={<Registro1 />} />
          <Route path="/RegistroNext" element={<RegistroNext />} />

          {/* Rutas con Dashboard */}
          <Route path="/*" element={<Layout />} />
        </Routes>
      </Router>
    </UsuarioProvider>
  );
}

export default App;

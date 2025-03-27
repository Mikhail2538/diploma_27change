import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Main } from "./Pages/Main";
import { Login } from "./Pages/Login";
import { ProtectedRoute } from "./hooks/ProtectedRoute";
import { AdminPage } from "./Pages/AdminPage";
import { AuthProvider } from "./hooks/AuthProvider";
import { MovieSeance } from "./components/FilmSession";
import { TicketReservations } from "./components/TicketReservations";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Router basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route path="/*" element={<Navigate replace to="/" />} />
          <Route path="/" element={<Main />} />
          <Route path="/movies/:seanceId" element={<MovieSeance />} />
          <Route path="/booking-tickets" element={<TicketReservations />} />
          <Route
            path="/movies/edit"
            element={
              <ProtectedRoute>
                <AdminPage />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

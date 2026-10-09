import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import DashboardPage from './pages/Dashboard';
import FlightsPage from './pages/Flights';
import DelaysPage from './pages/Delays';
import PassengersPage from './pages/Passengers';
import RoutesPage from './pages/Routes';

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 flex flex-col overflow-hidden">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/flights" element={<FlightsPage />} />
            <Route path="/delays" element={<DelaysPage />} />
            <Route path="/passengers" element={<PassengersPage />} />
            <Route path="/routes" element={<RoutesPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

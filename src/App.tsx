import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { PlayerProfilePage } from './pages/PlayerProfilePage';
import { HistoryPage } from './pages/HistoryPage';
import { TrucoSetupPage } from './pages/truco/TrucoSetupPage';
import { TrucoMatchPage } from './pages/truco/TrucoMatchPage';
import { GeneralaSetupPage } from './pages/generala/GeneralaSetupPage';
import { GeneralaMatchPage } from './pages/generala/GeneralaMatchPage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/players/:playerId" element={<PlayerProfilePage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/truco/new" element={<TrucoSetupPage />} />
            <Route path="/truco/:matchId" element={<TrucoMatchPage />} />
            <Route path="/generala/new" element={<GeneralaSetupPage />} />
            <Route path="/generala/:matchId" element={<GeneralaMatchPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;

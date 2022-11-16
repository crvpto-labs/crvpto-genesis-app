import { 
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

import Home from './pages/Home'
import Token from "./pages/Token";


export default function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:tokenId/:phaseId" element={<Token />} />
        </Routes>
      </Router>
    </div>
  );
}


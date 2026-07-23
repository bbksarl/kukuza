import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductBrowser from './pages/ProductBrowser';
import ProductDetail from './pages/ProductDetail';
import Search from './pages/Search';

export const App = () => {
  const basename = window.location.pathname.startsWith('/catalog') ? '/catalog' : undefined;

  return (
    <Router basename={basename}>
      <Routes>
        <Route path="/" element={<ProductBrowser />} />
        <Route path="/product/:productId" element={<ProductDetail />} />
        <Route path="/search" element={<Search />} />
      </Routes>
    </Router>
  );
};

export default App;

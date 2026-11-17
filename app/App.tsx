import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Blog from './pages/Blog';
import Projects from './pages/Projects';
import About from './pages/About';
import { NotFound } from './pages/NotFound';
import { Post } from './pages/posts/Post';

// Only reached through the letters' QR code, so it ships in its own chunk with the sealed note.
const HeavenSent = lazy(() => import('./pages/HeavenSent').then((module) => ({ default: module.HeavenSent })));

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/blog'>
        <Route index element={<Blog />} />
        <Route path=':slug' element={<Post />} />
      </Route>
      <Route path='/projects' element={<Projects />} />
      <Route path='/about' element={<About />} />
      <Route
        path='/heaven-sent'
        element={
          <Suspense fallback={null}>
            <HeavenSent />
          </Suspense>
        }
      />
      <Route path='*' element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default App;

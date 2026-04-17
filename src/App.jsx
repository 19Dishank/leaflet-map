import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from './Login';
import Dashboard from './Dashboard';
import Map from './components/Map';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Map />} />
        {/* <Route path="/map" element={<Login />} /> */}
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
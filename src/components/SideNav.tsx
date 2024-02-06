import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './SideNav.scss';
import ToDo from './Todo';

interface SideNavProps {}

const SideNav: React.FC<SideNavProps> = () => {
  return (
    <Router>
      <div className="SideNav">
        <ul>
          <li className="SideNav__Locations">
            <Link to="/home">Home</Link>
          </li>
          <li className="SideNav__Locations">
            <Link to="/work">Work</Link>
          </li>
          <li className="SideNav__Locations">
            <Link to="/errands">Errands</Link>
          </li>
        </ul>
      </div>

      <Routes>
        <Route path="/home" element={<ToDo title="Home" environment="home" />} />
        <Route path="/work" element={<ToDo title="Work" environment="work" />} />
        <Route path="/errands" element={<ToDo title="Errands" environment="errands" />} />
      </Routes>
    </Router>
  );
};

export default SideNav;

import React, { useState } from 'react';
import Sidebar from "../components/Sidebar";
import '../styles/mainLayout.css'

function MainLayout() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <Sidebar />

    </div>
  );
}

export default MainLayout;

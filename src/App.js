import './App.css';
import { Line } from 'rc-progress';
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import RoomCode from './components/RoomCode';
import SendFile from './components/SendFile';
function App() {

  const [curCode, setCurCode] = useState(null)
  const [socketRef, setSocketRef] = useState(null)
  return (
    <div className="App">
      {(curCode) ?
        <SendFile curCode={curCode} socketRef={socketRef} />
        : <RoomCode setCurCode={setCurCode} setSocketRef={setSocketRef} />
      }

    </div>
  );
}

export default App;

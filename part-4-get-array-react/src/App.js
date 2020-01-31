import './App.css';

import { Line, LineChart } from 'recharts';

import React from 'react';

function App() {
  const data = [
    { name: 'Page A', uv: 400, pv: 2400, amt: 2400 },
    { name: 'Page B', uv: 400, pv: 300, amt: 300 },
    { name: 'Page c', uv: 300, pv: 100, amt: 100 },
    { name: 'Page c', uv: 300, pv: 100, amt: 200 }
  ];

  return (
    <div className='App'>
      <LineChart width={400} height={400} data={data}>
        <Line type='monotone' dataKey='uv' stroke='#8884d8' />
      </LineChart>
    </div>
  );
}

export default App;

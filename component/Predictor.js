import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [input, setInput] = useState('');
  const [prediction, setPrediction] = useState('');

  const handlePredict = async () => {
    try {
      const response = await axios.post('https://your-prediction-api-url.com', {
        input: input
      });
      setPrediction(response.data.prediction);
    } catch (error) {
      console.error('Prediction failed:', error);
    }
  };

  return (
    <div>
      <h1>Yield Predictor</h1>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter input..."
      />
      <button onClick={handlePredict}>Predict</button>
      {prediction && <p>Prediction: {prediction}</p>}
    </div>
  );
}

export default App;
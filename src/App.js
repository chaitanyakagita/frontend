import React, { useState } from 'react';
import Select from 'react-select';
import axios from 'axios';
import './App.css';

function App() {
  const [jsonInput, setJsonInput] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');
  const [selectedOptions, setSelectedOptions] = useState([]);

  const options = [
    { value: 'alphabets', label: 'Alphabets' },
    { value: 'numbers', label: 'Numbers' },
    { value: 'highest_alphabet', label: 'Highest Alphabet' },
  ];

  const handleSubmit = async () => {
    if (!isValidJson(jsonInput)) {
      setError('Invalid JSON format. Please correct it and try again.');
      setResponse(null);
      return;
    }

    try {
      const parsedJson = JSON.parse(jsonInput);
      const res = await axios.post('https://bajaj-finserv-assessment-neon.vercel.app/bfhl', parsedJson, {
        headers: { 'Content-Type': 'application/json' },
      });

      setResponse(res.data);
      setError('');
    } catch (err) {
      handleError(err);
      setResponse(null);
    }
  };

  const handleError = (err) => {
    if (err.response) {
      setError(`API Error: ${err.response.data.message || 'Unknown error'}`);
    } else if (err.request) {
      setError('No response received from the API');
    } else {
      setError(`Error: ${err.message}`);
    }
  };

  const isValidJson = (jsonString) => {
    try {
      JSON.parse(jsonString);
      return true;
    } catch (e) {
      return false;
    }
  };

  const filteredResponse = () => {
    if (!response || !selectedOptions.length) return null;

    let filteredData = '';

    if (selectedOptions.some(option => option.value === 'numbers')) {
      filteredData += `Numbers: ${response.numbers.join(', ')}\n`;
    }
    if (selectedOptions.some(option => option.value === 'alphabets')) {
      filteredData += `Alphabets: ${response.alphabets.join(', ')}\n`;
    }
    if (selectedOptions.some(option => option.value === 'highest_alphabet')) {
      filteredData += `Highest Alphabet: ${response.highest_alphabet}\n`;
    }

    return filteredData;
  };

  return (
    <div className="container">
      <h1 className="title">Chaitanya Kagita - AP21110011367</h1> 

      <div className="input-container">
        <label htmlFor="jsonInput">API Input</label>
        <textarea
          id="jsonInput"
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder="Enter JSON input here..."
        />
        <button onClick={handleSubmit}>Submit</button>
        {error && <p className="error">{error}</p>}
      </div>

      {response && (
        <div className="dropdown-container">
          <label>Multi Filter</label>
          <Select
            isMulti
            options={options}
            onChange={setSelectedOptions}
            className="react-select"
          />
        </div>
      )}

      {response && (
        <div className="filtered-response">
          <h3>Filtered Response</h3>
          <pre>{filteredResponse()}</pre>
        </div>
      )}
    </div>
  );
}

export default App;

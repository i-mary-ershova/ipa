import './App.css';
import React, { useState } from 'react';

function App() {
  const [inputText, setInputText] = useState('');
  const [transcription, setTranscription] = useState(''); // State for transcription

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };
  function handleChange(e) {
    setTranscription(e.target.value);
  }

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/transcription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputText }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Response from server:', data);
        fetchTranscription();     // Получаем транскрипцию
      } else {
        console.error('Error sending text:', response.statusText);    //консоль в вебе, на f12
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchTranscription = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/transcription');    // GET запрос к тому же эндпоинту
      if (response.ok) {
        const data = await response.json();
        setTranscription(data.text);        // Возвращаем транскрипцию из файла transcriptor.py
      } else {
        console.error('Error fetching transcription:', response.statusText);   //консоль в вебе, на f12
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (                           //HTML
    <div className="container">
      <div className="left-side">
        <div className="buttons">
          <button>Текст</button>
          <button>Аудио</button>
        </div>
        <textarea 
          className="input-field" 
          placeholder="Введите текст" 
          value={inputText}
          onChange={handleInputChange}>
        </textarea>
      </div>
      <div className="middle">
        <button className="middle-button"
        onClick={handleSubmit}>Перевести
        </button>
      </div>
      <div className="right-side">
        <textarea 
          className="input-field"
          value={transcription} // Step 4: Display fetched transcription
          onChange={handleChange} // чтобы ввод был возможен
          placeholder="Транскрипция">
        </textarea>
      </div>
    </div>
  );
}

export default App;

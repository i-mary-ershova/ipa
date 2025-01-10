// import React from 'react';
// import AudioTranscriber from './AudioUploader';

// function App() {
//     return (
//         <div className="App">
//             <AudioTranscriber />
//         </div>
//     );
// }

// export default App;


import './App.css';
import React, { useState, useRef } from 'react';
import axios from 'axios';


const ipaSymbols = [
    'ɐ','ɛ','ɪ','ɔ','ʊ','ə','ɨ','æ','ɜ','ɑ','ɒ','ʌ', 'ɵ', 'ʉ',
    
    'ʲ','ʷ', 'ɣ', 'ɫ', 'ʂ', 'ʃ', 'ʒ', 'ʐ', 'ʑ','ɕ', 'ʙ', 'ʦ', 'tɕ', 'ʔ',
    'ˈ', 'ˌ', '͜', '͡', 'ˑ', 'ː', '̞', '̟', '̪', '̯', '~'
  
  // Добавьте другие символы IPA по мере необходимости
];

function App() {
    const [isInputVisible, setIsInputVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [audioFile, setAudioFile] = useState(null);
    const [inputText, setInputText] = useState(''); // Текст для отправки на сервер
    const [transcription, setTranscription] = useState(''); // Транскрипция
    const inputRef = useRef(null); // Реф для поля ввода

    const toggleInput = () => {
        setIsInputVisible(!isInputVisible);
    };

    const handleFileChange = (event) => {
        setAudioFile(event.target.files[0]);
    };
    
    const handleUpload = async () => {
        if (!audioFile) {
            alert('Пожалуйста, выберите аудиофайл!');
            return;
        }

        const formData = new FormData();
        formData.append('audio', audioFile);

        try {
            const response = await axios.post('http://localhost:5000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setInputText(response.data.inputText);
        } catch (error) {
            console.error('Ошибка при загрузке файла:', error);
            alert('Произошла ошибка при загрузке файла.');
        }
    };

    

    const addSymbolToInput = (symbol) => {
        const input = inputRef.current;
        const start = input.selectionStart;
        const end = input.selectionEnd;
        const newValue = transcription.substring(0, start) + symbol + transcription.substring(end);
        setTranscription(newValue);
        setTimeout(() => {
        input.setSelectionRange(start + symbol.length, start + symbol.length);
        input.focus();
        }, 0);
    };

    const handleInputChange = (event) => {
        setInputText(event.target.value);
    };

    const handleChange = (e) => {
        setTranscription(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Устанавливаем состояние загрузки в true
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
            fetchTranscription(); // Получаем транскрипцию
        } else {
            console.error('Error sending text:', response.statusText);
        }
        } catch (error) {
        console.error('Error:', error);
        } finally {
        setIsLoading(false); // Сбрасываем состояние загрузки после завершения
        }
    };

    const fetchTranscription = async () => {
        try {
        const response = await fetch('http://localhost:5000/api/transcription');
        if (response.ok) {
            const data = await response.json();
            setTranscription(data.text); // Возвращаем транскрипцию из файла transcriptor.py
        } else {
            console.error('Error fetching transcription:', response.statusText);
        }
        } catch (error) {
        console.error('Error:', error);
        }
    };

    return (
        <div className="app">

        {isInputVisible && (
            <div className="input-container">
            <div className="ipa-keyboard">
                {ipaSymbols.map((symbol, index) => (
                <button 
                    key={index} 
                    onClick={() => addSymbolToInput(symbol)}
                    className="ipa-button"
                >
                    {symbol}
                </button>
                ))}
            </div>
            </div>
        )}

        <div className="container">
            <div className="left-side">
            <div className="buttons">
                <button>Текст</button>
                <button>Аудио</button>
            <input type="file" accept="audio/*" onChange={handleFileChange}/>
            <button onClick={handleUpload}>Транскрипция аудиофайла</button>
            </div>
            <textarea 
                className="input-field" 
                placeholder="Введите текст" 
                value={inputText}
                onChange={handleInputChange}>
            </textarea>
            </div>
            <div className="middle">
            <button className="middle-button" onClick={handleSubmit}
                disabled={isLoading} // Делаем кнопку неактивной во время загрузки
            >
                {isLoading ? 'Ожидайте...' : 'Перевести'}
            </button>
            </div>
            <div className="right-side">
            <textarea 
                className="input-field"
                value={transcription} // Step 4: Display fetched transcription
                ref={inputRef} // Привязываем реф к полю ввода
                onChange={handleChange} // чтобы ввод был возможен
                placeholder="Транскрипция">
            </textarea>
            </div>
        </div>
            <button 
            className={`toggle-button ${isInputVisible ? 'above-keyboard' : 'bottom-right'}`}
            onClick={toggleInput}
        >
            {isInputVisible ? 'Скрыть клавиатуру' : 'Показать клавиатуру'}
        </button>
        </div>
    );
    }

export default App;




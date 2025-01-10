from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from prediction import predict_sentence_transcription, get_transcription 
import whisper
import os

app = Flask(__name__)  # Исправлено на __name__

CORS(app)

UPLOAD_FOLDER = 'uploads'  # Убедитесь, что эта папка существует
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


@app.route('/api/transcription', methods=['GET', 'POST'])
def submit_text():
    
    if request.method == 'POST':
        data = request.get_json()
        text = data.get('text', '')
        predict_sentence_transcription(text)            # Прогоняем через prediction.py
        print("Received text:", text) # консоль VS code
        return jsonify({"message": "Text received", "received_text": text}), 200
    
    elif request.method == 'GET':
        text = get_transcription()
        print({"text": f"{text}"}) #поменять бы на transcription
        return jsonify({"text": f"{text}"}), 200  # Возвращаем транскрипцию

model = whisper.load_model("small")  # Вы можете выбрать другую модель: tiny, base, small, medium, large

@app.route('/upload', methods=['POST'])
def handle_file():
    if request.method == 'POST':
        # Обработка загрузки файла
        if 'audio' not in request.files:
            return jsonify({'error': 'Нет файла'}), 400

        file = request.files['audio']
        if file.filename == '':
            return jsonify({'error': 'Файл не выбран'}), 400

        file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(file_path)
        print(f"File saved to {file_path}")

        # Обработка аудиофайла с помощью Whisper
        result = model.transcribe(file_path, language="ru")
        transcribed_text = result['text']

        return jsonify({'audioUrl': f'http://localhost:5000/upload/{file.filename}', 'inputText': transcribed_text}), 200

if __name__ == '__main__':  # Исправлено на __main__
    app.run(debug=True)


# from flask import Flask, request, jsonify
# from flask_cors import CORS
# from prediction import predict_sentence_transcription, get_transcription  # Импортируем функции

# app = Flask(__name__)
# CORS(app)  # Разрешаем CORS для всех маршрутов

# @app.route('/')
# def index():
#     return "Welcome to the Flask API!"


# @app.route('/api/transcription', methods=['GET', 'POST'])
# def submit_text():
    
#     if request.method == 'POST':
#         data = request.get_json()
#         text = data.get('text', '')
#         predict_sentence_transcription(text)            # Прогоняем через prediction.py
#         print("Received text:", text) # консоль VS code
#         return jsonify({"message": "Text received", "received_text": text}), 200
    
#     elif request.method == 'GET':
#         text = get_transcription()
#         print({"text": f"{text}"}) поменять бы на transcription
#         return jsonify({"text": f"{text}"}), 200  # Возвращаем транскрипцию

# if __name__ == '__main__':
#     app.run(debug=True)

with app.app_context():
    print(app.url_map)
from flask import Flask, request, jsonify
from flask_cors import CORS
from prediction import predict_sentence_transcription, get_transcription  # Импортируем функции

app = Flask(__name__)
CORS(app)  # Разрешаем CORS для всех маршрутов

@app.route('/')
def index():
    return "Welcome to the Flask API!"


@app.route('/api/transcription', methods=['GET', 'POST'])
def submit_text():
    
    if request.method == 'POST':
        data = request.get_json()
        text = data.get('text', '')
        predict_sentence_transcription(text)            # Прогоняем через prediction.py
        print("Received text:", text) # консоль VS code
        return jsonify({"message": "Text received", "received_text": text}), 200
    
    elif request.method == 'GET':
        text = get_transcription() # Возвращаем из prediction.py
        print({"text": f"{text}"})
        return jsonify({"text": f"{text}"}), 200  # Возвращаем транскрипцию

if __name__ == '__main__':
    app.run(debug=True)

with app.app_context():
    print(app.url_map)
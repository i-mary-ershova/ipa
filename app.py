from flask import Flask, render_template

app = Flask(__name__)

# Главная страница
@app.route("/")
def home():
    try:
        return render_template("index.html")
    except Exception as e:
        return f"Error: {e}"


if __name__ == "__main__":
    app.run(debug=True)

from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import requests
import json

app = Flask(__name__)
CORS(app)

@app.route("/get_advice", methods=["POST"])
def get_advice():
    df = pd.read_csv("pos_data.csv")
    top_items = df.sort_values("Orders", ascending=False).head(3)
    bottom_items = df.sort_values("Orders", ascending=True).head(3)

    summary = f"Top items:\n{top_items.to_string(index=False)}\n\nBottom items:\n{bottom_items.to_string(index=False)}"
    prompt = f"""
    You are a marketing advisor for cafés.
    Sales data:
    {summary}

    Rules:
    - Only give advice grounded in this data.
    - Provide relevant marketing strategies and cost-saving ideas when applicable.
    - Avoid overly long answers. Keep it short and straightforward.
    - Do not give obvious advice.
    """

    resp = requests.post(
        "http://localhost:11434/api/generate",
        json={"model": "mistral", "prompt": prompt, "stream": False}
    )

    advice = resp.json()["response"]
    return jsonify({"advice": advice})

if __name__ == "__main__":
    app.run(port=5000, debug=True)

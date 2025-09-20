from flask import Flask, request, jsonify
from flask import send_from_directory
from flask_cors import CORS
import pandas as pd
import requests
import json
import os
import csv
import ast

app = Flask(__name__)
CORS(app)
DATA_DIR = os.path.abspath(os.path.join(app.root_path, '..', 'data'))
# Define the path where CSV files will be saved
OUTPUT_FOLDER = '../data'
# Ensure the output directory exists
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

@app.route("/get_advice", methods=["POST"])
def get_advice():
    df = pd.read_csv(os.path.join(OUTPUT_FOLDER, "data.csv"))
    top_items = df.sort_values("Orders", ascending=False).head(3)
    bottom_items = df.sort_values("Orders", ascending=True).head(3)
    
    store_df = pd.read_csv(os.path.join(OUTPUT_FOLDER, "store_profile.csv"))
    store_info = store_df.iloc[0].to_dict()
    store_summary = "\n".join([f"{k}: {v}" for k, v in store_info.items()])

    summary = f"Top items:\n{top_items.to_string(index=False)}\n\nBottom items:\n{bottom_items.to_string(index=False)}"
    prompt = f"""
    You are a marketing advisor for an Australian MSME.
    Store profile:
    {store_summary}

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

@app.route('/save-csv', methods=['POST'])
def save_csv():
    """
    API endpoint to receive JSON data and save it as a CSV file.
    """
    # 1. Get the JSON data from the request
    data = request.get_json()

    if not data or 'rows' not in data or not data['rows']:
        return jsonify({"error": "Invalid data format. Expected a 'rows' key with a list of objects."}), 400

    rows = data['rows']
    filename = data.get('filename', 'data.csv') # Use provided filename or default to 'data.csv'

    # 2. Define the full path for the file
    # This saves the file inside the 'output' folder
    file_path = os.path.join(OUTPUT_FOLDER, filename)

    try:
        # 3. Write the data to the CSV file
        # 'w' mode overwrites the file if it already exists
        with open(file_path, 'w', newline='', encoding='utf-8') as csvfile:
            if not rows: # Handle case of empty rows array
                csvfile.write("") # Create an empty file
                return jsonify({"message": f"Empty CSV file created successfully at {file_path}"}), 200

            # Get headers from the keys of the first object
            headers = rows[0].keys()
            
            # Create a CSV writer object
            writer = csv.DictWriter(csvfile, fieldnames=headers)
            
            # Write the header row
            writer.writeheader()
            
            # Write the data rows
            writer.writerows(rows)
        
        print(f"File saved successfully to {file_path}")
        return jsonify({"message": f"File saved successfully to {file_path}"}), 200

    except Exception as e:
        print(f"Error saving file: {e}")
        return jsonify({"error": f"An error occurred: {e}"}), 500

@app.route("/get_store_profile", methods=["GET"])
def get_store_profile():
    import pandas as pd, os
    file_path = os.path.join(OUTPUT_FOLDER, "store_profile.csv")
    df = pd.read_csv(file_path)
    # Assuming only one row
    profile = df.iloc[0].to_dict()
    channels = profile.get("marketingChannels")
    if isinstance(channels, str):
        try:
            parsed = ast.literal_eval(channels)  # safely parse "['a','b']"
            if isinstance(parsed, list):
                profile["marketingChannels"] = parsed
        except Exception:
            pass
    return jsonify(profile)

@app.route('/data/<path:filename>')
def serve_data(filename):
    return send_from_directory(DATA_DIR, filename)

if __name__ == "__main__":
    app.run(port=5000, debug=True)

from flask import Flask, request, jsonify
from flask_cors import CORS
import csv
import os

app = Flask(__name__)
CORS(app)
CSV_FILE = "data/data.csv"

@app.route("/add-to-csv", methods=["POST"])
def add_to_csv():
    data = request.json
    item, orders, revenue = data.get("item"), data.get("orders"), data.get("revenue")

    if not item or not orders or not revenue:
        return jsonify({"error": "Invalid data"}), 400

    new_row = [item, orders, revenue]

    file_exists = os.path.isfile(CSV_FILE)

    try:
        with open(CSV_FILE, "a", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            if not file_exists:  # add header if file new
                writer.writerow(["ItemName", "Orders", "Revenue"])
            writer.writerow(new_row)
        return jsonify({"success": True}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)

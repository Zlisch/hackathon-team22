import requests
import pandas as pd

df = pd.read_csv('pos_data.csv')

top_items = df.sort_values('Orders', ascending=False).head(3)
bottom_items = df.sort_values('Orders', ascending=True).head(3)

summary = f"""
Top items: 
{top_items.to_string(index=False)} 
Bottom items:
{bottom_items.to_string(index=False)}
"""

prompt = f"""
You are a marketing and operations advisor for small cafés.

Here is the café's sales data:
{summary}

Rules:
- Only give advice that directly references the data above.
- Do not give generic advice like "use social media" unless you tie it to a specific item or trend in the data.
- Provide marketing strategies and cost-saving ideas.
- For each suggestion, explain briefly which menu item or trend it is based on.
"""

resp = requests.post(
    "http://localhost:11434/api/generate",
    json={"model": "mistral", "prompt": prompt},
    stream=True
)

output = ""
for line in resp.iter_lines():
    if line:
        data = line.decode("utf-8")
        # Each line is JSON, extract the "response" field
        import json
        obj = json.loads(data)
        if "response" in obj:
            output += obj["response"]
        if obj.get("done", False):
            break

print("Final output:\n", output)

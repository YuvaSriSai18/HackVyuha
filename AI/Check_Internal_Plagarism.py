from flask import Flask, request, jsonify
from pymongo import MongoClient
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import PyPDF2
import io

app = Flask(__name__)

# MongoDB setup
client = MongoClient("mongodb+srv://sathvik_7:Sathvik@cluster0.hema0.mongodb.net/")
db = client['research_db']
collection = db['papers']

# Load embedding model once
model = SentenceTransformer('all-MiniLM-L6-v2')

# Common function: Extract text from PDF
def extract_text_from_pdf(file_stream):
    reader = PyPDF2.PdfReader(file_stream)
    text = ""
    for page in reader.pages:
        extracted = page.extract_text()
        if extracted:
            text += extracted + "\n"
    return text.strip()

# Common function: Embed text to vector
def embed_text(text):
    return model.encode(text)

# ----------- Route 1: Upload Paper -------------
@app.route('/upload-paper', methods=['POST'])
def upload_paper():
    paper_id = request.form.get('paper_id')
    if not paper_id:
        return jsonify({"error": "paper_id is required"}), 400

    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400  

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    file_stream = io.BytesIO(file.read())
    text = extract_text_from_pdf(file_stream)

    if not text:
        return jsonify({"error": "Could not extract text from PDF"}), 400

    vector = embed_text(text).tolist()

    doc = {
        "_id": paper_id,
        "text": text,
        "vector": vector,
        "filename": file.filename
    }
    collection.replace_one({"_id": paper_id}, doc, upsert=True)

    return jsonify({"message": "Paper stored successfully", "paper_id": paper_id})

# ----------- Route 2: Check Plagiarism -------------
@app.route('/check-plagiarism', methods=['POST'])
def check_plagiarism():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "Empty filename"}), 400

    file_stream = io.BytesIO(file.read())
    text = extract_text_from_pdf(file_stream)
    if not text:
        return jsonify({"error": "No text found in PDF"}), 400

    uploaded_vector = embed_text(text).reshape(1, -1)

    stored_papers = list(collection.find({}, {"_id": 1, "vector": 1, "filename": 1}))
    if not stored_papers:
        return jsonify({"error": "No papers found in the database to compare"}), 404

    results = []
    for paper in stored_papers:
        stored_vector = paper["vector"]
        similarity = cosine_similarity(uploaded_vector, [stored_vector])[0][0]
        results.append({
            "paper_id": str(paper["_id"]),
            "filename": paper.get("filename", ""),
            "similarity": round(float(similarity), 4)
        })

    results = sorted(results, key=lambda x: x['similarity'], reverse=True)
    top_matches = results[:5]
    highest_score = top_matches[0]["similarity"] if top_matches else 0

    return jsonify({
        "plagiarism_score": highest_score,
        "matches": top_matches
    })

# ----------- Run App -------------
if __name__ == '__main__':
    app.run(debug=True)

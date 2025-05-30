from flask import Flask, request, jsonify
import PyPDF2
import io
import requests
import re
from bs4 import BeautifulSoup
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
import google.generativeai as genai

app = Flask(__name__)

# Load embedding model
model = SentenceTransformer('all-MiniLM-L6-v2')

# Google Custom Search API credentials
API_KEY = "AIzaSyByJWWpfEQ4c1RFqZ9qZ9FCmT-kH7O5yns"
CX_ID = "e608c6892a06b40ec"

# Gemini API key (make sure to replace this with your actual key)
GEMINI_API_KEY = "AIzaSyBuBc6Kxh4YrQlWan3RQlUrTMZ8YYziNbI"
genai.configure(api_key=GEMINI_API_KEY)
gemini_model = genai.GenerativeModel("gemini-pro")

# Extract PDF text and metadata
def extract_text_and_metadata(file_stream):
    reader = PyPDF2.PdfReader(file_stream)
    text = ""
    for page in reader.pages:
        extracted = page.extract_text()
        if extracted:
            text += extracted + "\n"
    metadata = reader.metadata or {}
    return text.strip(), {
        "title": metadata.get("/Title", ""),
        "author": metadata.get("/Author", ""),
        "subject": metadata.get("/Subject", ""),
        "keywords": metadata.get("/Keywords", "")
    }

# Extract abstract section from text
def extract_abstract(text):
    match = re.search(r'\bAbstract\b(.*?)(?=\b1\.|\bIntroduction\b)', text, re.DOTALL | re.IGNORECASE)
    if match:
        return match.group(1).strip()
    return ""

# Gemini-generated important queries
def get_gemini_queries(text, num_points=5):
    prompt = f"""Extract the top {num_points} most important points or claims made in this scientific research paper. 
These should be concise and suitable for use as search queries to detect possible plagiarism.

Text:
{text[:8000]}"""  # Truncated to first 8000 characters

    try:
        response = gemini_model.generate_content(prompt)
        output = response.text.strip()
        queries = [line.strip("•- ") for line in output.split("\n") if len(line.strip()) > 30]
        return queries[:num_points]
    except Exception as e:
        print(f"Gemini Error: {e}")
        return []

# Extract informative search queries (combined method)
def extract_queries(text, meta_info_str, num_sentences=5):
    # 1. From abstract
    abstract = extract_abstract(text)
    abstract_queries = [s.strip() for s in abstract.split('.') if len(s.strip()) > 30][:num_sentences] if abstract else []

    # 2. From body using TF-IDF
    lines = text.split('\n')
    lines = [line.strip() for line in lines if len(line.strip()) > 30 and not re.search(
        r'©|Elsevier|rights reserved|homepage|available online|doi|http|www|ScienceDirect', line, re.IGNORECASE)]
    clean_text = ' '.join(lines[:100])
    sentences = re.split(r'\. |\n', clean_text)
    sentences = [s.strip() for s in sentences if len(s.strip()) > 30]

    tfidf_queries = []
    if sentences:
        tfidf = TfidfVectorizer(stop_words='english').fit(sentences)
        scores = tfidf.transform(sentences).sum(axis=1).A1
        ranked_sentences = [sent for _, sent in sorted(zip(scores, sentences), reverse=True)]
        tfidf_queries = ranked_sentences[:num_sentences]

    # 3. From Gemini
    gemini_queries = get_gemini_queries(text, num_points=5)

    # Combine all with meta info
    combined = list(set(gemini_queries + tfidf_queries + abstract_queries))
    if meta_info_str:
        combined.insert(0, meta_info_str)

    return combined

# Google Search API call
def search_google(query):
    try:
        url = "https://www.googleapis.com/customsearch/v1"
        params = {
            "key": API_KEY,
            "cx": CX_ID,
            "q": query
        }
        response = requests.get(url, params=params)
        response.raise_for_status()
        results = response.json().get("items", [])
        return [item.get("link", "") for item in results]
    except Exception as e:
        print(f"Google Search API Error: {e}")
        return []

# Scrape clean text from a webpage
def extract_text_from_url(url):
    try:
        response = requests.get(url, timeout=5)
        soup = BeautifulSoup(response.text, "html.parser")
        paragraphs = soup.find_all("p")
        return " ".join(p.get_text() for p in paragraphs if p.get_text())
    except Exception as e:
        print(f"Error scraping {url}: {e}")
        return ""

# Embed text into vector
def embed_text(text):
    return model.encode(text)

# Main plagiarism detection route
@app.route('/check-external', methods=['POST'])
def check_external():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "Empty filename"}), 400

    file_stream = io.BytesIO(file.read())
    text, metadata = extract_text_and_metadata(file_stream)
    if not text:
        return jsonify({"error": "No text found in PDF"}), 400

    uploaded_vector = embed_text(text).reshape(1, -1)

    # Create a summary string from metadata
    meta_info = " ".join(v for v in metadata.values() if v)
    queries = extract_queries(text, meta_info)

    urls = []
    for q in queries:
        urls += search_google(q)

    checked_results = []
    seen = set()

    for url in urls:
        if url in seen:
            continue
        seen.add(url)

        web_text = extract_text_from_url(url)
        if len(web_text) < 300:
            continue

        web_vector = embed_text(web_text).reshape(1, -1)
        similarity = cosine_similarity(uploaded_vector, web_vector)[0][0]

        checked_results.append({
            "url": url,
            "similarity": round(float(similarity), 4)
        })

    checked_results.sort(key=lambda x: x['similarity'], reverse=True)
    top_matches = checked_results[:5]
    highest_score = top_matches[0]["similarity"] if top_matches else 0

    return jsonify({
        "file_name": file.filename,
        "plagiarism_score": highest_score,
        "matches": top_matches,
        "metadata": metadata,
        "queries_used": queries
    })

if __name__ == '__main__':
    app.run(debug=True)

from flask import Flask, request, jsonify
import requests
from langchain.chains import RetrievalQA
from langchain_google_genai.chat_models import ChatGoogleGenerativeAI
from langchain.document_loaders import WebBaseLoader
from langchain.indexes import VectorstoreIndexCreator

app = Flask(__name__)

# Load CDP documentation
cdp_urls = {
    "Segment": "https://segment.com/docs/",
    "mParticle": "https://docs.mparticle.com/",
    "Lytics": "https://docs.lytics.com/",
    "Zeotap": "https://docs.zeotap.com/home/en-us/"
}

documents = [WebBaseLoader(url).load() for url in cdp_urls.values()]
index = VectorstoreIndexCreator().from_documents(documents)

qa_chain = RetrievalQA.from_chain_type(
    llm=ChatGoogleGenerativeAI(model_name="gemini-pro"), retriever=index.vectorstore.as_retriever()
)

# Function to handle irrelevant queries
def is_relevant(question):
    cdp_keywords = ["Segment", "mParticle", "Lytics", "Zeotap", "CDP", "Customer Data Platform", "integration", "API"]
    return any(keyword.lower() in question.lower() for keyword in cdp_keywords)

@app.route("/ask", methods=["POST"])
def ask_question():
    data = request.json
    user_question = data.get("question")
    
    if not user_question:
        return jsonify({"error": "Please provide a question."}), 400
    
    if not is_relevant(user_question):
        return jsonify({"answer": "I'm designed to answer questions related to CDPs (Segment, mParticle, Lytics, Zeotap). Please ask a relevant question."})
    
    # Check for multi-step questions
    if "and" in user_question or "then" in user_question:
        steps = user_question.split("and" if "and" in user_question else "then")
        responses = [qa_chain.run(step.strip()) for step in steps]
        return jsonify({"steps": responses})
    
    answer = qa_chain.run(user_question)
    return jsonify({"answer": answer})

@app.route("/compare", methods=["POST"])
def compare_cdps():
    data = request.json
    cdp1, cdp2 = data.get("cdp1"), data.get("cdp2")
    
    if cdp1 not in cdp_urls or cdp2 not in cdp_urls:
        return jsonify({"error": "Invalid CDP names. Choose from Segment, mParticle, Lytics, or Zeotap."}), 400
    
    comparison_query = f"Compare {cdp1} with {cdp2} in terms of features, integrations, and use cases."
    answer = qa_chain.run(comparison_query)
    
    return jsonify({"comparison": answer})

if __name__ == "__main__":
    app.run(debug=True)
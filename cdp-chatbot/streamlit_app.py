import streamlit as st
import requests

# API Endpoint
API_URL = "http://127.0.0.1:5000"

st.title("CDP Chatbot - Ask Questions About Segment, mParticle, Lytics, Zeotap")

# User Input
user_question = st.text_input("Ask a question:")
if st.button("Ask"): 
    if user_question:
        response = requests.post(f"{API_URL}/ask", json={"question": user_question})
        answer = response.json().get("answer", "Error fetching response")
        st.write("### Answer:")
        st.success(answer)
    else:
        st.warning("Please enter a question!")

st.header("Compare CDPs")
cdp_options = ["Segment", "mParticle", "Lytics", "Zeotap"]
cdp1 = st.selectbox("Select first CDP:", cdp_options)
cdp2 = st.selectbox("Select second CDP:", cdp_options)
if st.button("Compare"):
    if cdp1 and cdp2 and cdp1 != cdp2:
        response = requests.post(f"{API_URL}/compare", json={"cdp1": cdp1, "cdp2": cdp2})
        comparison = response.json().get("comparison", "Error fetching comparison")
        st.write("### Comparison:")
        st.info(comparison)
    else:
        st.warning("Please select two different CDPs!")

st.sidebar.header("Instructions")
st.sidebar.write("- Ask questions about how to use Segment, mParticle, Lytics, or Zeotap.")
st.sidebar.write("- Compare two CDPs to understand their differences.")

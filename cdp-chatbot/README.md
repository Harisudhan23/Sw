# CDP Chatbot

This project is a Flask-based chatbot that answers "how-to" questions about four Customer Data Platforms (CDPs): Segment, mParticle, Lytics, and Zeotap.

## Features
- Retrieves answers from CDP documentation
- Uses Google Generative AI (Gemini Pro) for processing
- Handles basic and complex user queries
- Filters out irrelevant questions
- Simple API endpoints for asking questions

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/cdp-chatbot.git
   cd cdp-chatbot
   ```

2. Install dependencies:
   ```sh
   pip install -r requirements.txt
   ```

3. Run the application:
   ```sh
   python app.py
   ```

## API Endpoints
- `POST /ask` → Ask a question related to CDPs
  ```json
  {"question": "How do I integrate Segment with my data source?"}
  ```

## Tech Stack
- Flask
- LangChain
- Google Generative AI (Gemini Pro)
- Python

## Future Enhancements
- UI for chatbot
- Cross-CDP comparison feature
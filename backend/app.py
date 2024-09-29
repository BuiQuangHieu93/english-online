from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
import eng_to_ipa as ipa

app = Flask(__name__)

# Enable CORS for all routes
CORS(app)

@app.route('/convert-to-ipa', methods=['POST'])
def convert_to_ipa():
    data = request.get_json()

    # Check if 'transcript' is provided in the request (match frontend field)
    if data is None or 'transcript' not in data:
        return jsonify({'error': 'No transcript provided'}), 400

    transcript = data['transcript']

    try:
        # Convert the transcript text to IPA using end-to-ipa
        ipa_transcription  = ipa.convert(transcript)
        return jsonify({'ipa': ipa_transcription })
    except UnicodeDecodeError as e:
        return jsonify({'error': f'UnicodeDecodeError: {str(e)}'}), 500
    
@app.route("/")
def home():
    return "hello world"


if __name__ == '__main__':
    app.run(debug=True)

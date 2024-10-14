from flask import Flask, request, jsonify
from flask_cors import CORS
import eng_to_ipa as ipa

app = Flask(__name__)
CORS(app)

@app.route('/convert-to-ipa', methods=['POST'])
def convert_to_ipa():
    data = request.get_json()
    if data is None or 'transcript' not in data:
        return jsonify({'error': 'No transcript provided'}), 400

    transcript = data['transcript']
    try:
        ipa_transcription = ipa.convert(transcript)
        return jsonify({'ipa': ipa_transcription})
    except UnicodeDecodeError as e:
        return jsonify({'error': f'UnicodeDecodeError: {str(e)}'}), 500

@app.route('/convert-vocabularies-to-ipa', methods=['POST'])
def convert_vocabularies_to_ipa():
    data = request.get_json()

    # Check if 'vocabulary' list is provided in the request
    if data is None or 'vocabulary' not in data:
        return jsonify({'error': 'No vocabulary list provided'}), 400

    vocabulary_list = data['vocabulary']
    result_list = []

    for vocab_item in vocabulary_list:
        english = vocab_item.get('english', '')
        vietnamese = vocab_item.get('vietnamese', '')
        sentence = vocab_item.get('sentence', '')
        ipa_origin = vocab_item.get('ipa',' ')
        ipa_transcription = ipa.convert(sentence)

        result_list.append({
            "english": english,
            "ipa": ipa_origin,
            "vietnamese": vietnamese,
            "sentence": sentence,
            "sentence_to_ipa": ipa_transcription
        })

    return jsonify({"vocabulary": result_list})


@app.route("/")
def home():
    return "hello world"

if __name__ == '__main__':
    app.run(debug=True)

from flask import Flask, request, jsonify
import json

app = Flask(__name__)

@app.route('/post/', methods=['GET'])
def handle_get():
    data_string = request.args.get('data', '')
    try:
        data = json.loads(data_string)
    except json.JSONDecodeError:
        return jsonify({'error': 'Invalid JSON format for data'}), 400

    list1 = []
    list2 = []
    converted_data = {"weights": data["weights"], "test_1": {}}

    for i, (topic, difficulty_levels) in enumerate(data.items()):
        if topic != "weights":
            topic_key = f"topic{i + 1}"
            converted_data["test_1"][topic_key] = {}
            for difficulty, scores in difficulty_levels.items():
                difficulty_key_prefix = difficulty.lower()
                for score_type, value in scores.items():
                    score_key = f"{difficulty_key_prefix}_{score_type}"
                    converted_data["test_1"][topic_key][score_key] = value
    dictionary = converted_data
    for topic_key in dictionary["test_1"]:
        print(topic_key)
        topic_data = dictionary["test_1"][topic_key]

        easy_total = topic_data["easy_correct"] + topic_data["easy_wrong"]
        easy_correct_percent = (topic_data["easy_correct"] / easy_total) if easy_total != 0 else 0

        medium_total = topic_data["medium_correct"] + topic_data["medium_wrong"]
        medium_correct_percent = (topic_data["medium_correct"] / medium_total) if medium_total != 0 else 0

        hard_total = topic_data["hard_correct"] + topic_data["hard_wrong"]
        hard_correct_percent = (topic_data["hard_correct"] / hard_total) if hard_total != 0 else 0
        list1.append([easy_correct_percent, medium_correct_percent, hard_correct_percent])

    print(list1)
    dist_prob = data['weights']

    #easy_right = 0.7
    #medium_right = 0.6
    right = [0.7, 0.6, 0.0]
    left = [0.0, 0.5, 0.4]

    temp = list1[0]
    print(temp)

    temp2 = dist_prob[0]
    temp2

    for i in range(len(list1)):
        if list1[i][0] > right[0]:
            dist_prob[i][0] -= 0.1
            dist_prob[i][1] += 0.1
        if list1[i][1] > right[1]:
            dist_prob[i][1] -= 0.1
            dist_prob[i][2] += 0.1
    for i in range(len(list1) - 1, 0, -1):
        if list1[i][2] < left[2]:
            dist_prob[i][2] -= 0.1
            dist_prob[i][1] += 0.1
        if list1[i][1] < left[1]:
            dist_prob[i][1] -= 0.1
            dist_prob[i][0] += 0.1

    # Process the data as needed
    # For example, just return the received data as a response
    response_data = {
        'updated_weights': dist_prob
    }
    return jsonify(response_data)

if __name__ == '__main__':
    app.run(debug=True, port=9000)

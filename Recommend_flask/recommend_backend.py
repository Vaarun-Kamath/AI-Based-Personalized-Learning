from flask import Flask, request, jsonify
import google.generativeai as genai
import json

genai.configure(api_key="AIzaSyDoO24XUAuwv2C6HmUnxp-F-FlBuY006ac")

generation_config = {
    "temperature": 0.9,
    "top_p": 1,
    "top_k": 1,
    "max_output_tokens": 2048,
}

safety_settings = [
    {
        "category": "HARM_CATEGORY_HARASSMENT",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
        "category": "HARM_CATEGORY_HATE_SPEECH",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
        "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
        "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    },
]

model = genai.GenerativeModel(model_name="gemini-1.0-pro",
                              generation_config=generation_config,
                              safety_settings=safety_settings)

app = Flask(_name_)


@app.route('/post/', methods=['GET'])
def handle_get():
    data_string = request.args.get('data', '')
    try:
        data = json.loads(data_string)
    except json.JSONDecodeError:
        return jsonify({'error': 'Invalid JSON format for data'}), 400

    list1 = []
    list2 = []
    print(data)
    converted_data = {"weights": data["weights"], "test_1": {}}
    topic_counter = 1

    for topic, difficulty_levels in data["topics"].items():
        converted_topic = {}
        for difficulty, scores in difficulty_levels.items():
            converted_topic[f"{difficulty.lower()}_correct"] = scores["correct"]
            converted_topic[f"{difficulty.lower()}_wrong"] = scores["wrong"]
        converted_data["test_1"][f"topic{topic_counter}"] = converted_topic
        topic_counter += 1

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

    # easy_right = 0.7
    # medium_right = 0.6
    right = [0.7, 0.6, 0.0]
    left = [0.0, 0.5, 0.4]

    temp = list1[0]
    print(temp)

    temp2 = dist_prob[0]
    temp2

    for i in range(len(list1)):
        if list1[i][0] > right[0]:
            if dist_prob[i][0] > 0:
                dist_prob[i][0] -= 0.1
                dist_prob[i][1] += 0.1
        if list1[i][1] > right[1]:
            if dist_prob[i][1] > 0:
                dist_prob[i][1] -= 0.1
                dist_prob[i][2] += 0.1
    for i in range(len(list1) - 1, 0, -1):
        if list1[i][2] < left[2]:
            if dist_prob[i][2] > 0:
                dist_prob[i][2] -= 0.1
                dist_prob[i][1] += 0.1
        if list1[i][1] < left[1]:
            if dist_prob[i][1] > 0:
                dist_prob[i][1] -= 0.1
                dist_prob[i][0] += 0.1

    # Process the data as needed
    # For example, just return the received data as a response
    response_data = {
        'updated_weights': dist_prob
    }
    return jsonify(response_data)


@app.route('/genai/', methods=['GET'])
def handle_genai():
    data_string = request.args.get('data', '')
    try:
        dictionary = json.loads(data_string)
    except json.JSONDecodeError:
        return jsonify({'error': 'Invalid JSON format for data'}), 400

    prompt_parts = [
        "input: A transmitting antenna is kept on the surface of the earth. The minimum height of receiving antenna required to receive the signal in line of sight at 4 km distance from it is \\\\(x\\\\times 10^2\\\\) m. The value of x is (\\\\(Let\\\\), radius of earth \\\\(R=6400\\\\text{ km}\\\\)).\n            A: 125,\n            B: 1.25,\n           C: 12.5,\n            D: 1250\n        answer: A",
        "output: To solve the problem, we utilize the Earth's curvature concept and line of sight communication principle. We start by calculating the required height for the receiving antenna using the formula \\( h = R - \\sqrt{R^2 - d^2} \\), where \\( R = 6400 \\) km (radius of Earth) and \\( d = 4 \\) km (distance between antennas). Then, we convert the calculated height to meters and compare it with the provided options to determine the correct answer.",
        "input: A body of mass 500 g moves along x-axis such that it's velocity varies with displacement x according to the relation v = 10\\u221ax m/s the force acting on the body is:            A: 166 N,            B: 25 N,            C: 125 N,            D: 5 N\nanswer: B",
        "output: To solve the problem, we utilize the concept of Newton's second law of motion, which states that the force acting on an object is equal to the rate of change of its momentum. Since momentum \\( p \\) is given by the product of mass \\( m \\) and velocity \\( v \\), we first express velocity \\( v \\) in terms of displacement \\( x \\) using the provided relation \\( v = 10\\sqrt{x} \\) m/s. Then, we differentiate \\( v \\) with respect to \\( x \\) to obtain acceleration \\( a \\). Finally, we use Newton's second law, \\( F = ma \\), where \\( F \\) is the force, \\( m \\) is the mass of the body, and \\( a \\) is the acceleration, to calculate the force acting on the body.",
        "input: If \\\\(f(x) = \\\\frac{(\\\\tan^{-1}x)+log_{e}(123)}{xlog_{e}(1234)-(\\\\tan^{-1}x)^{\\\\circ}}\\\\), x>0, then the least value of \\\\(f(x) + f(\\\\frac{4}{x})\\\\) is  A:8,            B: 4,            C: 2,            D: 0       answer: 4",
        "output: To solve the problem, we utilize the properties of trigonometric and logarithmic functions. We start by rewriting both instances of \\( f(x) \\) using the identities \\( \\\\tan^{-1} \\\\frac{4}{x} = \\\\tan^{-1} x + \\\\tan^{-1} \\\\frac{4}{x} \\) and \\( log_{e} \\\\frac{4}{x} = log_{e} x - log_{e} 4 \\). Then, we simplify \\( f(x) + f(\\\\frac{4}{x}) \\) and find the critical points of the resulting expression. Finally, we evaluate the expression at the critical points and the endpoints of the domain to determine the least value.",
        f"input: {dictionary['question']} {dictionary['options']} Answer:{dictionary['answer']}",
        "output: ",
    ]

    response = model.generate_content(prompt_parts)
    responsetxt = response.text
    response_data = {
        'gemini_response': responsetxt
    }
    return jsonify(response_data)


if _name_ == '_main_':
    app.run(debug=True, port=9000)

import requests
import json

data = {
    "weights": [[0.5, 0.4, 0.1], [0.5, 0.4, 0.1], [0.5, 0.4, 0.1], [0.5, 0.4, 0.1]],
    "test_1": {
        "topic1": {"easy_correct": 4, "easy_wrong": 1, "medium_correct": 2, "medium_wrong": 1, "hard_correct": 0, "hard_wrong": 2},
        "topic2": {"easy_correct": 4, "easy_wrong": 1, "medium_correct": 2, "medium_wrong": 1, "hard_correct": 0, "hard_wrong": 2},
        "topic3": {"easy_correct": 4, "easy_wrong": 1, "medium_correct": 2, "medium_wrong": 1, "hard_correct": 0, "hard_wrong": 2},
        "topic4": {"easy_correct": 4, "easy_wrong": 1, "medium_correct": 2, "medium_wrong": 1, "hard_correct": 0, "hard_wrong": 2}
    }
}

data_json = json.dumps(data)
url = f'http://localhost:9000/post/?data={data_json}'

response = requests.get(url)
print(response.json())

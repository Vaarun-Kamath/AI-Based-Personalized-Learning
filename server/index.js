const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Errors = require('./utils/errors');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { validationResult, param } = require('express-validator');
const { userSchema } = require('./schema');
const { exam } = require('./model');

dotenv.config();
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

const Physics = require('./model').Physics;
const User = require('./model').User;
const Exam = require('./model').exam;

const mongo_url = process.env.MONGO_URL;
const PORT = process.env.PORT || 8000;
const questionModelHREF = 'http://localhost:9000';
const NUM_QUESTIONS = 40;
const TOPICS = ["Electricity and Magnetism", "Mechanics and Motion", "Thermodynamics and Quantum Mechanics", "Waves and Optics"]
const LEVELS = ["Easy", "Medium", "Hard"];

async function connect() {
  await mongoose
    .connect(mongo_url, {
      dbName: 'Personalized-Learning',
    })
    .then(() => console.log('Connected to the database!'))
    .catch((error) => console.error(error));
}

connect();

app.get('/', (req, res) => {
  res.status(200).send('Hello World!');
});


//url:/api/getExamStartTime?examId={}
app.get('/api/getExamStartTime', async (req, res, err) => {
  if (!req.query || !req.query.examId) {
    console.log('Invalid Query!', req.query);
    res.status(400).json({ msg: 'No Query object', err: err });
  }
  const exam = await Exam.findById(req.query.examId);


  res.status(200).json({
    status: 200,
    statusText: 'Success',
    time: new Date(exam.createdAt).getTime(),
  });
});

//url:/api/getSolution?examId={}&question={}
app.get('/api/getSolution', async (req, res, err) => {
  if (!req.query || !req.query.examId || req.query.question != undefined) {
    console.log('Invalid Query!', req.query);
    res.status(400).json({ msg: 'No Query object', err: err });
  }

  const exam = await Exam.findById(examId);
  const phyQuestion = await Physics.findById(exam.questions[question]);
  const result = await axios.get(`${questionModelHREF}/solution`, {
    params: {
      data: phyQuestion,
    },
  });
  res.status(200).json({
    status: 200,
    statusText: 'Success',
    question: phyQuestion.question,
    options: phyQuestion.options,
    optionsSelected: exam.selectedOptions,
    solution: result.content,
  });
});

//url:/api/getQuestion?examId={}&question={}
app.get('/api/getQuestion', async (req, res, err) => {
  if (!req.query || !req.query.examId) {
    console.log('Invalid Query!', req.query);
    res.status(400).json({ msg: 'No Query object', err: err });
  }

  console.log(' Query!', req.query);
  const exam = await Exam.findById(req.query.examId);
  console.log('exam', exam);
  const question_index = req.query.question || 0;

  const q_id = exam.questions[question_index];
  const phyQuestion = await Physics.findById(q_id);

  console.log('phyQuestion', phyQuestion);

  res.status(200).json({
    status: 200,
    statusText: 'Success',
    question: phyQuestion.question,
    options: phyQuestion.options,
    optionsSelected: exam.selectedOptions,
  });
});

//url:/api/createExam
app.post('/api/createExam', async (req, res) => {
  const { username } = req.body;

  const user = await User.findOne({ username: username });
  if (user.currentExam !== '') {
    res.status(200).json({
      status: 403,
      statusText: 'EXAM EXISTS',
      examId: user[0].currentExam,
    });
    return;
  }

  pickedQuestions = [];
  for (let i = 0; i < TOPICS.length; i++) {
    const questions = await Physics.find({ topic: TOPICS[i] });
    
    // for(let j=0;j<LEVELS.length;j++){

    // }
    let prob1 = Math.round(user.probability[i][0] * 10)
    pickedQuestions =
      pickedQuestions +
      questions
        .filter((q) => q.Level == 'Easy')
        .sort(() => Math.random() - 0.5)
        .slice(0, prob1);

    let prob2 = Math.round(user.probability[i][1] * 10)
    pickedQuestions =
      pickedQuestions +
      questions
        .filter((q) => q.Level == 'Medium')
        .sort(() => Math.random() - 0.5)
        .slice(0, prob2);

    let prob3 = 10-prob1 - prob2
    pickedQuestions =
      pickedQuestions +
      questions
        .filter((q) => q.Level == 'Hard')
        .sort(() => Math.random() - 0.5)
        .slice(0, prob3);
  }

  const selectedOptions = Array(NUM_QUESTIONS).fill(-1);
  const newExam = new Exam({
    username,
    questions: pickedQuestions.map((question) => question._id),
    selectedOptions,
    subject: 'Physics',
  });
  newExam
    .save()
    .then(async () => {
      Exam.findOne({}, '_id')
        .sort({ createdAt: -1 })
        .then(async (exam) => {
          const user = await User.findOneAndUpdate(
            { username: username },
            { currentExam: exam._id },
            { new: true }
          );
          res.status(200).json({
            status: 200,
            statusText: 'Exam added successfully',
            examId: exam._id,
          });
        });
    })
    .catch((err) => {
      res.status(500).json({ msg: 'Error in adding Exam', err: err });
    });
});

//url:/api/createExam
app.post('/api/selectOption', async (req, res) => {
  const { examId, questionNo, selectedOption } = req.body;

  const exam = await Exam.findById(examId);

  exam.selectedOptions[questionNo] = selectedOption;
  exam.save();

  return res.status(200).json({
    status: 200,
    statusText: 'SUCCESS',
  });
});

//url:"/api/submitExam"
app.post('/api/submitExam', async (req, res) => {
  const { examId } = req.body;

  var topics = {};
  try {
    const exam = await Exam.findById(examId);
    for (let i = 0; i < exam.questions.length; i++) {
      const question = await Physics.findById(exam.questions[i]);
      val = question.answer == exam.selectedOptions[i] ? 1 : 0;
      currTopic = question.topic in topics ? topics[question.topic] : {};
      currTopic[question.Level] =
        question.Level in currTopic
          ? currTopic[question.Level]
          : { correct: 0, wrong: 0 };
      if (val) {
        currTopic[question.Level]['correct'] += 1;
      } else {
        currTopic[question.Level]['wrong'] += 1;
      }
      topics[question.topic] = currTopic;
    }

    const response = await axios.get(`${questionModelHREF}/post`, {
      params: {
        probability: exam.probability,
        topic: topics,
      },
    });

    const user = await User.findOneAndUpdate(
      { username: exam.username },
      { currExam: '', probability: response.data.probability },
      { new: true }
    );

    // Log the response from the server
    console.log('Response from server:', response.data);
    res.send('Submitted successfully');
  } catch (error) {
    console.error('Error sending POST request:', error);
    res.status(500).send('Internal server error');
  }
});

app.get('/api/isUserInExam', async (req, res) => {
  const { username } = req.query;
  const exam = await Exam.findOne({ username: username });
  if (exam) {
    return res.status(200).json({
      status: 200,
      statusText: 'User is in exam',
      examId: exam._id,
    });
  } else {
    return res.status(404).json({
      status: 404,
      statusText: 'User is not in exam',
    });
  }
});

app.get('/api/isUserInExam', async (req, res) => {
  const { username } = req.query;
  const exam = await Exam.findOne({ username: username });
  if (exam) {
    return res.status(200).json({
      status: 200,
      statusText: 'User is in exam',
      examId: exam._id,
    });
  } else {
    return res.status(404).json({
      status: 404,
      statusText: 'User is not in exam',
    });
  }
});

// app.get('/api/isUserInExam', async (req, res) => {
//   const { username } = req.query;
//   const user = await User.findOne({
//     username: username,
//   });
//   const exam = await Exam.findById(user.currentExam);
//   if (exam) {
//     return res.status(200).json({
//       status: 200,
//       statusText: 'User is in exam',
//       examId: exam._id,
//     });
//   } else {
//     return res.status(404).json({
//       status: 404,
//       statusText: 'User is not in exam',
//     });
//   }
// });

app.post('/api/insertQuestion', async (req, res) => {
  const { question, options, answer, reason, topic } = req.body;
  const newQuestion = new Physics({
    question,
    options,
    answer,
    reason,
    topic,
  });
  newQuestion
    .save()
    .then(() => {
      res.status(200).send('Question added successfully');
    })
    .catch((err) => {
      res.status(500).json({ msg: 'Error in adding question', err: err });
    });
});

app.post('/api/login', async (req, res) => {
  try {
    const validationError = validationResult(req);

    if (!validationError.isEmpty())
      return res
        .status(Errors.BAD_REQUEST.status)
        .send({ ...Errors.BAD_REQUEST, ...validationError });

    const { email, password } = req.body;

    const user = await User.find({ email: email });

    console.log('User:: ', user[0]);

    if (!user[0]) {
      console.log('User not found :(');
      return res.status(Errors.NOT_FOUND.status).json(Errors.NOT_FOUND);
    }

    if (user[0].password !== password) {
      return res.status(Errors.UNAUTHORIZED.status).json(Errors.UNAUTHORIZED);
    }

    return res.status(200).json({
      status: 200,
      content: user[0],
    });
  } catch (error) {
    console.error(error);
    return res.status(Errors.SERVER_ERROR.status).json(Errors.SERVER_ERROR);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

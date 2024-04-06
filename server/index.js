const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Errors = require("./utils/errors");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { validationResult } = require("express-validator");
const { userSchema } = require('./schema');

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

// app.get("/api/testDatabase", async (req, res) => {
//   const physicsData = await Physics.find({});
//   const customersData = await User.find();
//   res.status(200).json({ phy: physicsData, msg: customersData });
// });

//url:/api/getExams&username={}
app.get('/api/getExams', async (req, res) => {
  if (!req.query || !req.query.username)
    res.status(400).json({ msg: 'No Query object', err: err });

  const user = await User.findOne({ username: req.query.username });
  console.log(user, req.query.username);
  const exams = user.exams.map((exam) => ({
    id: exam.id,
    noOfQuestions: exam.questions.length,
    subject: exam.subject,
  }));
  res.status(200).json(exams);
});

//url:/api/getQuestion?examId={}&question={}
app.get('/api/getQuestion', async (req, res, err) => {
  if (
    !req.query ||
    !req.query.examId
  ) {
    console.log("Invalid Query!", req.query)
    res.status(400).json({ msg: 'No Query object', err: err });
  }

  console.log(" Query!", req.query)
  const exam = await Exam.findById(req.query.examId)
  const question_index = (req.query.question || 0);
  console.log(" exam!", exam)
  
  // const user = await User.findOne({ username: req.query.username });
  // const examIndex = user.exams.findIndex(
  //   (exam) => exam.id === req.query.examId
  // );

  // const questionId = user.exams[examIndex].questions[question_index];
  // const phyQuestion = await Physics.findById(questionId);


  res
    .status(200)
    .json({ question: exam.questions[question_index], options: exam.selectedOptions });
});

app.get('/api/makeExam', async (req, res) => {
  if (
    !req.query ||
    !req.query.username
  ){
    console.log("Invalid Query!", req.query)
    res.status(400).json({ msg: 'No Query object', err: err });
  }

  questions = await Physics.find().limit(30);
res.json(questions.map(question=>question._id));

});

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

app.post('/api/getQuestion', async (req, res) => {
  try {
    const validationError = validationResult(req);

    if (!validationError.isEmpty())
      return res
        .status(Errors.BAD_REQUEST.status)
        .send({ ...Errors.BAD_REQUEST, ...validationError });

    const { examId, questionNo } = req.body;

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
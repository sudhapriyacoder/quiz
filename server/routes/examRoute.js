const router = require('express').Router();
const Exam = require('../models/examModel');
const authMiddleware = require('../middlewares/authMiddleware');
const Question = require('../models/questionModel');

router.post('/add', authMiddleware, async (req, res) => {
    try {
        // to check, if exam already exists
        const examExists = await Exam.findOne({name: req.body.name});
        if(examExists) {
            return res.status(200).send({message: 'Exam already exists', success: true})
        }
        req.body.questions = [];
         const newExam = new Exam(req.body);
         await newExam.save();
         res.send({
            message: 'Exam added successfully',
            success: true
         });
    } catch (error) {
          res.status(500).send({
            message: error.message,
            data: error,
            success: false
          })
    }
});

router.get('/get-all-exams', authMiddleware, async (req, res) => {
    try {
        // to check, if exam already exists
        const exams = await Exam.find({});
         res.send({
            message: 'Exam fetched successfully',
            success: true,
            data: exams
         });
    } catch (error) {
          res.status(500).send({
            message: error.message,
            data: error,
            success: false
          })
    }
});

router.post('/get-exam-by-id', authMiddleware, async (req, res) => {
    try {
        const exam = await Exam.findById(req.body.examId).populate('questions');
        res.send({
            message: 'Exam fetched successfully',
            success: true,
            data: exam
         });
    } catch (error) {
          res.status(500).send({
            message: error.message,
            data: error,
            success: false
          })
    }
});

router.post('/edit-exam-by-id', authMiddleware, async (req, res) => {
  try {
      await Exam.findByIdAndUpdate(req.body.examId, req.body);
      res.send({
          message: 'Exam edited successfully',
          success: true
       });
  } catch (error) {
        res.status(500).send({
          message: error.message,
          data: error,
          success: false
        })
  }
});

router.post('/delete-exam-by-id', authMiddleware, async (req, res) => {
  try {
      await Exam.findByIdAndDelete(req.body.examId);
      res.send({
          message: 'Exam deleted successfully',
          success: true
       });
  } catch (error) {
        res.status(500).send({
          message: error.message,
          data: error,
          success: false
        })
  }
});

router.post('/add-question-to-exam', authMiddleware, async (req, res) => {
  try {
    const newQuestion = new Question(req.body);
    console.log('==============================', req.body)
    const question = await newQuestion.save();

    const exam = await Exam.findById(req.body.exam);
    console.log('exam', exam);
    exam.questions.push(question._id);
    console.log('exammmm', exam);
    await exam.save();
      res.send({
          message: 'Question added successfully',
          success: true
       });
  } catch (error) {
        res.status(500).send({
          message: error.message,
          data: error,
          success: false
        })
  }
});


router.post('/edit-question-in-exam', authMiddleware, async (req, res) => {
  try {
    const exam = await Question.findByIdAndUpdate(req.body.questionId, req.body);
      res.send({
          message: 'Question edited successfully',
          success: true
       });
  } catch (error) {
        res.status(500).send({
          message: error.message,
          data: error,
          success: false
        })
  }
});

router.post('/delete-question-in-exam', authMiddleware, async (req, res) => {
  try {
    await Question.findByIdAndDelete(req.body.questionId);
    const exam = await Exam.findById(req.body.examId);
    exam.questions = exam.questions.filter(
      (question)=> question._id !== req.body.questionId
    );
    await exam.save();
      res.send({
          message: 'Question deleted successfully',
          success: true
       });
  } catch (error) {
        res.status(500).send({
          message: error.message,
          data: error,
          success: false
        })
  }
});

module.exports = router;
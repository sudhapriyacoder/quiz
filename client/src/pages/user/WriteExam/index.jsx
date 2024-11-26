import Instructions from "./Instructions";
import { useParams } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import PageTitle from '../../../components/PageTitle';
import { useNavigate } from 'react-router-dom';
import { Form, Row, Col, Select, message, Tabs, Table } from 'antd';
import { getExamById } from '../../../apicalls/exams';
import { showLoading, hideLoading } from '../../../redux/loaderSlice';
import { useDispatch, useSelector } from 'react-redux';
import { addReport } from '../../../apicalls/reports';

const WriteExam = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [result, setResult] = useState({});
  const [view, setView] = useState('instructions');
  const [examData, setExamData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [secondsLeft = 0, setSecondsLeft] = useState(0);
  const [timeUp, setTimeUp] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const { user } = useSelector(state => state.users);

  const getExamData = async () => {
    try {
      dispatch(showLoading());
      const response = await getExamById({ examId: params.id });
      dispatch(hideLoading());
      if (response.success) {
        setQuestions(response.data.questions);
        setExamData(response.data);
        setSecondsLeft(response.data.duration)
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      message.error(error.message);
    }
  }

  const calculateResult = async () => {
    try {
      let correctAnswers = []
      let wrongAnswers = []
      questions.forEach((question, index) => {
        if (question.correctOption === selectedOptions[index]) {
          correctAnswers.push(question);
        } else {
          wrongAnswers.push(question);
        }
      })

      let verdict = 'Pass';
      if (correctAnswers.length < examData.passingMarks) {
        verdict = 'Fail';
      }
      const tempResult = { correctAnswers, wrongAnswers, verdict };
      setResult(tempResult);
      dispatch(showLoading());
      const response = await addReport({
        exam: params.id,
        result: tempResult,
        user: user._id
      });
      dispatch(hideLoading());
      if (response.success) {
        setView('result');
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      message.error(error.message)
    }
  }

  const startTimer = () => {
    let totalSeconds = examData.duration;
    const intervalId = setInterval(() => {
      if (totalSeconds > 0) {
        totalSeconds = totalSeconds - 1;
        setSecondsLeft(totalSeconds);
      } else {
        setTimeUp(true);
      }
    }, 1000);
    setIntervalId(intervalId);
  }

  useEffect(() => {
    if (timeUp && view === 'questions') {
      clearInterval(intervalId);
      calculateResult();
    }
  }, [timeUp])

  useEffect(() => {
    if (params.id) {
      getExamData();
    }

  }, []);
  return (
    examData && (
      <div className="mt-2">
        <div className="divider"></div>
        <h1 className="text-center">{examData.name}</h1>
        <div className="divider"></div>
        {view === 'instructions' && <Instructions examData={examData}
          view={view} setView={setView} startTimer={startTimer} />}
        {view === 'questions' && <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <h1 className="text-2xl">
              {selectedQuestionIndex + 1} : {questions[selectedQuestionIndex].name}
            </h1>
            <div className="timer">
              <span className="text-2xl">{secondsLeft}</span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {Object.keys(questions[selectedQuestionIndex].options).map((option, index) => {
              return <div className={`flex gap-2 flex-col ${selectedOptions[selectedQuestionIndex] === option ? 'selected-option' : 'option'}`} key={index} onClick={() => {
                setSelectedOptions({
                  ...selectedOptions, [selectedQuestionIndex]: option
                })
              }}>
                <h1 className="text-xl">
                  {option} : {questions[selectedQuestionIndex].options[option]}
                </h1>
              </div>
            })}
          </div>
          <div className="flex justify-between">

            {selectedQuestionIndex < questions.length - 1 && <button className="primary-contained-btn" onClick={() => {
              setSelectedQuestionIndex(selectedQuestionIndex + 1);
            }}> Next

            </button>}

            {selectedQuestionIndex === questions.length - 1 && <button className="primary-contained-btn" onClick={() => {
              clearInterval(intervalId);
              setTimeUp(true);
            }}> Submit

            </button>}
            {selectedQuestionIndex > 0 && <button className="primary-outlined-btn" onClick={() => {
              setSelectedQuestionIndex(selectedQuestionIndex - 1);
            }}> Previous

            </button>}
          </div>
        </div>}
        {view === 'result' && <div className="flex items-center mt-2 justify-center">
          <div className="flex flex-col gap-2 result">
            <h1 className="text-2xl">
              RESULT
            </h1>
            <div className="marks">
              <h1 className="text-md">
                Total Marks : {examData.totalMarks}
              </h1>
              <h1 className="text-md">
                Obtained Marks : {result.correctAnswers.length}
              </h1>
              <h1 className="text-md">
                Wrong Answers : {result.wrongAnswers.length}
              </h1>
              <h1 className="text-md">
                Passing Marks : {examData.passingMarks}
              </h1>
              <h1 className="text-md">
                VERDICT : {result.verdict}
              </h1>
            </div>
          </div>
          <div className="lottie-animation">
            {result.verdict === 'Pass' && <dotlottie-player
              src="https://lottie.host/7ca42a17-9105-45a3-ab55-839010d87bb0/x784ZFRRt5.json"
              background="transparent"
              speed="1"
              // loop
              autoplay></dotlottie-player>}
            {
              result.verdict === 'Fail' && <dotlottie-player
                src="https://lottie.host/4971a543-f120-4e79-96f3-ab69fcda0256/ukjYl4WFNq.json"
                background="transparent"
                speed="1"
                // loop 
                autoplay></dotlottie-player>
            }
          </div>

        </div>}
      </div>
    )
  )
}

export default WriteExam
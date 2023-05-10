import React, { useState, useEffect } from 'react';
import './App.css';

type Question = {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
};
type Answer = {
  answer: string;
  correct: boolean;
};

function Quiz() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Answer[]>([]);
  const [showResult, setShowResult] = useState<boolean>(false);

  useEffect(() => {
    fetch('https://opentdb.com/api.php?amount=15&category=9&difficulty=medium&type=multiple')
      .then(response => response.json())
      .then(data => {
        // Shuffle the questions so they are not in the same order every time
        const shuffledQuestions = data.results.sort(() => Math.random() - 0.5);
        setQuestions(shuffledQuestions);
      });
  }, []);

  const handleAnswer = (answer: string) => {
    const question = questions[currentQuestion];
    const isCorrect = answer === question.correct_answer;
    const newAnswer: Answer = {
      answer: answer,
      correct: isCorrect,
    };
    setUserAnswers([...userAnswers, newAnswer]);
  };

  const handleNextQuestion = () => {
    setCurrentQuestion(currentQuestion + 1);
  };

  const handleFinishQuiz = () => {
    setShowResult(true);
  };
  
  const calculateScore = (): number => {
    const correctAnswers = userAnswers.filter(answer => answer.correct);
    return correctAnswers.length;
  };

  if (questions.length === 0) {
    return <div>Loading...</div>;
  }

  if (showResult) {
    const score = calculateScore();
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div>
        <h2>Quiz finished!</h2>
        <p>You got {score} out of {questions.length} correct ({percentage}%).</p>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="container">
      <h2 className="question">Question {currentQuestion + 1}:</h2>
      <h3>{question.question}</h3>
      <ul>
        {question.incorrect_answers.map(answer => (
          <li key={answer} className="answer">
            <button onClick={() => handleAnswer(answer)}>{answer}</button>
          </li>
        ))}
        <li key={question.correct_answer} className="answer">
        <button
          onClick={() => handleAnswer(question.correct_answer)}
        >
          {question.correct_answer}
        </button>
        </li>
      </ul>
      {currentQuestion === questions.length - 1 ? (
        <button className="button" onClick={handleFinishQuiz}>Finish Quiz</button>
      ) : (
        <button className="button" onClick={handleNextQuestion}>Next Question</button>
      )}
    </div>
  );
}

export default Quiz;
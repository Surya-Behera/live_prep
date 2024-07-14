import React, { useState, useEffect, useRef } from 'react';
import ollama from 'ollama';
import InterviewForm from './InterviewForm';
import Markdown from 'react-markdown';

const VoiceInput = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [answer, setAnswer] = useState('');
  const [recognition, setRecognition] = useState(null);
  const [response, setResponse] = useState('');
  const [questionHistory, setQuestionHistory] = useState([]);
  const [isReading, setIsReading] = useState(false);
  const [quizState, setQuizState] = useState('NOT_STARTED');
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [responseRead, setResponseRead] = useState(false); // Add this state variable
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    difficultyLevel: '',
    experience: ''
  });
  const questions = [
    `Hi ${formData.name}! Please introduce yourself briefly.`,
    "How do you declare a function in Python?",
    "How do you import a module in Python?",
    "How do you create a list in Python?",
    "What is the purpose of the 'if __name__ == \"__main__\":' statement?",
    "What is the difference between a tuple and a list in Python?",
    "How do you open a file for reading in Python?",
    "What is a dictionary in Python and how is it created?",
    "What is the purpose of the 'pass' statement in Python?",
    "How do you handle exceptions in Python?"
  ];

  const synth = useRef(window.speechSynthesis);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const newRecognition = new SpeechRecognition();
      newRecognition.continuous = true;
      newRecognition.interimResults = true;
      newRecognition.lang = 'en-US';

      newRecognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        setAnswer(transcript);
      };

      setRecognition(newRecognition);
    }
  }, []);

  useEffect(() => {
    if (quizState === 'READY' && currentQuestionIndex < questions.length) {
      readCurrentQuestion();
    }
  }, [quizState, currentQuestionIndex]);

  useEffect(() => {
    if (response && responseRead) {
      readAloud(response, moveToNextQuestion);
      setResponseRead(false); // Reset the state variable
    }
  }, [response, responseRead]);

  const handleStartInterview = () => {
    setShowForm(true);
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setShowForm(false);
    startQuiz();
  };

  const startQuiz = () => {
    setQuizState('READY');
    setCurrentQuestionIndex(0);
    setQuestionHistory([]);
    readAloud(`Welcome, ${formData.name}. Let's begin the ${formData.subject} interview at the ${formData.difficultyLevel} level. Here's your first question.`);
  };

  const readCurrentQuestion = () => {
    readAloud(questions[currentQuestionIndex], () => setQuizState('ANSWERING'));
  };

  const startListening = () => {
    if (recognition && quizState === 'ANSWERING') {
      recognition.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
      setQuizState('EVALUATING');
      verifyAnswer();
    }
  };

  const readAloud = (text, onEndCallback) => {
    if (synth.current) {
      setIsReading(true);
      const speech = new SpeechSynthesisUtterance(text);
      speech.lang = 'en-US';
      speech.volume = 1;
      speech.rate = 1;
      speech.pitch = 1;
      speech.onend = () => {
        setIsReading(false);
        if (onEndCallback) onEndCallback();
      };
      synth.current.speak(speech);
    } else {
      console.log('Text-to-speech not supported in this browser.');
      if (onEndCallback) onEndCallback();
    }
  };

  const verifyAnswer = async () => {
    try {
      setIsLoading(true); // Set loading to true before making the API call
      const prompt = `You are an expert  interviewer. Your task is to evaluate the user's answer to the given question.
        Question: ${questions[currentQuestionIndex]}
        User's answer: ${answer}
        Carefully analyze the user's answer. Provide your evaluation in the following format:
        Correctness: [CORRECT/PARTIALLY CORRECT/INCORRECT]
        Explanation: [Brief explanation of why the answer is correct, partially correct, or incorrect]
        Improvement suggestions: [If applicable, provide brief suggestions for improvement]
        Be thorough in your analysis, considering both the technical accuracy and completeness of the answer.`;
  
      const result = await ollama.chat({
        model: 'gemma:2b',
        messages: [{ role: 'User', content: prompt }],
      });
      setResponse(result.message.content);
      setResponseRead(true); // Set the state variable to true
      
      setQuestionHistory(prevHistory => [
        ...prevHistory,
        {
          question: questions[currentQuestionIndex],
          answer: answer,
          evaluation: result.message.content
        }
      ]);
    } catch (error) {
      console.error('Error verifying answer:', error);
      moveToNextQuestion();
    } finally {
      setIsLoading(false); // Set loading to false after the API call completes
    }
  };

  const moveToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setAnswer('');
      setResponse('');
      setQuizState('READY');
    } else {
      setQuizState('COMPLETE');
      readAloud(`That was the last question, ${formData.name}. The interview is complete.`);
    }
  };

  return (
    <div className='p-10'>
      <div className='w-full flex justify-center items-center flex-col'>
        <h2 className='text-2xl font-semibold font-serif mb-5 text-black'>Live Interview</h2> 
      </div>
      {quizState === 'NOT_STARTED' ? (
        <>
          <p className=' font-serif'>
            <span className='text-red-600 font-semibold text-lg font-serif'>Instructions :</span><br></br>
            Welcome to your live interview! I'm your AI interviewer, ready to assess your skills
            based on the information you provide. Here's how it works:
            <ol className='list-disc ml-10 m-2'>
              <li>First,Click on live interview and fill the basic form.</li>
              <li>I'll ask you a series of questions from your form input  tailored to your experience level.</li>
              <li>When you're ready to answer, click the "Start Answering" button and speak your response clearly.</li>
              <li>Once you've finished, click "Submit Answer" to submit your response.</li>
              <li>I'll then evaluate your answer, providing instant feedback on your performance.</li>
              <li>We'll go through several questions to thoroughly assess your knowledge.</li>
            </ol>

            Remember, this is your chance to showcase your skills, so take a deep breath and answer with confidence.
            Speak clearly and explain your thought process – I'm here to understand your coding expertise, not just hear correct answers.
            Are you ready to demonstrate your Python prowess? When you feel prepared, click the "Start Interview" button below to begin your interview. 
            Good luck!
          </p>
        
          <div className='flex justify-center mt-5'>
            {!showForm ? (
              <button onClick={handleStartInterview} className='px-2 py-1 bg-green-600 text-white font-serif rounded-md'>
                Start Now
              </button>
            ) : (
              <div className=' fixed inset-0 bg-black  bg-opacity-50 w-full h-screen flex items-center justify-center '>
              <div className='p-5 bg-white rounded-md'>
              <InterviewForm 
                formData={formData}
                onChange={handleFormChange}
                onSubmit={handleFormSubmit}
              />

              </div>
              </div>
             
            )}
          </div>
        </>
      ) : quizState !== 'COMPLETE' ? (
        <>
          <p className='text-lg font-semibold mb-1'>Question {currentQuestionIndex + 1} of {questions.length}:</p>
          <p className='mb-1'>{questions[currentQuestionIndex]}</p>
          <button onClick={startListening} disabled={isListening || quizState !== 'ANSWERING'} className='px-2 py-1 bg-green-600 text-white text-sm rounded-md mr-2'>
            Start Answering
          </button>
          <button onClick={stopListening} disabled={!isListening || quizState !== 'ANSWERING'} className='px-2 py-1 bg-cyan-600 text-white text-sm rounded-md'>
            Submit Answer
          </button>
          <div className='m-2 '>
            <h3 className='font-serif font-semibold'>Your Answer:</h3>
            <p>{answer}</p>
          </div>
          <div className='m-2 '>
              <h3 className='font-serif font-semibold'>Evaluation:</h3>
              {isLoading ? (
                <p>Loading evaluation...</p>
              ) : (
                <Markdown>{response}</Markdown>
              )}
            </div>
        </>
      ) : (
        <p>Interview completed!</p>
      )}
    </div>
  );
};

export default VoiceInput;

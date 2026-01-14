import { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Alert,
  Divider,
  Select,
  MenuItem,
  InputLabel,
  Chip,
  Stack
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { questions } from '../data/questions';
import type { Question } from '../data/questions';

export default function QuestionComponent() {
  const { questionId } = useParams<{ questionId: string }>();
  const navigate = useNavigate();
  const currentQuestionId = parseInt(questionId || '1', 10);
  // Only show questions 1-6
  const availableQuestions = questions.filter(q => q.id <= 6);
  
  // Redirect if trying to access question 7 or higher
  useEffect(() => {
    if (currentQuestionId > 6) {
      navigate('/question/1');
    }
  }, [currentQuestionId, navigate]);
  
  const question = availableQuestions.find(q => q.id === currentQuestionId);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showAnswer, setShowAnswer] = useState(false);

  // Load saved answers from localStorage
  useEffect(() => {
    const savedAnswers = localStorage.getItem(`question_${currentQuestionId}_answers`);
    if (savedAnswers) {
      setAnswers(JSON.parse(savedAnswers));
    }
  }, [currentQuestionId]);

  // Save answers to localStorage whenever they change
  useEffect(() => {
    if (Object.keys(answers).length > 0) {
      localStorage.setItem(`question_${currentQuestionId}_answers`, JSON.stringify(answers));
    }
  }, [answers, currentQuestionId]);

  if (!question) {
    return (
      <Container>
        <Typography>Question not found</Typography>
      </Container>
    );
  }

  const handleAnswerChange = (key: string, value: string) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const handleAutoFill = () => {
    const newAnswers: Record<string, string> = {};
    
    if (question.subQuestions) {
      // Handle questions with sub-questions
      question.subQuestions.forEach((subQ, idx) => {
        const answerKey = `sub_${idx}`;
        
        // For True/False questions, convert 'T'/'F' to 'A'/'B'
        if (question.type === 'truefalse' && question.options) {
          const correctValue = subQ.correctAnswer; // 'T' or 'F'
          const optionIndex = question.options.indexOf(correctValue);
          if (optionIndex !== -1) {
            newAnswers[answerKey] = String.fromCharCode(65 + optionIndex); // 'A' or 'B'
          } else {
            newAnswers[answerKey] = subQ.correctAnswer;
          }
        } else {
          // For other questions, use the correctAnswer directly (already a letter like 'A', 'B', etc.)
          newAnswers[answerKey] = subQ.correctAnswer;
        }
      });
    } else {
      // Handle single answer questions
      if (typeof question.correctAnswer === 'string') {
        newAnswers['main'] = question.correctAnswer;
      }
    }
    
    setAnswers(newAnswers);
    // Save to localStorage immediately
    localStorage.setItem(`question_${currentQuestionId}_answers`, JSON.stringify(newAnswers));
  };

  const handleSubmit = () => {
    // Save answers when submitting
    localStorage.setItem(`question_${currentQuestionId}_answers`, JSON.stringify(answers));
    setShowAnswer(true);
  };

  const handleNext = () => {
    // Save current answers before moving
    localStorage.setItem(`question_${currentQuestionId}_answers`, JSON.stringify(answers));
    
    if (currentQuestionId < 6) {
      // Go to next question (only up to question 6)
      const nextQuestion = availableQuestions.find(q => q.id > currentQuestionId);
      if (nextQuestion) {
        navigate(`/question/${nextQuestion.id}`);
        setShowAnswer(false);
        setAnswers({});
      }
    } else {
      // After question 6, go to results
      navigate('/results');
    }
  };

  const handlePrevious = () => {
    if (currentQuestionId > 1) {
      // Save current answers before moving
      localStorage.setItem(`question_${currentQuestionId}_answers`, JSON.stringify(answers));
      
      const prevQuestion = availableQuestions.find(q => q.id < currentQuestionId);
      if (prevQuestion) {
        navigate(`/question/${prevQuestion.id}`);
        setShowAnswer(false);
        setAnswers({});
      }
    }
  };

  const isCorrect = (): boolean => {
    // Special handling for Question 12
    if (question.id === 12) {
      const partA = (answers['part_a'] || '').trim().toLowerCase();
      return partA === 'o(n)' || partA === 'o(n)';
    }

    if (Array.isArray(question.correctAnswer)) {
      if (question.subQuestions) {
        return question.subQuestions.every((subQ, idx) => {
          const answerKey = `sub_${idx}`;
          const selectedAnswer = answers[answerKey];
          
          // For True/False questions, convert letter index to option value
          if (question.type === 'truefalse' && question.options && selectedAnswer) {
            const selectedOption = question.options[selectedAnswer.charCodeAt(0) - 65];
            return selectedOption === subQ.correctAnswer;
          }
          
          // For other questions, compare directly
          return selectedAnswer === subQ.correctAnswer;
        });
      }
      return question.correctAnswer.every((ans, idx) => {
        const answerKey = `sub_${idx}`;
        return answers[answerKey] === ans;
      });
    } else {
      const answer = answers['main'] || '';
      // Handle multiple choice (single letter answer like 'A', 'B', etc.)
      if (question.options && question.correctAnswer.length === 1) {
        return answer === question.correctAnswer;
      }
      // Handle text answers
      return answer.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase();
    }
  };

  const renderQuestionContent = () => {
    if (question.subQuestions) {
      // Special handling for ranking questions (Question 11)
      if (question.id === 11) {
        return question.subQuestions.map((subQ, idx) => (
          <Box key={idx} sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body1" sx={{ minWidth: 120 }}>
              {subQ.label}:
            </Typography>
            <FormControl sx={{ minWidth: 120 }} disabled={showAnswer}>
              <InputLabel>Rank</InputLabel>
              <Select
                value={answers[`sub_${idx}`] || ''}
                onChange={(e) => handleAnswerChange(`sub_${idx}`, e.target.value)}
                label="Rank"
              >
                {question.options?.map((opt, optIdx) => (
                  <MenuItem key={optIdx} value={opt}>
                    {opt}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {showAnswer && (
              <Chip
                label={answers[`sub_${idx}`] === subQ.correctAnswer ? 'Correct' : 'Incorrect'}
                color={answers[`sub_${idx}`] === subQ.correctAnswer ? 'success' : 'error'}
                size="small"
              />
            )}
          </Box>
        ));
      }

      return question.subQuestions.map((subQ, idx) => (
        <Box key={idx} sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            {subQ.label}
          </Typography>
          {subQ.code && (
            <Paper
              elevation={1}
              sx={{
                p: 2,
                mb: 2,
                backgroundColor: '#f5f5f5',
                fontFamily: 'monospace',
                fontSize: '0.875rem',
                whiteSpace: 'pre-wrap',
                overflow: 'auto'
              }}
            >
              {subQ.code}
            </Paper>
          )}
          {question.options && (
            <FormControl component="fieldset" sx={{ mt: 1 }}>
              <RadioGroup
                value={answers[`sub_${idx}`] || ''}
                onChange={(e) => handleAnswerChange(`sub_${idx}`, e.target.value)}
                disabled={showAnswer}
              >
                {question.options.map((option, optIdx) => {
                  // Check if option already has a letter prefix (e.g., "A. ", "B. ", etc.)
                  const hasLetterPrefix = /^[A-Z]\.\s/.test(option);
                  const optionLabel = option.startsWith('O(') || hasLetterPrefix
                    ? option 
                    : String.fromCharCode(65 + optIdx) + '. ' + option;
                  return (
                    <FormControlLabel
                      key={optIdx}
                      value={String.fromCharCode(65 + optIdx)}
                      control={<Radio />}
                      label={optionLabel}
                    />
                  );
                })}
              </RadioGroup>
            </FormControl>
          )}
          {showAnswer && (
            <Box sx={{ mt: 1 }}>
              <Chip
                label={(() => {
                  // For True/False questions, convert between letter index and option value
                  if (question.type === 'truefalse' && question.options) {
                    const selectedLetter = answers[`sub_${idx}`]; // 'A' or 'B'
                    const selectedOption = question.options[selectedLetter?.charCodeAt(0) - 65]; // 'T' or 'F'
                    return selectedOption === subQ.correctAnswer ? 'Correct' : 'Incorrect';
                  }
                  // For other questions, compare directly
                  return answers[`sub_${idx}`] === subQ.correctAnswer ? 'Correct' : 'Incorrect';
                })()}
                color={(() => {
                  if (question.type === 'truefalse' && question.options) {
                    const selectedLetter = answers[`sub_${idx}`];
                    const selectedOption = question.options[selectedLetter?.charCodeAt(0) - 65];
                    return selectedOption === subQ.correctAnswer ? 'success' : 'error';
                  }
                  return answers[`sub_${idx}`] === subQ.correctAnswer ? 'success' : 'error';
                })()}
                size="small"
              />
            </Box>
          )}
        </Box>
      ));
    }

    if (question.type === 'shortanswer' || question.type === 'code') {
      // Special handling for Question 12 which has multiple parts
      if (question.id === 12) {
        return (
          <Box sx={{ mt: 2 }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                a) What is the Big-O runtime complexity of this method?
              </Typography>
              <TextField
                fullWidth
                value={answers['part_a'] || ''}
                onChange={(e) => handleAnswerChange('part_a', e.target.value)}
                disabled={showAnswer}
                placeholder="e.g., O(N)"
                sx={{ mt: 1 }}
              />
            </Box>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                b) If n = 5, what value would be returned?
              </Typography>
              <TextField
                fullWidth
                value={answers['part_b'] || ''}
                onChange={(e) => handleAnswerChange('part_b', e.target.value)}
                disabled={showAnswer}
                placeholder="Enter the value"
                sx={{ mt: 1 }}
              />
            </Box>
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                c) Show your work for part (b):
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={6}
                value={answers['part_c'] || ''}
                onChange={(e) => handleAnswerChange('part_c', e.target.value)}
                disabled={showAnswer}
                placeholder="Show your calculations..."
                sx={{ mt: 1 }}
              />
            </Box>
          </Box>
        );
      }

      return (
        <TextField
          fullWidth
          multiline
          rows={question.type === 'code' ? 12 : 6}
          value={answers['main'] || ''}
          onChange={(e) => handleAnswerChange('main', e.target.value)}
          disabled={showAnswer}
          placeholder="Enter your answer here..."
          sx={{ mt: 2 }}
        />
      );
    }

    // Handle multiple choice questions (bigo type with options but no subQuestions)
    if (question.type === 'bigo' && question.options && !question.subQuestions) {
      return (
        <FormControl component="fieldset" sx={{ mt: 2 }}>
          <RadioGroup
            value={answers['main'] || ''}
            onChange={(e) => handleAnswerChange('main', e.target.value)}
            disabled={showAnswer}
          >
            {question.options.map((option, optIdx) => {
              const optionLabel = String.fromCharCode(65 + optIdx) + '. ' + option;
              return (
                <FormControlLabel
                  key={optIdx}
                  value={String.fromCharCode(65 + optIdx)}
                  control={<Radio />}
                  label={
                    <Box sx={{ fontFamily: 'monospace', fontSize: '0.875rem', whiteSpace: 'pre-wrap' }}>
                      {optionLabel}
                    </Box>
                  }
                />
              );
            })}
          </RadioGroup>
        </FormControl>
      );
    }

    return null;
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Question {currentQuestionId}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {currentQuestionId} of 6
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Typography variant="h5" component="h2" gutterBottom>
          {question.title}
        </Typography>

        <Typography variant="body1" paragraph sx={{ mt: 2 }}>
          {question.content}
        </Typography>

        {question.code && (
          <Paper
            elevation={1}
            sx={{
              p: 2,
              mb: 3,
              backgroundColor: '#f5f5f5',
              fontFamily: 'monospace',
              fontSize: '0.875rem',
              whiteSpace: 'pre-wrap',
              overflow: 'auto'
            }}
          >
            {question.code}
          </Paper>
        )}

        {renderQuestionContent()}

        {!showAnswer && (
          <Box sx={{ mt: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              <Button
                variant="outlined"
                color="secondary"
                size="small"
                onClick={handleAutoFill}
                sx={{ fontSize: '0.75rem' }}
              >
                Auto-Fill Correct Answers (Testing)
              </Button>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={handlePrevious}
                disabled={currentQuestionId === 1}
              >
                Previous
              </Button>
              <Box sx={{ flexGrow: 1 }} />
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={
                  question.id === 12
                    ? !answers['part_a'] || !answers['part_b'] || !answers['part_c']
                    : Object.keys(answers).length === 0
                }
              >
                Submit Answer
              </Button>
              <Button
                variant="outlined"
                onClick={handleNext}
                disabled={currentQuestionId >= 6}
              >
                Next
              </Button>
            </Box>
          </Box>
        )}

        {showAnswer && (
          <Box sx={{ mt: 4 }}>
            <Divider sx={{ mb: 3 }} />
            <Alert
              severity={isCorrect() ? 'success' : 'info'}
              sx={{ mb: 3 }}
            >
              {isCorrect() 
                ? 'Correct! Well done.' 
                : "Let's review the correct answer and explanation."}
            </Alert>

            <Typography variant="h6" gutterBottom>
              Correct Answer:
            </Typography>
            {question.id === 12 ? (
              <Box sx={{ mb: 3 }}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    a) Big-O runtime complexity:
                  </Typography>
                  <Typography variant="body1">O(N)</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    b) Value returned when n = 5:
                  </Typography>
                  <Typography variant="body1">55</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" fontWeight="bold">
                    c) Work:
                  </Typography>
                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      mt: 1,
                      backgroundColor: '#f5f5f5',
                      fontFamily: 'monospace',
                      fontSize: '0.875rem',
                      whiteSpace: 'pre-wrap'
                    }}
                  >
                    {question.explanation.split('c) Show your work:')[1]?.trim() || 
                     question.explanation.split('Show your work:')[1]?.trim() || 
                     'See explanation below'}
                  </Paper>
                </Box>
              </Box>
            ) : Array.isArray(question.correctAnswer) ? (
              <Box sx={{ mb: 3 }}>
                {question.subQuestions?.map((subQ, idx) => {
                  // For True/False questions, correctAnswer is already 'T' or 'F'
                  // For other questions with letter indices, convert A->0, B->1, etc.
                  let displayAnswer = subQ.correctAnswer;
                  if (question.type === 'truefalse') {
                    // For True/False, the correctAnswer is already the value
                    displayAnswer = subQ.correctAnswer;
                  } else if (question.id === 11) {
                    // For ranking question, show the rank number
                    displayAnswer = subQ.correctAnswer;
                  } else if (question.options) {
                    // For other questions, convert letter to option index
                    const optionIndex = subQ.correctAnswer.charCodeAt(0) - 65;
                    displayAnswer = question.options[optionIndex] || subQ.correctAnswer;
                  }
                  
                  return (
                    <Box key={idx} sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {subQ.label}:
                      </Typography>
                      <Typography variant="body1">
                        {displayAnswer}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            ) : question.options && !question.subQuestions ? (
              <Box sx={{ mb: 3 }}>
                <Typography variant="body1" fontWeight="bold">
                  Correct Answer: {question.correctAnswer}
                </Typography>
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    mt: 1,
                    backgroundColor: '#f5f5f5',
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                    whiteSpace: 'pre-wrap',
                    overflow: 'auto'
                  }}
                >
                  {question.options[question.correctAnswer.charCodeAt(0) - 65]}
                </Paper>
              </Box>
            ) : (
              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  mb: 3,
                  backgroundColor: '#f5f5f5',
                  fontFamily: question.type === 'code' ? 'monospace' : 'inherit',
                  fontSize: question.type === 'code' ? '0.875rem' : 'inherit',
                  whiteSpace: 'pre-wrap',
                  overflow: 'auto'
                }}
              >
                {question.correctAnswer}
              </Paper>
            )}

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Explanation:
            </Typography>
            <Paper
              elevation={1}
              sx={{
                p: 2,
                mb: 3,
                backgroundColor: '#e3f2fd',
                whiteSpace: 'pre-wrap'
              }}
            >
              <Typography variant="body1">
                {question.explanation}
              </Typography>
            </Paper>

            <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
              <Button
                variant="outlined"
                onClick={handlePrevious}
                disabled={currentQuestionId === 1}
              >
                Previous
              </Button>
              <Box sx={{ flexGrow: 1 }} />
              {currentQuestionId < 6 ? (
                <Button
                  variant="contained"
                  onClick={handleNext}
                >
                  Next Question
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={() => {
                    // Ensure answers are saved before navigating
                    localStorage.setItem(`question_${currentQuestionId}_answers`, JSON.stringify(answers));
                    // Small delay to ensure localStorage is updated
                    setTimeout(() => {
                      navigate('/results');
                    }, 100);
                  }}
                >
                  View Results
                </Button>
              )}
            </Box>
          </Box>
        )}
      </Paper>
    </Container>
  );
}

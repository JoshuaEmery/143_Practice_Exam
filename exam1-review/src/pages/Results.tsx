import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  LinearProgress,
  Divider
} from '@mui/material';
import { questions } from '../data/questions';

export default function Results() {
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);

  useEffect(() => {
    // Small delay to ensure localStorage is fully updated
    const timer = setTimeout(() => {
      // Get all answers from localStorage
      const allAnswers: Record<number, Record<string, string>> = {};
      for (let i = 1; i <= 6; i++) {
        const answers = localStorage.getItem(`question_${i}_answers`);
        if (answers) {
          try {
            allAnswers[i] = JSON.parse(answers);
          } catch (e) {
            console.error(`Error parsing answers for question ${i}:`, e);
          }
        }
      }

      // Calculate score
      let correct = 0;
      let total = 0;

      questions.filter(q => q.id <= 6).forEach(question => {
        const questionAnswers = allAnswers[question.id] || {};
        
        if (question.subQuestions) {
          question.subQuestions.forEach((subQ, idx) => {
            const answerKey = `sub_${idx}`;
            const selectedAnswer = questionAnswers[answerKey];
            
            // Only count questions that have answers
            if (!selectedAnswer) {
              return;
            }
            
            total++; // Only increment total when we have an answer to evaluate
            
            // For True/False questions, convert letter index to option value
            if (question.type === 'truefalse' && question.options) {
              const selectedOption = question.options[selectedAnswer.charCodeAt(0) - 65];
              if (selectedOption === subQ.correctAnswer) {
                correct++;
              }
            } else if (selectedAnswer === subQ.correctAnswer) {
              correct++;
            }
          });
        } else {
          const answer = questionAnswers['main'] || '';
          
          // Only count questions that have answers
          if (!answer) {
            return;
          }
          
          total++; // Only increment total when we have an answer to evaluate
          
          // Handle multiple choice (single letter answer like 'A', 'B', etc.)
          if (question.options && typeof question.correctAnswer === 'string' && question.correctAnswer.length === 1) {
            if (answer === question.correctAnswer) {
              correct++;
            }
          } else if (typeof question.correctAnswer === 'string') {
            // Handle text answers
            if (answer.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase()) {
              correct++;
            }
          }
        }
      });

      setScore(correct);
      setTotalQuestions(total);
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

  const handleRestart = () => {
    // Clear all stored answers
    for (let i = 1; i <= 6; i++) {
      localStorage.removeItem(`question_${i}_answers`);
    }
    navigate('/question/1');
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Practice Test Complete!
        </Typography>
        
        <Divider sx={{ my: 3 }} />

        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" component="div" gutterBottom>
            Final Score
          </Typography>
          <Typography variant="h2" component="div" color="primary" sx={{ mb: 2 }}>
            {score} / {totalQuestions}
          </Typography>
          <Typography variant="h5" component="div" color="text.secondary">
            {percentage}%
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <LinearProgress 
            variant="determinate" 
            value={percentage} 
            sx={{ height: 20, borderRadius: 1 }}
          />
        </Box>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleRestart}
            sx={{ px: 4, py: 1.5 }}
          >
            Take Practice Exam Again
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/')}
            sx={{ px: 4, py: 1.5 }}
          >
            Back to Home
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

import { Button, Container, Typography, Box, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          CS 143 Practice Test
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom align="center" color="text.secondary">
          Exceptions and O Notation
        </Typography>
        
        <Box sx={{ mt: 4, mb: 4 }}>
          <Typography variant="body1" paragraph>
            This practice test contains questions covering:
          </Typography>
          <Typography component="ul" sx={{ pl: 3 }}>
            <li>Exception Handling</li>
            <li>Big-O Notation Analysis</li>
            <li>Code Tracing</li>
            <li>Code Writing</li>
          </Typography>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="body2" color="text.secondary" paragraph>
            Instructions:
          </Typography>
          <Typography component="ul" variant="body2" sx={{ pl: 3, mb: 3 }}>
            <li>Answer each question to the best of your ability</li>
            <li>After submitting your answer, you'll see the correct answer and explanation</li>
            <li>Review the explanation before moving to the next question</li>
            <li>You can navigate between questions using the navigation buttons</li>
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/question/1')}
            sx={{ px: 4, py: 1.5 }}
          >
            Start Test
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

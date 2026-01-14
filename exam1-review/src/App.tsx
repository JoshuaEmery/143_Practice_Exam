import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import Home from './pages/Home';
import Question from './components/Question';
import Results from './pages/Results';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/question/:questionId" element={<Question />} />
          <Route path="/results" element={<Results />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

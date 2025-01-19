import { render, screen } from '@testing-library/react';
import App from './src/App';

test('renders the Login page correctly', () => {
  render(<App />);
  expect(screen.getByText(/Welcome to the Login Page/i)).toBeInTheDocument();
});


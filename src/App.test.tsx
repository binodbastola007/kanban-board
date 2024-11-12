import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders To Do column', () => {
    render(<App />);
    const columnElement = screen.getByText(/To Do/i);
    expect(columnElement).toBeInTheDocument();
});

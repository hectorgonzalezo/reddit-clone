import React from 'react';
import { render, screen, container } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import Button from '../components/Button';

describe('Styled button works', () => {
  test('Renders text', () => {
    render(<Button text="Text" />);
    expect(screen.getByRole('button', { name: 'Text' })).toBeInTheDocument();

    expect(container).toMatchSnapshot();
  });
  test('Can make clear button', () => {
    render(<Button light />);
    expect(screen.getByRole('button')).toHaveStyle('background-color: white');

    expect(container).toMatchSnapshot();
  });


  test('Calls onclick function', () => {
    const mockFunc = jest.fn();
    render(<Button onClick={mockFunc} />);
    const button = screen.getByRole('button');
    userEvent.click(button);

    expect(mockFunc).toBeCalled();
  });
})
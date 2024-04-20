import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

beforeEach(() => {
  // Interacting with the Spotify API requires valid token values
  // The testing currently requires copying the localStorage/sessionstorage values
  // from the browser to bypass going through the login popup in the tests
  const accessTokenVal = 'BQC_urOK9MmWHJMUTn0ziAu9XP2-BQU7b9mb_uNzZ_6tMX3q3fitMDmh3QVt3CJp4gkUoq6uz2hF5jY49qzbRlNaB1InuScLX84W4lxFK10sE8yBZOMQiGEatY8KMgoYU2WUeI2HsaSmaMchTUoN69LlK2ZCtcGke67yFPlJuELkfUaYOeqbR297n1dky0Tr4GzQ9bkJGI2TZLMILq0tWrXtNG6LXWb0y4G6ZNxU6iUbRO_Q11XC8Vlu4TA';
  const expireVal = '9999999999999';
  const refreshTokenVal = 'AQANZfPP98zHLQXhuss776OXI11bfhhL41U7aQ-L1NlDcnaYPN2NM9q7xISJctQP5aPGL9tqDkHX0s9lnYoE4TC1EGKVpkkXxd_3D2snl-UZczn4GzJnkrPSBK1rIqWelqA';
  sessionStorage.setItem('access_token', accessTokenVal);
  sessionStorage.setItem('expires_at', expireVal);
  localStorage.setItem('refresh_token', refreshTokenVal);
});

afterEach(() => {
  cleanup();
});

describe("testing App", () => {
  test('app displays correctly when logged in', () => {
    render(<App />);
    const searchBtn = screen.getByLabelText('search');
    expect(searchBtn).toBeInTheDocument();
  });

  // Interacting with the Spotify API requires valid token values
  test('Saving then deleting a playlist is successful', async () => {
    render(<App />);
    // await waitFor(() => expect(screen.getByTestId('SavedList testpl')).toHaveTextContent('testpl'), {timeout: 4000, interval: 400});
    fireEvent.click(screen.getAllByLabelText('Toggle details')[0]);
    fireEvent.change(screen.getByPlaceholderText('Track (optional)'), {target: {value: 'dancing mad'}})
    fireEvent.change(screen.getByPlaceholderText('Album (optional)'), {target: {value: 'vi original'}})
    fireEvent.click(screen.getByLabelText('search'));
    await waitFor(() => expect(screen.getAllByTestId('searchResults')[0]).toHaveTextContent('Uematsu'), {timeout: 4000, interval: 400});
    fireEvent.click(screen.getAllByLabelText('Add')[0]);
    fireEvent.change(screen.getByPlaceholderText('New Playlist'), {target: {value: 'automated playlist test'}})
    fireEvent.click(screen.getAllByText('Save to Spotify')[0]);
    await waitFor(() => expect(screen.getByTestId('SavedList automated playlist test')).toHaveTextContent('automated playlist test'), {timeout: 4800, interval: 400});
    fireEvent.click(screen.getByTestId('Delete automated playlist test'));
    fireEvent.click(screen.getByTestId('Confirm delete'));
    await waitFor(() => expect(screen.getAllByTestId('savedlists')[0]).not.toHaveTextContent('automated playlist test'), {timeout: 4800, interval: 400});
  }, 15000);
});

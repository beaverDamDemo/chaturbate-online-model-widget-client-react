import { renderWithProviders, screen } from '../test-utils';
import { LoginPage } from './login-page';

describe('LoginPage', () => {
  it('renders login form and header', () => {
    renderWithProviders(<LoginPage />);
    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
    expect(screen.getByText(/access portal/i)).toBeInTheDocument();
  });
});

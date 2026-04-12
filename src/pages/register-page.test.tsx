import { renderWithProviders, screen } from '../test-utils';
import { RegisterPage } from './register-page';

describe('RegisterPage', () => {
  it('renders register form and header', () => {
    renderWithProviders(<RegisterPage />);
    // There are multiple elements with 'register', so check at least one exists
    expect(screen.getAllByText(/register/i).length).toBeGreaterThan(0);
  });
});

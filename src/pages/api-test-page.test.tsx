import { renderWithProviders, screen } from '../test-utils';
import { ApiTestPage } from './api-test-page';

describe('ApiTestPage', () => {
  it('renders API test page header', () => {
    renderWithProviders(<ApiTestPage />);
    expect(screen.getByText(/public api test/i)).toBeInTheDocument();
  });
});

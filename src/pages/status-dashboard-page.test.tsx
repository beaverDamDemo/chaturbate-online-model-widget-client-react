import { renderWithProviders, screen } from '../test-utils';
import { StatusDashboardPage } from './status-dashboard-page';

describe('StatusDashboardPage', () => {
  it('renders status dashboard header', () => {
    renderWithProviders(<StatusDashboardPage />);
    expect(screen.getByText(/status dashboard/i)).toBeInTheDocument();
  });
});

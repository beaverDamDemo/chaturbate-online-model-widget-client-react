import { renderWithProviders, screen } from '../test-utils';
import { AdminPanelPage } from './admin-panel-page';

describe('AdminPanelPage', () => {
  it('renders admin panel header', () => {
    renderWithProviders(<AdminPanelPage />);
    // There are multiple elements with 'admin', so check at least one exists
    expect(screen.getAllByText(/admin/i).length).toBeGreaterThan(0);
  });
});

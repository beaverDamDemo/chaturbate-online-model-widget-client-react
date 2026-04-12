import { renderWithProviders, screen } from '../test-utils';
import { AccountPage } from './account-page';

describe('AccountPage', () => {
  it('renders without crashing', () => {
    expect(() => renderWithProviders(<AccountPage />)).not.toThrow();
  });
});


import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderWithProviders, screen } from '../test-utils';
import { ApiTestPage } from './api-test-page';

describe('ApiTestPage', () => {
  it('renders API test page header', async () => {
    await renderWithProviders(<ApiTestPage />);
    expect(screen.getByText(/public api test/i)).toBeInTheDocument();
  });
});

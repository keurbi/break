// @ts-nocheck
import { render, screen } from '@testing-library/react';
jest.mock('next/router', () => ({
  useRouter: () => ({ pathname: '/welcome', push: jest.fn(), prefetch: jest.fn() }),
}));
import Sidebar from '../src/components/Sidebar';
describe('Sidebar', () => {
  it('renders sidebar', () => {
    render(<Sidebar />);
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
  });
  it('does not render Managers when role is not manager', async () => {
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);
    render(<Sidebar />);
    expect(screen.queryByText(/Managers/i)).not.toBeInTheDocument();
  });
  it('renders Managers when role is manager', async () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key: string) => (key === 'role' ? 'manager' : null));
    render(<Sidebar />);
    // Icon Users has no accessible name, search by all links then match href
    const links = screen.getAllByRole('link');
    const managersLink = links.find((a) => a.getAttribute('href') === '/managers');
    expect(managersLink).toBeTruthy();
  });
});

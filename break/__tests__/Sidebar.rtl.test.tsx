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
});

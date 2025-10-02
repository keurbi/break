// @ts-nocheck
import { fireEvent, render, screen } from '@testing-library/react';
import MobileNav from '../src/components/MobileNav';

describe('MobileNav', () => {
  it('opens and closes the drawer', () => {
    render(<MobileNav />);
    const button = screen.getByTestId('hamburger');
    fireEvent.click(button);
    expect(screen.getByTestId('mobile-drawer')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('backdrop'));
    expect(screen.queryByTestId('mobile-drawer')).toBeNull();
  });
});

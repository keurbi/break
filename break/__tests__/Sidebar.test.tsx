import { render, screen } from "@testing-library/react";
import Sidebar from "../src/components/Sidebar";

// Mock next/router
jest.mock("next/router", () => ({
  useRouter: () => ({ pathname: "/breaks" }),
}));

describe("Sidebar", () => {
  afterEach(() => {
    localStorage.clear();
  });

  it("n’affiche pas Managers si role=user", () => {
    localStorage.setItem("role", "user");
    render(<Sidebar />);
    const managersIcon = screen.queryByLabelText(/managers/i);
    expect(managersIcon).not.toBeInTheDocument();
  });

  it("affiche Managers si role=manager", () => {
    localStorage.setItem("role", "manager");
    render(<Sidebar />);
    // On cible le lien /managers par son href
    const links = screen.getAllByRole("link");
    const hasManagers = links.some(
      (a) => (a as HTMLAnchorElement).getAttribute("href") === "/managers"
    );
    expect(hasManagers).toBe(true);
  });
});

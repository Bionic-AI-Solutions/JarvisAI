import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import Sidebar from '../components/Sidebar';

function renderWithRouter(ui: React.ReactElement) {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
}

describe('Sidebar', () => {
  it('renders brand name', () => {
    renderWithRouter(<Sidebar />);
    expect(screen.getByText('Jarvis AI')).toBeInTheDocument();
  });

  it('renders Enterprise tag', () => {
    renderWithRouter(<Sidebar />);
    expect(screen.getByText('Enterprise')).toBeInTheDocument();
  });

  it('renders all navigation sections', () => {
    renderWithRouter(<Sidebar />);
    expect(screen.getByText('Main')).toBeInTheDocument();
    expect(screen.getByText('Tools')).toBeInTheDocument();
    expect(screen.getByText('System')).toBeInTheDocument();
  });

  it('renders all navigation links', () => {
    renderWithRouter(<Sidebar />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('API Documentation')).toBeInTheDocument();
    expect(screen.getByText('Rate Limits')).toBeInTheDocument();
    expect(screen.getByText('Shell Completion')).toBeInTheDocument();
    expect(screen.getByText('CLI Help')).toBeInTheDocument();
    expect(screen.getByText('Monitoring')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('renders version info', () => {
    renderWithRouter(<Sidebar />);
    expect(screen.getByText('v1.0.0')).toBeInTheDocument();
    expect(screen.getByText('Phase 2A')).toBeInTheDocument();
  });

  it('renders navigation links with correct hrefs', () => {
    renderWithRouter(<Sidebar />);
    const dashboardLink = screen.getByText('Dashboard').closest('a');
    expect(dashboardLink).toHaveAttribute('href', '/');

    const apiDocsLink = screen.getByText('API Documentation').closest('a');
    expect(apiDocsLink).toHaveAttribute('href', '/api-docs');

    const settingsLink = screen.getByText('Settings').closest('a');
    expect(settingsLink).toHaveAttribute('href', '/settings');
  });
});

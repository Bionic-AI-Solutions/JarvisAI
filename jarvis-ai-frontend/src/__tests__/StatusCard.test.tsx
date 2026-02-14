import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import StatusCard from '../components/StatusCard';

describe('StatusCard', () => {
  it('renders title and value', () => {
    render(<StatusCard title="Test Title" value="42" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('renders subtitle when provided', () => {
    render(<StatusCard title="Title" value="100" subtitle="Some details" />);
    expect(screen.getByText('Some details')).toBeInTheDocument();
  });

  it('does not render subtitle when not provided', () => {
    const { container } = render(<StatusCard title="Title" value="100" />);
    expect(container.querySelector('.status-card-subtitle')).toBeNull();
  });

  it('applies correct status class', () => {
    const { container } = render(<StatusCard title="Title" value="OK" status="success" />);
    expect(container.querySelector('.status-card-success')).toBeTruthy();
  });

  it('defaults to info status', () => {
    const { container } = render(<StatusCard title="Title" value="OK" />);
    expect(container.querySelector('.status-card-info')).toBeTruthy();
  });

  it('renders icon when provided', () => {
    render(<StatusCard title="Title" value="1" icon={<span data-testid="icon">★</span>} />);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('accepts numeric values', () => {
    render(<StatusCard title="Count" value={99} />);
    expect(screen.getByText('99')).toBeInTheDocument();
  });
});

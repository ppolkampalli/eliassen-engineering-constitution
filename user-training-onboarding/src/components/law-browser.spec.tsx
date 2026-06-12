import { fireEvent, render, screen } from '@testing-library/react';

import { LawBrowser } from './law-browser';
import { getAllLaws } from '../domain/registry';


describe('LawBrowser', () => {
  it('should show every law when no filter is applied', () => {
    render(<LawBrowser />);
    expect(screen.getByText(`${getAllLaws().length} laws`)).toBeTruthy();
  });

  it('should filter to the matching law when searching by id', () => {
    render(<LawBrowser />);
    fireEvent.change(screen.getByLabelText('Search laws'), { target: { value: 'LAW-2.3' } });
    expect(screen.getByText('1 law')).toBeTruthy();
    expect(screen.getByRole('heading', { name: /LAW-2\.3/ })).toBeTruthy();
  });

  it('should filter by article when an article is selected', () => {
    render(<LawBrowser />);
    fireEvent.change(screen.getByLabelText('Filter by article'), { target: { value: '10' } });
    const article10Count = getAllLaws().filter((law) => law.article === 10).length;
    expect(screen.getByText(`${article10Count} laws`)).toBeTruthy();
  });

  it('should honor an initial query when deep-linked', () => {
    render(<LawBrowser initialQuery="LAW-10.6" />);
    expect(screen.getByText('1 law')).toBeTruthy();
    expect(screen.getByText('Defined Workflows')).toBeTruthy();
  });
});

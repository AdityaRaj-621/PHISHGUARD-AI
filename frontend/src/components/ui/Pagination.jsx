import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from './Button';

export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  pageSize = 20,
  onPageChange,
  className = ''
}) {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div
      className={`ui-pagination ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 'var(--space-3)',
        marginTop: 'var(--space-5)',
        paddingTop: 'var(--space-4)',
        borderTop: '1px solid var(--color-border)'
      }}
    >
      <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-text-secondary)' }}>
        Showing {startItem}–{endItem} of {totalItems}
      </span>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
        <Button
          variant="secondary"
          size="sm"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Previous page"
          icon={<ChevronLeft size={16} />}
        />

        {getPageNumbers().map((p) => (
          <Button
            key={p}
            variant={p === currentPage ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => onPageChange(p)}
            aria-current={p === currentPage ? 'page' : undefined}
            style={{ minWidth: '32px', padding: '0 8px' }}
          >
            {p}
          </Button>
        ))}

        <Button
          variant="secondary"
          size="sm"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Next page"
          icon={<ChevronRight size={16} />}
        />
      </div>
    </div>
  );
}

import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, X, RotateCcw, MessageSquare, Plus } from 'lucide-react';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import ScanTable from '../../components/scan/ScanTable';
import ScanCard from '../../components/scan/ScanCard';
import Pagination from '../../components/ui/Pagination';
import EmptyState from '../../components/feedback/EmptyState';
import LoadingState from '../../components/feedback/LoadingState';
import ErrorState from '../../components/feedback/ErrorState';
import scanService from '../../services/scanService';
import { useDebounce } from '../../hooks/useDebounce';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useQueryParams } from '../../hooks/useQueryParams';
import './ScanHistoryPage.css';

export default function ScanHistoryPage() {
  const { getParam, setParam, setMultipleParams } = useQueryParams();

  // URL query state
  const typeFilter = getParam('type', 'all');
  const riskFilter = getParam('risk_level', 'all');
  const sortParam = getParam('ordering', '-created_at');
  const pageParam = Number(getParam('page', '1')) || 1;
  const initialSearch = getParam('search', '');

  const [searchInput, setSearchInput] = useState(initialSearch);
  const debouncedSearch = useDebounce(searchInput, 350);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const isTablet = useMediaQuery('(min-width: 600px) and (max-width: 1023px)');

  // Sync debounced search with URL
  useEffect(() => {
    if (debouncedSearch !== getParam('search', '')) {
      setParam('search', debouncedSearch);
      setParam('page', 1);
    }
  }, [debouncedSearch, getParam, setParam]);

  const fetchScans = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await scanService.listScans({
        type: typeFilter !== 'all' ? typeFilter : undefined,
        risk_level: riskFilter !== 'all' ? riskFilter : undefined,
        search: debouncedSearch || undefined,
        ordering: sortParam,
        page: pageParam,
        page_size: 20
      });
      setData(res);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [typeFilter, riskFilter, debouncedSearch, sortParam, pageParam]);

  useEffect(() => {
    fetchScans();
  }, [fetchScans]);

  const handleClearFilters = () => {
    setSearchInput('');
    setMultipleParams({
      type: 'all',
      risk_level: 'all',
      search: '',
      page: 1
    });
  };

  const hasActiveFilters = typeFilter !== 'all' || riskFilter !== 'all' || debouncedSearch.trim() !== '';

  return (
    <div className="history-page">
      {/* Header */}
      <div className="history-header">
        <div>
          <h1 className="history-title">Scan history</h1>
          <p className="history-subtitle">
            Search, filter, and review all previous security assessments.
          </p>
        </div>

        <Button variant="primary" size="md" to="/scan/message" icon={<Plus size={16} />}>
          New scan
        </Button>
      </div>

      {/* Controls Bar */}
      <Card padding="md" className="history-controls-card">
        <div className="history-controls-grid">
          {/* Search Input */}
          <div className="history-search-col">
            <Input
              name="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by text snippet or threat type…"
              prefixIcon={<Search size={18} />}
              className="history-search-input"
            />
          </div>

          {/* Type Filter */}
          <div className="history-filter-col">
            <Select
              name="type"
              value={typeFilter}
              onChange={(e) => {
                setParam('type', e.target.value);
                setParam('page', 1);
              }}
              options={[
                { value: 'all', label: 'All types' },
                { value: 'message', label: 'Messages' },
                { value: 'url', label: 'Web URLs' },
                { value: 'email', label: 'Emails' }
              ]}
            />
          </div>

          {/* Risk Filter */}
          <div className="history-filter-col">
            <Select
              name="risk_level"
              value={riskFilter}
              onChange={(e) => {
                setParam('risk_level', e.target.value);
                setParam('page', 1);
              }}
              options={[
                { value: 'all', label: 'All risk levels' },
                { value: 'LOW', label: 'Low risk' },
                { value: 'MEDIUM', label: 'Medium risk' },
                { value: 'HIGH', label: 'High risk' },
                { value: 'CRITICAL', label: 'Critical risk' }
              ]}
            />
          </div>

          {/* Sort */}
          <div className="history-filter-col">
            <Select
              name="ordering"
              value={sortParam}
              onChange={(e) => setParam('ordering', e.target.value)}
              options={[
                { value: '-created_at', label: 'Newest first' },
                { value: 'created_at', label: 'Oldest first' },
                { value: '-risk_score', label: 'Highest risk' },
                { value: 'risk_score', label: 'Lowest risk' }
              ]}
            />
          </div>
        </div>

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="history-active-chips">
            <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-text-muted)', fontWeight: 'var(--fw-medium)' }}>
              Active filters:
            </span>

            {debouncedSearch && (
              <span className="history-filter-chip">
                <span>Search: "{debouncedSearch}"</span>
                <button type="button" onClick={() => setSearchInput('')} aria-label="Remove search filter"><X size={12} /></button>
              </span>
            )}

            {typeFilter !== 'all' && (
              <span className="history-filter-chip">
                <span>Type: {typeFilter}</span>
                <button type="button" onClick={() => setParam('type', 'all')} aria-label="Remove type filter"><X size={12} /></button>
              </span>
            )}

            {riskFilter !== 'all' && (
              <span className="history-filter-chip">
                <span>Risk: {riskFilter}</span>
                <button type="button" onClick={() => setParam('risk_level', 'all')} aria-label="Remove risk filter"><X size={12} /></button>
              </span>
            )}

            <Button variant="ghost" size="sm" onClick={handleClearFilters} style={{ fontSize: 'var(--fs-xs)' }}>
              Clear all
            </Button>
          </div>
        )}
      </Card>

      {/* Main List / Table Area */}
      {loading ? (
        <div style={{ marginTop: 'var(--space-4)' }}>
          <LoadingState lines={6} height="36px" />
        </div>
      ) : error ? (
        <ErrorState
          title="Couldn't load scan history"
          description={error.message || 'An error occurred while fetching your history records.'}
          onRetry={fetchScans}
        />
      ) : data?.results?.length === 0 ? (
        hasActiveFilters ? (
          <EmptyState
            variant="card"
            title="No scans match these filters"
            description="Try loosening your search query or selecting 'All risk levels'."
            action={{ label: 'Clear filters', onClick: handleClearFilters, icon: <RotateCcw size={16} /> }}
          />
        ) : (
          <EmptyState
            title="No scans yet"
            description="You haven't scanned any messages or links yet. Start with your first scan below."
            action={{ label: 'Scan a message', to: '/scan/message', icon: <MessageSquare size={16} /> }}
          />
        )
      ) : (
        <div className="history-results">
          {/* Desktop & Tablet Table */}
          {isDesktop || isTablet ? (
            <ScanTable
              scans={data.results}
              sort={sortParam}
              onSortChange={(newSort) => setParam('ordering', newSort)}
              isTablet={isTablet}
            />
          ) : (
            /* Mobile Cards Stack */
            <div className="history-mobile-cards">
              {data.results.map((scan) => (
                <ScanCard key={scan.id} scan={scan} />
              ))}
            </div>
          )}

          {/* Pagination */}
          <Pagination
            currentPage={pageParam}
            totalPages={Math.ceil((data.count || 0) / 20)}
            totalItems={data.count || 0}
            pageSize={20}
            onPageChange={(p) => setParam('page', p)}
          />
        </div>
      )}
    </div>
  );
}

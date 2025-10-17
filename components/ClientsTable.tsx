import React, { useState, useEffect, useMemo } from 'react';
import { DetailedClient } from '../types';
import { ChevronUpIcon, ChevronDownIcon, SearchIcon } from './icons';
import { StatusBadge, CsatScore } from './ClientComponents';

interface ClientsTableProps {
  data: DetailedClient[];
  onRowClick: (client: DetailedClient) => void;
}

const filterInputClasses = "bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:ring-[#7F56D9] focus:border-[#7F56D9]";
type SortableKeys = keyof Omit<DetailedClient, 'id' | 'logo'>;

const ClientsTable: React.FC<ClientsTableProps> = ({ data, onRowClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilterType, setDateFilterType] = useState('all');
  const [dateValues, setDateValues] = useState({ month: '', year: '', start: '', end: '' });
  const [dateRangeError, setDateRangeError] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: SortableKeys; direction: 'ascending' | 'descending' }>({
    key: 'name',
    direction: 'ascending',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const availableYears = useMemo(() => {
    const years = new Set(data.map(client => client.joinDate.substring(0, 4)));
    return Array.from(years).sort((a, b) => parseInt(b) - parseInt(a));
  }, [data]);

  const filteredData = useMemo(() => {
    let result = data.filter(client =>
        client.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Filter by status
    if (statusFilter !== 'all') {
      result = result.filter(client => client.status.toLowerCase() === statusFilter);
    }

    // Filter by date, only if there is no validation error
    if (dateFilterType !== 'all' && !dateRangeError) {
      switch (dateFilterType) {
        case 'month':
          if (dateValues.month) {
            result = result.filter(client => client.joinDate.startsWith(dateValues.month));
          }
          break;
        case 'year':
          if (dateValues.year) {
            result = result.filter(client => client.joinDate.startsWith(dateValues.year));
          }
          break;
        case 'range':
          if (dateValues.start && dateValues.end) {
            const startDate = new Date(dateValues.start);
            const endDate = new Date(dateValues.end);
            // To make the end date inclusive
            endDate.setHours(23, 59, 59, 999);
            result = result.filter(client => {
              const clientDate = new Date(client.joinDate);
              return clientDate >= startDate && clientDate <= endDate;
            });
          }
          break;
        default:
          break;
      }
    }
    
    return result;
  }, [searchQuery, statusFilter, dateFilterType, dateValues, data, dateRangeError]);
  
  useEffect(() => {
    // Reset to page 1 whenever the filters change
    setCurrentPage(1);
  }, [filteredData]);

  const sortedAndFilteredData = useMemo(() => {
    let sortableItems = [...filteredData];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key!];
        const bValue = b[sortConfig.key!];

        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredData, sortConfig]);

  const totalPages = Math.ceil(sortedAndFilteredData.length / ITEMS_PER_PAGE);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedAndFilteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [currentPage, sortedAndFilteredData]);
  
  const requestSort = (key: SortableKeys) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  const handleDateChange = (field: 'start' | 'end', value: string) => {
      const newValues = { ...dateValues, [field]: value };
      setDateValues(newValues);

      if (newValues.start && newValues.end) {
          if (new Date(newValues.start) > new Date(newValues.end)) {
              setDateRangeError('Start date cannot be after end date.');
          } else {
              setDateRangeError(null);
          }
      } else {
          setDateRangeError(null);
      }
  };


  const renderDateFilters = () => {
    switch (dateFilterType) {
      case 'month':
        return <input type="month" value={dateValues.month} onChange={(e) => setDateValues({...dateValues, month: e.target.value})} className={filterInputClasses} />;
      case 'year':
        return (
          <select value={dateValues.year} onChange={(e) => setDateValues({...dateValues, year: e.target.value})} className={filterInputClasses}>
            <option value="">Select Year</option>
            {availableYears.map(year => <option key={year} value={year}>{year}</option>)}
          </select>
        );
      case 'range':
        const errorInputClasses = "border-red-500 ring-2 ring-red-500/30";
        return (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
                <input
                    type="date"
                    value={dateValues.start}
                    onChange={(e) => handleDateChange('start', e.target.value)}
                    className={`${filterInputClasses} ${dateRangeError ? errorInputClasses : ''} transition-all`}
                />
                <span className="text-gray-400">to</span>
                <input
                    type="date"
                    value={dateValues.end}
                    onChange={(e) => handleDateChange('end', e.target.value)}
                    className={`${filterInputClasses} ${dateRangeError ? errorInputClasses : ''} transition-all`}
                />
            </div>
            {dateRangeError && (
              <div className="p-3 text-center text-sm font-medium text-red-300 bg-red-900/40 rounded-lg animate-fade-in border border-red-500/30">
                  {dateRangeError}
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  }

  const getSortIcon = (key: SortableKeys) => {
      if (sortConfig.key !== key) return null;
      return sortConfig.direction === 'ascending' 
        ? <ChevronUpIcon className="w-4 h-4 text-white" /> 
        : <ChevronDownIcon className="w-4 h-4 text-white" />;
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row flex-wrap items-center gap-4 mb-4 pb-4 border-b border-white/10">
        <div className="relative w-full sm:w-auto sm:flex-grow">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <input
                type="text"
                placeholder="Search by client name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`${filterInputClasses} pl-10 w-full`}
            />
        </div>
        <div className="flex flex-wrap items-center gap-4">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={filterInputClasses}>
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="trial">Trial</option>
              <option value="inactive">Inactive</option>
            </select>

            <select value={dateFilterType} onChange={(e) => setDateFilterType(e.target.value)} className={filterInputClasses}>
              <option value="all">Filter by Join Date</option>
              <option value="month">By Month</option>
              <option value="year">By Year</option>
              <option value="range">Custom Range</option>
            </select>
            
            {renderDateFilters()}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/10">
              <th className="p-4 w-16"></th>
              <th className="p-4 text-sm font-semibold text-gray-400">
                <button onClick={() => requestSort('name')} className="flex items-center gap-1 hover:text-white transition-colors">
                  Client Name {getSortIcon('name')}
                </button>
              </th>
              <th className="p-4 text-sm font-semibold text-gray-400">
                 <button onClick={() => requestSort('status')} className="flex items-center gap-1 hover:text-white transition-colors">
                  Status {getSortIcon('status')}
                </button>
              </th>
              <th className="p-4 text-sm font-semibold text-gray-400">
                <button onClick={() => requestSort('csat')} className="flex items-center gap-1 hover:text-white transition-colors">
                  CSAT Score {getSortIcon('csat')}
                </button>
              </th>
              <th className="p-4 text-sm font-semibold text-gray-400">
                <button onClick={() => requestSort('openTickets')} className="flex items-center gap-1 hover:text-white transition-colors">
                  Open Tickets {getSortIcon('openTickets')}
                </button>
              </th>
              <th className="p-4 text-sm font-semibold text-gray-400">
                <button onClick={() => requestSort('joinDate')} className="flex items-center gap-1 hover:text-white transition-colors">
                  Join Date {getSortIcon('joinDate')}
                </button>
              </th>
              <th className="p-4 text-sm font-semibold text-gray-400 text-right">
                <button onClick={() => requestSort('ltv')} className="flex items-center gap-1 hover:text-white transition-colors ml-auto">
                    Lifetime Value (LTV) {getSortIcon('ltv')}
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((client) => (
              <tr key={client.id} onClick={() => onRowClick(client)} className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer">
                <td className="p-4">
                  <img 
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(client.name)}&background=7F56D9&color=fff&font-size=0.4`}
                    alt={`${client.name} Logo`}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </td>
                <td className="p-4 font-medium text-white">{client.name}</td>
                <td className="p-4"><StatusBadge status={client.status} /></td>
                <td className="p-4"><CsatScore score={client.csat} /></td>
                <td className="p-4 text-white">{client.openTickets}</td>
                <td className="p-4 text-white">{client.joinDate}</td>
                <td className="p-4 font-mono text-white text-right">${new Intl.NumberFormat().format(client.ltv)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-white/10 mt-4 gap-4">
            <span className="text-sm text-gray-400">
                Showing{' '}
                <span className="font-semibold text-white">
                    {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, sortedAndFilteredData.length)}
                </span>{' '}
                to{' '}
                <span className="font-semibold text-white">
                    {Math.min(currentPage * ITEMS_PER_PAGE, sortedAndFilteredData.length)}
                </span>{' '}
                of{' '}
                <span className="font-semibold text-white">
                    {sortedAndFilteredData.length}
                </span>{' '}
                results
            </span>

            <div className="flex items-center gap-2">
                <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm font-medium text-gray-300 bg-white/10 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-colors"
                >
                    Previous
                </button>

                <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-8 h-8 text-sm font-medium rounded-md transition-colors ${
                                currentPage === page
                                    ? 'bg-gradient-to-r from-[#7F56D9] to-[#9E77ED] text-white'
                                    : 'text-gray-300 bg-white/10 hover:bg-white/20'
                            }`}
                        >
                            {page}
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="px-3 py-1 text-sm font-medium text-gray-300 bg-white/10 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-colors"
                >
                    Next
                </button>
            </div>
        </div>
      )}
    </>
  );
};

export default ClientsTable;
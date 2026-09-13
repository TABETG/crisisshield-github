import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, FileText, AlertTriangle, File, X } from 'lucide-react';
import { crisisPlans, crisisEvents, reports } from '../../mock/mockData';
import { useLanguage } from '../../../contexts/LanguageContext';

export const GlobalSearch = () => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  const handleSearch = (q: string) => {
    setQuery(q);
    setIsOpen(q.length > 0);
  };

  const searchResults = () => {
    if (query.length < 2) return { plans: [], crises: [], reports: [] };

    const lowerQuery = query.toLowerCase();

    const plans = crisisPlans.filter(p =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery) ||
      p.type.toLowerCase().includes(lowerQuery)
    );

    const crises = crisisEvents.filter(e =>
      e.name.toLowerCase().includes(lowerQuery) ||
      e.description.toLowerCase().includes(lowerQuery)
    );

    const filteredReports = reports.filter(r =>
      r.title.toLowerCase().includes(lowerQuery) ||
      r.summary.toLowerCase().includes(lowerQuery)
    );

    return { plans, crises, reports: filteredReports };
  };

  const results = searchResults();
  const totalResults = results.plans.length + results.crises.length + results.reports.length;

  const handleNavigate = (path: string) => {
    navigate(path);
    setQuery('');
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleClear = () => {
    setQuery('');
    setIsOpen(false);
    inputRef.current?.focus();
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative flex-1 max-w-xl">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => query.length > 0 && setIsOpen(true)}
          placeholder={t('search.placeholder')}
          className="w-full pl-10 pr-10 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition"
          >
            <X className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          </button>
        )}
        <div className="absolute right-12 top-1/2 -translate-y-1/2 text-xs text-gray-400 dark:text-gray-500 hidden sm:block">
          ⌘K
        </div>
      </div>

      {isOpen && query.length >= 2 && (
        <div
          ref={dropdownRef}
          className="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl max-h-96 overflow-y-auto z-50"
        >
          {totalResults === 0 ? (
            <div className="p-8 text-center">
              <Search className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400 text-sm">{t('search.noResults')}</p>
            </div>
          ) : (
            <div className="py-2">
              {results.plans.length > 0 && (
                <div className="mb-2">
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                    {t('search.plans')} ({results.plans.length})
                  </div>
                  {results.plans.map(plan => (
                    <button
                      key={plan.id}
                      onClick={() => handleNavigate(`/app/crisis/plans/${plan.id}`)}
                      className="w-full px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 text-left transition"
                    >
                      <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 dark:text-gray-100 truncate">{plan.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{plan.type}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {results.crises.length > 0 && (
                <div className="mb-2">
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                    {t('search.crises')} ({results.crises.length})
                  </div>
                  {results.crises.map(crisis => (
                    <button
                      key={crisis.id}
                      onClick={() => handleNavigate(`/app/crisis/events/${crisis.id}`)}
                      className="w-full px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 text-left transition"
                    >
                      <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 dark:text-gray-100 truncate">{crisis.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {crisis.status === 'EN_COURS' ? 'En cours' : 'Clôturée'}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {results.reports.length > 0 && (
                <div>
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                    {t('search.reports')} ({results.reports.length})
                  </div>
                  {results.reports.map(report => (
                    <button
                      key={report.id}
                      onClick={() => handleNavigate(`/app/reports/${report.id}`)}
                      className="w-full px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 text-left transition"
                    >
                      <File className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 dark:text-gray-100 truncate">{report.title}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{report.type}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

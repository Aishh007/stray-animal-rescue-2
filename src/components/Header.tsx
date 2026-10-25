import React from 'react';
import { Plus } from 'lucide-react';

interface HeaderProps {
  currentTab: 'dashboard' | 'cases' | 'volunteers';
  onTabChange: (tab: 'dashboard' | 'cases' | 'volunteers') => void;
  onOpenNewCase: () => void;
  pendingCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  onOpenNewCase,
  pendingCount,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 h-16">
          {/* Brand Wordmark & Subtitle */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-lg shadow-xs">
              🐾
            </div>
            <div>
              <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap block leading-tight">
                Stray Animal Rescue &amp; Assistance
              </span>
              <span className="text-xs text-slate-500 hidden sm:block">
                Coordinating rescue, one case at a time
              </span>
            </div>
          </div>

          {/* Navigation Links: Dashboard, All Cases, Volunteers */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => onTabChange('dashboard')}
              className={`hover:text-emerald-700 transition-colors whitespace-nowrap py-1 cursor-pointer ${
                currentTab === 'dashboard'
                  ? 'text-emerald-700 font-semibold border-b-2 border-emerald-600'
                  : ''
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => onTabChange('cases')}
              className={`hover:text-emerald-700 transition-colors whitespace-nowrap py-1 flex items-center gap-1.5 cursor-pointer ${
                currentTab === 'cases'
                  ? 'text-emerald-700 font-semibold border-b-2 border-emerald-600'
                  : ''
              }`}
            >
              <span>All Cases</span>
              {pendingCount > 0 && (
                <span className="text-[11px] font-medium text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                  {pendingCount} pending
                </span>
              )}
            </button>
            <button
              onClick={() => onTabChange('volunteers')}
              className={`hover:text-emerald-700 transition-colors whitespace-nowrap py-1 cursor-pointer ${
                currentTab === 'volunteers'
                  ? 'text-emerald-700 font-semibold border-b-2 border-emerald-600'
                  : ''
              }`}
            >
              Volunteers
            </button>
          </nav>

          {/* Primary Action */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={onOpenNewCase}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors whitespace-nowrap shrink-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            >
              <Plus className="w-4 h-4" />
              <span>Register Case</span>
            </button>
          </div>
        </div>

        {/* Mobile secondary tab bar */}
        <div className="flex md:hidden border-t border-slate-100 py-2.5 gap-4 text-xs font-medium text-slate-600">
          <button
            onClick={() => onTabChange('dashboard')}
            className={`whitespace-nowrap cursor-pointer ${currentTab === 'dashboard' ? 'text-emerald-700 font-bold' : ''}`}
          >
            Dashboard
          </button>
          <button
            onClick={() => onTabChange('cases')}
            className={`whitespace-nowrap flex items-center gap-1 cursor-pointer ${currentTab === 'cases' ? 'text-emerald-700 font-bold' : ''}`}
          >
            <span>All Cases</span>
            {pendingCount > 0 && <span>({pendingCount})</span>}
          </button>
          <button
            onClick={() => onTabChange('volunteers')}
            className={`whitespace-nowrap cursor-pointer ${currentTab === 'volunteers' ? 'text-emerald-700 font-bold' : ''}`}
          >
            Volunteers
          </button>
        </div>
      </div>
    </header>
  );
};

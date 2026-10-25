import React from 'react';
import { RescueCase, Volunteer } from '../types';
import { ShieldAlert, Clock, Activity, CheckCircle2, Users, FileText } from 'lucide-react';

interface StatsOverviewProps {
  cases: RescueCase[];
  volunteers: Volunteer[];
  onSelectFilter?: (status: string) => void;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({
  cases,
  volunteers,
  onSelectFilter,
}) => {
  const totalCases = cases.length;
  const pendingCases = cases.filter((c) => c.status === 'Pending').length;
  const criticalCases = cases.filter((c) => c.priority === 'Critical' && c.status !== 'Resolved').length;
  const assignedOrInProgressCases = cases.filter(
    (c) => c.status === 'Assigned' || c.status === 'In Progress'
  ).length;
  const resolvedCases = cases.filter((c) => c.status === 'Resolved').length;
  const availableRescuers = volunteers.filter((v) => v.status === 'Available').length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
      {/* 1. Total Cases */}
      <div
        onClick={() => onSelectFilter?.('All')}
        className={`bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between transition-colors ${
          onSelectFilter ? 'cursor-pointer hover:border-slate-300' : ''
        }`}
      >
        <div className="flex items-center justify-between text-slate-600 mb-2">
          <span className="text-xs font-semibold text-slate-700">Total Cases</span>
          <FileText className="w-4 h-4 text-slate-400" />
        </div>
        <div>
          <div className="text-2xl font-bold text-slate-900 font-mono-tabular">
            {totalCases}
          </div>
          <p className="text-xs text-slate-500 mt-1 leading-snug">
            Total rescue cases logged in the system.
          </p>
        </div>
      </div>

      {/* 2. Pending Cases */}
      <div
        onClick={() => onSelectFilter?.('Pending')}
        className={`bg-white border border-amber-200/80 rounded-xl p-4 flex flex-col justify-between transition-colors ${
          onSelectFilter ? 'cursor-pointer hover:border-amber-400 hover:bg-amber-50/20' : ''
        }`}
      >
        <div className="flex items-center justify-between text-amber-800 mb-2">
          <span className="text-xs font-semibold text-amber-800">Pending Cases</span>
          <Clock className="w-4 h-4 text-amber-600" />
        </div>
        <div>
          <div className="text-2xl font-bold text-amber-700 font-mono-tabular">
            {pendingCases}
          </div>
          <p className="text-xs text-slate-500 mt-1 leading-snug">
            Waiting for a rescuer to be assigned.
          </p>
        </div>
      </div>

      {/* 3. Critical Cases */}
      <div
        onClick={() => onSelectFilter?.('Critical')}
        className={`bg-white border border-red-200/80 rounded-xl p-4 flex flex-col justify-between transition-colors ${
          onSelectFilter ? 'cursor-pointer hover:border-red-400 hover:bg-red-50/20' : ''
        }`}
      >
        <div className="flex items-center justify-between text-red-800 mb-2">
          <span className="text-xs font-semibold text-red-700">Critical Cases</span>
          <ShieldAlert className="w-4 h-4 text-red-600" />
        </div>
        <div>
          <div className="text-2xl font-bold text-red-700 font-mono-tabular">
            {criticalCases}
          </div>
          <p className="text-xs text-slate-500 mt-1 leading-snug">
            Cases requiring immediate attention.
          </p>
        </div>
      </div>

      {/* 4. Assigned / In Progress */}
      <div
        onClick={() => onSelectFilter?.('Assigned')}
        className={`bg-white border border-blue-200/80 rounded-xl p-4 flex flex-col justify-between transition-colors ${
          onSelectFilter ? 'cursor-pointer hover:border-blue-400 hover:bg-blue-50/20' : ''
        }`}
      >
        <div className="flex items-center justify-between text-blue-800 mb-2">
          <span className="text-xs font-semibold text-blue-700">Assigned / In Progress</span>
          <Activity className="w-4 h-4 text-blue-600" />
        </div>
        <div>
          <div className="text-2xl font-bold text-slate-900 font-mono-tabular">
            {assignedOrInProgressCases}
          </div>
          <p className="text-xs text-slate-500 mt-1 leading-snug">
            Cases already assigned to a rescuer or currently being handled.
          </p>
        </div>
      </div>

      {/* 5. Resolved Cases */}
      <div
        onClick={() => onSelectFilter?.('Resolved')}
        className={`bg-white border border-emerald-200/80 rounded-xl p-4 flex flex-col justify-between transition-colors ${
          onSelectFilter ? 'cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/20' : ''
        }`}
      >
        <div className="flex items-center justify-between text-emerald-800 mb-2">
          <span className="text-xs font-semibold text-emerald-700">Resolved Cases</span>
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
        </div>
        <div>
          <div className="text-2xl font-bold text-emerald-700 font-mono-tabular">
            {resolvedCases}
          </div>
          <p className="text-xs text-slate-500 mt-1 leading-snug">
            Cases where assistance has been completed.
          </p>
        </div>
      </div>

      {/* 6. Available Rescuers */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-600 mb-2">
          <span className="text-xs font-semibold text-slate-700">Available Rescuers</span>
          <Users className="w-4 h-4 text-slate-400" />
        </div>
        <div>
          <div className="text-2xl font-bold text-slate-900 font-mono-tabular">
            {availableRescuers}
            <span className="text-xs font-normal text-slate-400 ml-1">/ {volunteers.length}</span>
          </div>
          <p className="text-xs text-slate-500 mt-1 leading-snug">
            Rescuers who can take a new case.
          </p>
        </div>
      </div>
    </div>
  );
};

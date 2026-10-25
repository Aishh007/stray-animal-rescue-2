import React, { useState } from 'react';
import { Volunteer, VolunteerStatus } from '../types';
import { Plus, Phone, Mail, Truck, MapPin, Search, Award } from 'lucide-react';

interface VolunteerListProps {
  volunteers: Volunteer[];
  onOpenAddVolunteer: () => void;
  onUpdateStatus: (volunteerId: string, status: VolunteerStatus) => void;
}

export const VolunteerList: React.FC<VolunteerListProps> = ({
  volunteers,
  onOpenAddVolunteer,
  onUpdateStatus,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const filteredVolunteers = volunteers.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.specializations.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
      v.currentZone.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: VolunteerStatus) => {
    switch (status) {
      case 'Available':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'On Mission':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'Busy':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Offline':
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Rescue Volunteers &amp; Rescuers
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Registered field responders available for animal rescue missions and care.
          </p>
        </div>

        <button
          onClick={onOpenAddVolunteer}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors whitespace-nowrap self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Volunteer</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search volunteers by name, skill, or zone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg self-start sm:self-auto overflow-x-auto">
          {['All', 'Available', 'On Mission', 'Busy', 'Offline'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                statusFilter === st
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Volunteers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredVolunteers.map((vol) => (
          <div
            key={vol.id}
            className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-colors shadow-xs flex flex-col justify-between"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">
                      {vol.name}
                    </span>
                    <span className="font-mono text-xs text-slate-500">
                      {vol.id}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{vol.currentZone}</span>
                  </div>
                </div>

                {/* Inline Status Selector */}
                <select
                  value={vol.status}
                  onChange={(e) =>
                    onUpdateStatus(vol.id, e.target.value as VolunteerStatus)
                  }
                  className={`text-xs font-semibold px-2 py-1 rounded border focus:outline-none ${getStatusColor(
                    vol.status
                  )}`}
                >
                  <option value="Available">Available</option>
                  <option value="On Mission">On Mission</option>
                  <option value="Busy">Busy</option>
                  <option value="Offline">Offline</option>
                </select>
              </div>

              {/* Specializations */}
              <div className="mt-3">
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Award className="w-3 h-3 text-emerald-600" />
                  <span>Specializations</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {vol.specializations.map((spec, i) => (
                    <span
                      key={i}
                      className="text-xs text-slate-700 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Vehicle & Equipment */}
              <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-600">
                <Truck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{vol.vehicle}</span>
              </div>
            </div>

            {/* Footer Contact & Metrics */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-slate-700 font-mono">
                  <Phone className="w-3 h-3 text-slate-400" />
                  {vol.phone}
                </span>
              </div>

              <div className="flex items-center gap-3 font-mono-tabular">
                <span>
                  <strong className="text-slate-900 font-semibold">{vol.assignedCaseCount}</strong> active
                </span>
                <span>·</span>
                <span>
                  <strong className="text-emerald-700 font-semibold">{vol.totalRescuedCount}</strong> rescued
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredVolunteers.length === 0 && (
        <div className="py-10 text-center bg-white border border-slate-200 rounded-xl">
          <p className="text-sm text-slate-500">
            No volunteers matched your search or status filter.
          </p>
        </div>
      )}
    </div>
  );
};

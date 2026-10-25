import React from 'react';
import { RescueCase, Volunteer } from '../types';
import { getPriorityMeta, getStatusMeta } from '../utils/formatters';
import { MapPin, UserCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

interface CaseCardProps {
  rescueCase: RescueCase;
  volunteers: Volunteer[];
  onViewDetails: (c: RescueCase) => void;
  onAssignVolunteer?: (c: RescueCase) => void;
  onAdvanceStatus?: (c: RescueCase) => void;
}

export const CaseCard: React.FC<CaseCardProps> = ({
  rescueCase,
  volunteers,
  onViewDetails,
  onAssignVolunteer,
  onAdvanceStatus,
}) => {
  const priorityMeta = getPriorityMeta(rescueCase.priority);
  const statusMeta = getStatusMeta(rescueCase.status);

  const assignedVolunteer = volunteers.find(
    (v) => v.id === rescueCase.assignedVolunteerId
  );

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 hover:border-slate-300 transition-colors flex flex-col justify-between shadow-xs">
      <div>
        {/* Card Header: Case ID, Animal Type, Urgency, Status */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-sm text-slate-900 tracking-tight">
                {rescueCase.id}
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-xs font-semibold text-slate-800">
                {rescueCase.animalType}
              </span>
            </div>
            {rescueCase.animalBreedOrDesc && (
              <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                {rescueCase.animalBreedOrDesc}
              </p>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0 flex-wrap justify-end">
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded border ${priorityMeta.badgeClass}`}
            >
              {priorityMeta.label}
            </span>
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded border ${statusMeta.bgClass} ${statusMeta.colorClass}`}
            >
              {statusMeta.label}
            </span>
          </div>
        </div>

        {/* Short description of problem */}
        <p className="text-xs text-slate-700 font-medium leading-relaxed line-clamp-2 my-2.5">
          {rescueCase.condition}
        </p>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{rescueCase.location}</span>
        </div>

        {/* Assigned Rescuer (if any) */}
        {rescueCase.assignedVolunteerName && (
          <div className="mt-2.5 py-1.5 px-2 bg-slate-50 rounded-lg text-xs flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-slate-700">
              <UserCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="font-medium truncate">{rescueCase.assignedVolunteerName}</span>
            </div>
            {assignedVolunteer && (
              <span className="text-[11px] text-slate-500 font-mono shrink-0">
                {assignedVolunteer.phone}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Card Actions Footer */}
      <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <button
          onClick={() => onViewDetails(rescueCase)}
          className="text-xs font-semibold text-slate-700 hover:text-emerald-700 py-1 transition-colors cursor-pointer"
        >
          View Details
        </button>

        <div className="flex items-center gap-2">
          {rescueCase.status === 'Pending' && onAssignVolunteer && (
            <button
              onClick={() => onAssignVolunteer(rescueCase)}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            >
              <span>Assign Rescuer</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}

          {rescueCase.status === 'Assigned' && onAdvanceStatus && (
            <button
              onClick={() => onAdvanceStatus(rescueCase)}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            >
              <span>Mark In Progress</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}

          {rescueCase.status === 'In Progress' && onAdvanceStatus && (
            <button
              onClick={() => onAdvanceStatus(rescueCase)}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Resolve Case</span>
            </button>
          )}

          {rescueCase.status === 'Resolved' && (
            <span className="text-xs font-medium text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Resolved</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

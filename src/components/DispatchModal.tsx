import React, { useState } from 'react';
import { RescueCase, Volunteer } from '../types';
import { formatTimeAgo, getPriorityMeta } from '../utils/formatters';
import {
  X,
  MapPin,
  Clock,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface DispatchModalProps {
  caseToDispatch: RescueCase;
  volunteers: Volunteer[];
  onClose: () => void;
  onConfirmDispatch: (caseId: string, volunteerId: string) => void;
}

export const DispatchModal: React.FC<DispatchModalProps> = ({
  caseToDispatch,
  volunteers,
  onClose,
  onConfirmDispatch,
}) => {
  const priorityMeta = getPriorityMeta(caseToDispatch.priority);

  // Compute matching score for each volunteer based on animal type & load
  const scoredVolunteers = [...volunteers].map((v) => {
    let matchScore = 0;
    if (v.status === 'Available') matchScore += 100;
    else if (v.status === 'Busy') matchScore += 10;
    else matchScore += 0;

    const lowerSpecializations = v.specializations.map((s) => s.toLowerCase());
    const animalLower = caseToDispatch.animalType.toLowerCase();

    if (lowerSpecializations.some((s) => s.includes(animalLower))) {
      matchScore += 40;
    }
    if (
      caseToDispatch.condition.toLowerCase().includes('trap') &&
      lowerSpecializations.some((s) => s.includes('trap') || s.includes('drain'))
    ) {
      matchScore += 30;
    }
    // Fewer active cases gives slight boost
    matchScore -= v.assignedCaseCount * 10;

    return { volunteer: v, score: matchScore };
  });

  scoredVolunteers.sort((a, b) => b.score - a.score);

  const bestMatch = scoredVolunteers[0]?.volunteer;
  const [selectedVolunteerId, setSelectedVolunteerId] = useState<string>(
    bestMatch ? bestMatch.id : volunteers[0]?.id || ''
  );

  const handleQuickAssign = () => {
    if (bestMatch) {
      onConfirmDispatch(caseToDispatch.id, bestMatch.id);
    }
  };

  const handleManualAssign = () => {
    if (selectedVolunteerId) {
      onConfirmDispatch(caseToDispatch.id, selectedVolunteerId);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-2xl w-full my-auto overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-slate-900">
                Assign Case to Rescuer
              </span>
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Next in Queue
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Prioritized for response based on animal condition urgency and wait time.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Case Summary Card */}
          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-sm text-slate-900">
                  {caseToDispatch.id}
                </span>
                <span className="text-slate-300">·</span>
                <span className="text-xs font-semibold text-slate-800">
                  {caseToDispatch.animalType} {caseToDispatch.animalBreedOrDesc ? `(${caseToDispatch.animalBreedOrDesc})` : ''}
                </span>
              </div>

              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded border ${priorityMeta.badgeClass}`}
              >
                {priorityMeta.label} Urgency
              </span>
            </div>

            <p className="text-xs text-slate-800 font-medium leading-relaxed">
              {caseToDispatch.condition}
            </p>

            <div className="flex items-center gap-4 text-xs text-slate-600 pt-2 border-t border-emerald-200/60 flex-wrap">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{caseToDispatch.location}</span>
              </span>
              <span className="flex items-center gap-1 font-mono tabular-nums">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Reported {formatTimeAgo(caseToDispatch.createdAt)}</span>
              </span>
            </div>
          </div>

          {/* Recommended Match Suggestion */}
          {bestMatch && bestMatch.status === 'Available' && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-md bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-900">
                    Recommended Rescuer: {bestMatch.name}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {bestMatch.specializations.join(', ')} · {bestMatch.currentZone}
                  </div>
                </div>
              </div>

              <button
                onClick={handleQuickAssign}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors whitespace-nowrap cursor-pointer"
              >
                Assign {bestMatch.name.split(' ')[0]}
              </button>
            </div>
          )}

          {/* Volunteer Selection List */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Select Rescuer to Assign:
            </label>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {scoredVolunteers.map(({ volunteer: v }) => {
                const isSelected = selectedVolunteerId === v.id;
                const isAvailable = v.status === 'Available';

                return (
                  <div
                    key={v.id}
                    onClick={() => setSelectedVolunteerId(v.id)}
                    className={`p-3 rounded-lg border text-xs cursor-pointer transition-all flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-500'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        checked={isSelected}
                        onChange={() => setSelectedVolunteerId(v.id)}
                        className="mt-1 text-emerald-600 focus:ring-emerald-500"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900">
                            {v.name}
                          </span>
                          <span
                            className={`text-[10px] font-semibold px-1.5 py-0.2 rounded border ${
                              isAvailable
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-slate-100 text-slate-600 border-slate-200'
                            }`}
                          >
                            {v.status}
                          </span>
                          {v.id === bestMatch?.id && (
                            <span className="text-[10px] font-medium text-emerald-700">
                              (Best Match)
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {v.specializations.join(' · ')}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                          <span>{v.vehicle}</span>
                          <span>·</span>
                          <span>Zone: {v.currentZone}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-mono text-slate-700 font-semibold">
                        {v.assignedCaseCount} active
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {v.totalRescuedCount} rescued
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleManualAssign}
            disabled={!selectedVolunteerId}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <span>Confirm Assignment</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

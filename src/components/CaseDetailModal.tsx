import React, { useState } from 'react';
import { RescueCase, Volunteer, CaseStatus } from '../types';
import { formatExactDateTime, getPriorityMeta, getStatusMeta } from '../utils/formatters';
import {
  X,
  MapPin,
  Phone,
  Clock,
  Send,
  CheckCircle2,
  FileText,
} from 'lucide-react';

interface CaseDetailModalProps {
  rescueCase: RescueCase;
  volunteers: Volunteer[];
  onClose: () => void;
  onUpdateStatus: (caseId: string, newStatus: CaseStatus, resolutionNote?: string) => void;
  onAssignVolunteer: (caseId: string, volunteerId: string) => void;
  onAddHistoryNote: (caseId: string, note: string, author: string) => void;
}

export const CaseDetailModal: React.FC<CaseDetailModalProps> = ({
  rescueCase,
  volunteers,
  onClose,
  onUpdateStatus,
  onAssignVolunteer,
  onAddHistoryNote,
}) => {
  const [newNote, setNewNote] = useState('');
  const [authorName, setAuthorName] = useState('Dispatcher Desk');
  const [selectedVolunteerId, setSelectedVolunteerId] = useState(
    rescueCase.assignedVolunteerId || ''
  );
  const [showResolveInput, setShowResolveInput] = useState(false);
  const [resolutionOutcome, setResolutionOutcome] = useState('');

  const priorityMeta = getPriorityMeta(rescueCase.priority);
  const statusMeta = getStatusMeta(rescueCase.status);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    onAddHistoryNote(rescueCase.id, newNote.trim(), authorName.trim() || 'Dispatcher');
    setNewNote('');
  };

  const handleVolunteerReassign = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedVolunteerId(val);
    if (val) {
      onAssignVolunteer(rescueCase.id, val);
    }
  };

  const handleConfirmResolve = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolutionOutcome.trim()) return;
    onUpdateStatus(rescueCase.id, 'Resolved', resolutionOutcome.trim());
    setShowResolveInput(false);
  };

  const stages: { status: CaseStatus; label: string }[] = [
    { status: 'Pending', label: 'Pending Assignment' },
    { status: 'Assigned', label: 'Assigned' },
    { status: 'In Progress', label: 'Rescue in Progress' },
    { status: 'Resolved', label: 'Resolved' },
  ];
  const currentStageIndex = stages.findIndex((s) => s.status === rescueCase.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-3xl w-full max-h-[92vh] flex flex-col my-auto overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between gap-4 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <span className="font-mono font-bold text-base text-slate-900">
              {rescueCase.id}
            </span>
            <span className="text-slate-300">/</span>
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded border ${priorityMeta.badgeClass}`}
            >
              {priorityMeta.label} Urgency
            </span>
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded border ${statusMeta.bgClass} ${statusMeta.colorClass}`}
            >
              {statusMeta.label}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Lifecycle Status Stepper */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
              Case Progress
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {stages.map((stage, idx) => {
                const isPassed = idx <= currentStageIndex;
                const isCurrent = idx === currentStageIndex;

                return (
                  <button
                    key={stage.status}
                    disabled={isCurrent}
                    onClick={() => {
                      if (stage.status === 'Resolved') {
                        setShowResolveInput(true);
                      } else {
                        onUpdateStatus(rescueCase.id, stage.status);
                      }
                    }}
                    className={`p-2 rounded-lg text-center border text-xs font-medium transition-all ${
                      isCurrent
                        ? 'bg-emerald-600 text-white border-emerald-600 font-semibold shadow-xs'
                        : isPassed
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100 cursor-pointer'
                        : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 cursor-pointer'
                    }`}
                  >
                    <div className="text-[10px] uppercase font-mono opacity-80">
                      Step {idx + 1}
                    </div>
                    <div className="mt-0.5 truncate">{stage.label}</div>
                  </button>
                );
              })}
            </div>

            {/* Resolve prompt input if triggered */}
            {showResolveInput && (
              <form onSubmit={handleConfirmResolve} className="mt-4 pt-3 border-t border-slate-200 space-y-2">
                <div className="text-xs font-semibold text-slate-800">
                  Record Resolution Outcome &amp; Animal Safety Destination:
                </div>
                <textarea
                  required
                  rows={2}
                  value={resolutionOutcome}
                  onChange={(e) => setResolutionOutcome(e.target.value)}
                  placeholder="e.g. Safely rescued and admitted to Central Animal Hospital for fracture surgery. Prognosis good."
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowResolveInput(false)}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs cursor-pointer"
                  >
                    Complete &amp; Archive As Resolved
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Core Case Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Column: Distress & Animal */}
            <div className="border border-slate-200 rounded-lg p-4 space-y-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Animal &amp; Condition
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900">
                  {rescueCase.animalType} {rescueCase.animalBreedOrDesc ? `— ${rescueCase.animalBreedOrDesc}` : ''}
                </div>
                <div className="text-xs text-slate-700 mt-1 font-medium bg-slate-50 p-2.5 rounded border border-slate-100 leading-relaxed">
                  {rescueCase.condition}
                </div>
              </div>

              {rescueCase.notes && (
                <div className="text-xs text-slate-600">
                  <span className="font-semibold text-slate-800">Field Notes: </span>
                  {rescueCase.notes}
                </div>
              )}

              {rescueCase.resolutionOutcome && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900">
                  <div className="font-semibold flex items-center gap-1 mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                    Resolution Summary:
                  </div>
                  <p>{rescueCase.resolutionOutcome}</p>
                </div>
              )}
            </div>

            {/* Right Column: Location & Reporter & Volunteer */}
            <div className="border border-slate-200 rounded-lg p-4 space-y-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Location &amp; Rescuer
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-start gap-1.5 text-slate-700">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">{rescueCase.location}</span>
                    {rescueCase.landmark && (
                      <div className="text-slate-500 text-[11px]">
                        Landmark: {rescueCase.landmark}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-slate-600">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>
                    Reporter: {rescueCase.reporterName} ({rescueCase.reporterPhone})
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-slate-500">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Intake: {formatExactDateTime(rescueCase.createdAt)}</span>
                </div>
              </div>

              {/* Volunteer Assignment Selector */}
              <div className="pt-3 border-t border-slate-100">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Assigned Rescuer:
                </label>
                <select
                  value={selectedVolunteerId}
                  onChange={handleVolunteerReassign}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">-- Unassigned (Awaiting Rescuer) --</option>
                  {volunteers.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.status}) · {v.vehicle}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* History / Audit Log */}
          <div className="border border-slate-200 rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                <span>Case Updates &amp; Notes</span>
              </div>
              <span className="text-xs text-slate-500 font-mono-tabular">
                {rescueCase.history.length} updates
              </span>
            </div>

            {/* Timeline entries */}
            <div className="space-y-3 relative before:absolute before:inset-0 before:left-2 before:w-0.5 before:bg-slate-200 pl-6">
              {rescueCase.history.map((item) => (
                <div key={item.id} className="relative text-xs">
                  <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-emerald-600 border-2 border-white ring-1 ring-slate-200" />
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="font-semibold text-slate-800">
                      {item.action}
                    </span>
                    <span className="font-mono text-[11px]">
                      {formatExactDateTime(item.timestamp)}
                    </span>
                  </div>
                  <p className="text-slate-600 mt-0.5">{item.note}</p>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    by {item.author}
                  </span>
                </div>
              ))}
            </div>

            {/* Add Note Form */}
            <form onSubmit={handleAddNote} className="pt-3 border-t border-slate-100 flex gap-2">
              <input
                type="text"
                placeholder="Log field update or rescuer note..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="flex-1 text-xs p-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="submit"
                disabled={!newNote.trim()}
                className="px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Send className="w-3 h-3" />
                <span>Add Note</span>
              </button>
            </form>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Last updated: {formatExactDateTime(rescueCase.updatedAt)}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-300 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

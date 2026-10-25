import React, { useState, useEffect, useMemo } from 'react';
import { RescueCase, Volunteer, CaseStatus, AnimalType, PriorityLevel, VolunteerStatus } from './types';
import {
  loadCases,
  saveCases,
  loadVolunteers,
  saveVolunteers,
  resetDemoData,
  generateNextCaseId,
  generateNextVolunteerId,
} from './utils/storage';
import { BinaryMaxHeap, compareRescueCases, priorityToScore } from './utils/heap';
import { Header } from './components/Header';
import { StatsOverview } from './components/StatsOverview';
import { CaseCard } from './components/CaseCard';
import { CaseDetailModal } from './components/CaseDetailModal';
import { NewCaseModal } from './components/NewCaseModal';
import { DispatchModal } from './components/DispatchModal';
import { VolunteerList } from './components/VolunteerList';
import { VolunteerModal } from './components/VolunteerModal';
import {
  Search,
  Plus,
  ShieldAlert,
  Zap,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  X,
  Clock,
  ArrowRight,
  LifeBuoy,
} from 'lucide-react';

export default function App() {
  const [cases, setCases] = useState<RescueCase[]>(() => loadCases());
  const [volunteers, setVolunteers] = useState<Volunteer[]>(() => loadVolunteers());

  // UI state: 3 main tabs
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'cases' | 'volunteers'>('dashboard');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [animalFilter, setAnimalFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<'priority' | 'newest' | 'oldest'>('priority');

  // Modals state
  const [selectedCaseForDetail, setSelectedCaseForDetail] = useState<RescueCase | null>(null);
  const [caseToDispatch, setCaseToDispatch] = useState<RescueCase | null>(null);
  const [isNewCaseModalOpen, setIsNewCaseModalOpen] = useState(false);
  const [isVolunteerModalOpen, setIsVolunteerModalOpen] = useState(false);

  // Recent assignment confirmation display
  const [recentAssignment, setRecentAssignment] = useState<{
    caseId: string;
    volunteerName: string;
    animalType: string;
    timestamp: number;
  } | null>(null);

  // Toast notifications
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'alert' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'alert' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage((prev) => (prev?.text === text ? null : prev));
    }, 4000);
  };

  // Sync to localStorage
  useEffect(() => {
    saveCases(cases);
  }, [cases]);

  useEffect(() => {
    saveVolunteers(volunteers);
  }, [volunteers]);

  // Derived Pending Cases for priority queue
  const pendingCases = useMemo(() => {
    return cases.filter((c) => c.status === 'Pending');
  }, [cases]);

  // Priority queue logic preserved: Highest urgency first, older intake breaks ties
  const maxHeap = useMemo(() => {
    return new BinaryMaxHeap<RescueCase>(compareRescueCases, pendingCases);
  }, [pendingCases]);

  const rootPendingCase = maxHeap.peek();
  const availableVolunteersCount = volunteers.filter((v) => v.status === 'Available').length;

  // Filter & Sort Cases
  const filteredAndSortedCases = useMemo(() => {
    return cases
      .filter((c) => {
        const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
        const matchesAnimal = animalFilter === 'All' || c.animalType === animalFilter;
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch =
          !searchTerm ||
          c.id.toLowerCase().includes(searchLower) ||
          c.condition.toLowerCase().includes(searchLower) ||
          c.location.toLowerCase().includes(searchLower) ||
          c.animalType.toLowerCase().includes(searchLower) ||
          c.reporterName.toLowerCase().includes(searchLower) ||
          (c.assignedVolunteerName && c.assignedVolunteerName.toLowerCase().includes(searchLower));

        return matchesStatus && matchesAnimal && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'priority') {
          return compareRescueCases(b, a); // Highest urgency first
        }
        if (sortBy === 'newest') {
          return b.createdAt - a.createdAt;
        }
        if (sortBy === 'oldest') {
          return a.createdAt - b.createdAt;
        }
        return 0;
      });
  }, [cases, statusFilter, animalFilter, searchTerm, sortBy]);

  // Handler: Register New Case
  const handleCreateCase = (
    newCaseData: Omit<RescueCase, 'id' | 'createdAt' | 'updatedAt' | 'history'>
  ) => {
    const nextId = generateNextCaseId(cases);
    const now = Date.now();

    const createdCase: RescueCase = {
      ...newCaseData,
      id: nextId,
      createdAt: now,
      updatedAt: now,
      history: [
        {
          id: `hist-${Date.now()}-1`,
          timestamp: now,
          action: 'Case Intake Registered',
          note: `Reported by ${newCaseData.reporterName}. Urgency set to ${newCaseData.priority}.`,
          author: 'Intake System',
        },
        {
          id: `hist-${Date.now()}-2`,
          timestamp: now,
          action: 'Prioritized for Assignment',
          note: `Queued by urgency (${newCaseData.priority}) for rescuer assignment.`,
          author: 'Dispatch Desk',
        },
      ],
    };

    setCases((prev) => [createdCase, ...prev]);
    setIsNewCaseModalOpen(false);
    showToast(`Case ${nextId} registered with ${newCaseData.priority} urgency.`);
  };

  // Handler: Report Emergency (Quick Urgent Intake Simulation)
  const handleSimulateUrgentCase = () => {
    const templates = [
      {
        animalType: 'Dog' as AnimalType,
        animalBreedOrDesc: 'Husky, blue collar',
        condition: 'Trapped on crumbling highway embankment after mudslide. Unsteady footing over steep drop.',
        location: 'Route 9 North Mountain Pass, Mile 18',
        landmark: 'Near Scenic Overlook 3',
        priority: 'Critical' as PriorityLevel,
        reporterName: 'State Park Ranger Cole',
        reporterPhone: '+1 (555) 882-9901',
      },
      {
        animalType: 'Cat' as AnimalType,
        animalBreedOrDesc: 'Siamese mix, adult',
        condition: 'Stranded on rooftop solar inverter electrical box with sparks nearby.',
        location: '310 West End Avenue, Rooftop',
        landmark: 'Above Downtown Library',
        priority: 'High' as PriorityLevel,
        reporterName: 'Facility Tech Liam',
        reporterPhone: '+1 (555) 774-1290',
      },
      {
        animalType: 'Bird' as AnimalType,
        animalBreedOrDesc: 'Barn Owl',
        condition: 'Wing caught in soccer goal netting at public athletic field.',
        location: 'Oakridge Athletic Complex, Field B',
        landmark: 'South goal post near bleachers',
        priority: 'High' as PriorityLevel,
        reporterName: 'Coach Martinez',
        reporterPhone: '+1 (555) 431-7729',
      },
    ];

    const pick = templates[Math.floor(Math.random() * templates.length)];
    const nextId = generateNextCaseId(cases);
    const now = Date.now();
    const score = priorityToScore(pick.priority);

    const urgentCase: RescueCase = {
      ...pick,
      id: nextId,
      priorityScore: score,
      status: 'Pending',
      createdAt: now,
      updatedAt: now,
      history: [
        {
          id: `hist-${Date.now()}-em1`,
          timestamp: now,
          action: 'Emergency Call Received',
          note: 'Emergency report logged directly into dispatch queue.',
          author: 'Emergency Line',
        },
        {
          id: `hist-${Date.now()}-em2`,
          timestamp: now,
          action: 'Prioritized for Assignment',
          note: `Flagged as ${pick.priority} urgency for immediate response.`,
          author: 'Dispatch Desk',
        },
      ],
    };

    setCases((prev) => [urgentCase, ...prev]);
    showToast(`Emergency reported: ${nextId} (${pick.animalType} · ${pick.priority} Urgency)`, 'alert');
  };

  // Handler: Confirm Rescuer Assignment
  const handleConfirmDispatch = (caseId: string, volunteerId: string) => {
    const volunteer = volunteers.find((v) => v.id === volunteerId);
    if (!volunteer) return;

    const targetCase = cases.find((c) => c.id === caseId);
    const now = Date.now();

    // Update case status and rescuer
    setCases((prev) =>
      prev.map((c) => {
        if (c.id === caseId) {
          const updatedHistory = [
            ...c.history,
            {
              id: `hist-${Date.now()}-dispatch`,
              timestamp: now,
              action: 'Rescuer Assigned',
              note: `Assigned to rescuer ${volunteer.name} (${volunteer.vehicle}, ${volunteer.currentZone}).`,
              author: 'Dispatch Coordinator',
            },
          ];
          return {
            ...c,
            status: 'Assigned',
            assignedVolunteerId: volunteer.id,
            assignedVolunteerName: volunteer.name,
            updatedAt: now,
            history: updatedHistory,
          };
        }
        return c;
      })
    );

    // Update volunteer workload & status
    setVolunteers((prev) =>
      prev.map((v) => {
        if (v.id === volunteerId) {
          return {
            ...v,
            status: 'On Mission',
            assignedCaseCount: v.assignedCaseCount + 1,
          };
        }
        return v;
      })
    );

    setCaseToDispatch(null);

    // Set immediate visual confirmation in the Rescue Assignment section
    setRecentAssignment({
      caseId,
      volunteerName: volunteer.name,
      animalType: targetCase ? targetCase.animalType : 'Animal',
      timestamp: now,
    });

    showToast(`Case ${caseId} successfully assigned to ${volunteer.name}!`);
  };

  // Handler: Status Update (Lifecycle Progression)
  const handleUpdateStatus = (caseId: string, newStatus: CaseStatus, resolutionNote?: string) => {
    const now = Date.now();

    setCases((prev) =>
      prev.map((c) => {
        if (c.id === caseId) {
          const actionText =
            newStatus === 'In Progress'
              ? 'Rescue in Progress'
              : newStatus === 'Resolved'
              ? 'Case Successfully Resolved'
              : `Status Changed to ${newStatus}`;

          const noteText =
            resolutionNote ||
            (newStatus === 'In Progress'
              ? 'Rescuer arrived on scene and initiated assistance.'
              : `Status updated to ${newStatus}.`);

          const updatedHistory = [
            ...c.history,
            {
              id: `hist-${Date.now()}-status`,
              timestamp: now,
              action: actionText,
              note: noteText,
              author: 'Field Rescuer',
            },
          ];

          return {
            ...c,
            status: newStatus,
            updatedAt: now,
            resolvedAt: newStatus === 'Resolved' ? now : c.resolvedAt,
            resolutionOutcome: resolutionNote || c.resolutionOutcome,
            history: updatedHistory,
          };
        }
        return c;
      })
    );

    // If resolved, update volunteer metrics if volunteer was assigned
    if (newStatus === 'Resolved') {
      const targetCase = cases.find((c) => c.id === caseId);
      if (targetCase?.assignedVolunteerId) {
        setVolunteers((prev) =>
          prev.map((v) => {
            if (v.id === targetCase.assignedVolunteerId) {
              return {
                ...v,
                status: 'Available',
                assignedCaseCount: Math.max(0, v.assignedCaseCount - 1),
                totalRescuedCount: v.totalRescuedCount + 1,
              };
            }
            return v;
          })
        );
      }
    }

    // Refresh selected case modal state if open
    if (selectedCaseForDetail?.id === caseId) {
      setSelectedCaseForDetail((prev) =>
        prev
          ? {
              ...prev,
              status: newStatus,
              updatedAt: now,
              resolvedAt: newStatus === 'Resolved' ? now : prev.resolvedAt,
              resolutionOutcome: resolutionNote || prev.resolutionOutcome,
            }
          : null
      );
    }

    showToast(`Case ${caseId} status updated to ${newStatus === 'In Progress' ? 'Rescue in Progress' : newStatus}`);
  };

  // Handler: Reassign Volunteer from modal
  const handleAssignVolunteer = (caseId: string, volunteerId: string) => {
    const volunteer = volunteers.find((v) => v.id === volunteerId);
    if (!volunteer) return;

    const now = Date.now();

    setCases((prev) =>
      prev.map((c) => {
        if (c.id === caseId) {
          return {
            ...c,
            status: 'Assigned',
            assignedVolunteerId: volunteer.id,
            assignedVolunteerName: volunteer.name,
            updatedAt: now,
            history: [
              ...c.history,
              {
                id: `hist-${Date.now()}-reassign`,
                timestamp: now,
                action: 'Rescuer Reassigned',
                note: `Case assigned to ${volunteer.name} (${volunteer.currentZone}).`,
                author: 'Dispatcher',
              },
            ],
          };
        }
        return c;
      })
    );

    showToast(`Assigned ${volunteer.name} to ${caseId}`);
  };

  // Handler: Add History Note
  const handleAddHistoryNote = (caseId: string, note: string, author: string) => {
    const now = Date.now();
    setCases((prev) =>
      prev.map((c) => {
        if (c.id === caseId) {
          const updatedHistory = [
            ...c.history,
            {
              id: `hist-${Date.now()}-manual`,
              timestamp: now,
              action: 'Field Note Added',
              note,
              author,
            },
          ];
          const updatedCase = {
            ...c,
            updatedAt: now,
            history: updatedHistory,
          };
          if (selectedCaseForDetail?.id === caseId) {
            setSelectedCaseForDetail(updatedCase);
          }
          return updatedCase;
        }
        return c;
      })
    );
    showToast('Note added to case record');
  };

  // Handler: Add Volunteer
  const handleAddVolunteer = (
    newVolData: Omit<Volunteer, 'id' | 'assignedCaseCount' | 'totalRescuedCount'>
  ) => {
    const nextId = generateNextVolunteerId(volunteers);
    const newVol: Volunteer = {
      ...newVolData,
      id: nextId,
      assignedCaseCount: 0,
      totalRescuedCount: 0,
    };
    setVolunteers((prev) => [...prev, newVol]);
    setIsVolunteerModalOpen(false);
    showToast(`Rescuer ${newVol.name} (${nextId}) registered successfully`);
  };

  // Handler: Update Volunteer Status
  const handleUpdateVolunteerStatus = (volunteerId: string, status: VolunteerStatus) => {
    setVolunteers((prev) =>
      prev.map((v) => (v.id === volunteerId ? { ...v, status } : v))
    );
    showToast(`Rescuer status updated to ${status}`);
  };

  // Handler: Reset Data to defaults
  const handleResetDemo = () => {
    const { cases: defCases, volunteers: defVols } = resetDemoData();
    setCases(defCases);
    setVolunteers(defVols);
    setRecentAssignment(null);
    showToast('Reset to default sample rescue records');
  };

  // Quick action: Assign next highest priority case
  const handleAssignNextCase = () => {
    if (rootPendingCase) {
      setCaseToDispatch(rootPendingCase);
    } else {
      showToast('No pending cases awaiting assignment.', 'info');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col antialiased">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 max-w-md animate-fade-in">
          <div
            className={`p-3.5 rounded-lg border shadow-lg flex items-center justify-between gap-3 text-xs font-medium ${
              toastMessage.type === 'alert'
                ? 'bg-red-50 text-red-900 border-red-200'
                : toastMessage.type === 'info'
                ? 'bg-blue-50 text-blue-900 border-blue-200'
                : 'bg-emerald-50 text-emerald-900 border-emerald-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {toastMessage.type === 'alert' ? (
                <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
              ) : toastMessage.type === 'info' ? (
                <AlertCircle className="w-4 h-4 text-blue-600 shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              )}
              <span>{toastMessage.text}</span>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Top Header */}
      <Header
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onOpenNewCase={() => setIsNewCaseModalOpen(true)}
        pendingCount={pendingCases.length}
      />

      {/* Main Viewport */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6 flex-1">
        {/* KPI Stats Overview: Simplified Summary Boxes */}
        <StatsOverview
          cases={cases}
          volunteers={volunteers}
          onSelectFilter={(status) => {
            setStatusFilter(status);
            if (currentTab !== 'dashboard' && currentTab !== 'cases') {
              setCurrentTab('cases');
            }
          }}
        />

        {/* TAB 1: DASHBOARD VIEW */}
        {currentTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Section 3: Simplified Rescue Assignment */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className="w-11 h-11 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <LifeBuoy className="w-5 h-5 text-emerald-700" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                        Rescue Assignment
                      </h2>
                      <span className="text-xs text-slate-300">·</span>
                      <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        {pendingCases.length} {pendingCases.length === 1 ? 'case' : 'cases'} awaiting assignment
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 mt-1">
                      Cases are ordered by urgency so animals needing immediate care receive help first.
                    </p>

                    <div className="text-xs font-medium text-slate-800 mt-1.5 flex items-center gap-2">
                      {rootPendingCase ? (
                        <span>
                          Next Case to Handle:{' '}
                          <strong className="text-slate-900 font-semibold">{rootPendingCase.id}</strong>{' '}
                          ({rootPendingCase.animalType} ·{' '}
                          <span className={rootPendingCase.priority === 'Critical' ? 'text-red-700 font-bold' : 'text-amber-700 font-semibold'}>
                            {rootPendingCase.priority} Urgency
                          </span>
                          )
                        </span>
                      ) : (
                        <span className="text-emerald-700 font-normal">
                          All reported cases are currently assigned or resolved.
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Primary & Secondary Action Buttons */}
                <div className="flex items-center gap-2.5 flex-wrap self-start md:self-auto">
                  <button
                    onClick={handleSimulateUrgentCase}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-600" />
                    <span>Report Emergency</span>
                  </button>

                  <button
                    onClick={handleAssignNextCase}
                    disabled={!rootPendingCase}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-xs transition-colors whitespace-nowrap cursor-pointer"
                  >
                    <span>Assign Next Case</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={handleResetDemo}
                    title="Reset sample records"
                    className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Assignment Success Confirmation */}
              {recentAssignment && (
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-3 text-xs bg-emerald-50/70 border-emerald-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-emerald-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      Successfully assigned <strong>{recentAssignment.caseId}</strong> ({recentAssignment.animalType}) to rescuer <strong>{recentAssignment.volunteerName}</strong>. The rescuer has been notified.
                    </span>
                  </div>
                  <button
                    onClick={() => setRecentAssignment(null)}
                    className="text-emerald-700 hover:text-emerald-900 font-semibold p-1 cursor-pointer shrink-0"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search by Case ID, animal, condition, location, reporter, or rescuer..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full text-xs pl-9 pr-8 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Sort dropdown */}
                <div className="flex items-center gap-2 self-end md:self-auto">
                  <span className="text-xs font-medium text-slate-500 whitespace-nowrap">
                    Sort:
                  </span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="text-xs p-2 rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="priority">Highest Urgency First</option>
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                  </select>
                </div>
              </div>

              {/* Status Segmented Buttons & Species Filter */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
                {/* Status Filter */}
                <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto max-w-full">
                  {[
                    { id: 'All', label: 'All Cases' },
                    { id: 'Pending', label: `Pending Assignment (${pendingCases.length})` },
                    { id: 'Assigned', label: 'Assigned' },
                    { id: 'In Progress', label: 'Rescue in Progress' },
                    { id: 'Resolved', label: 'Resolved' },
                  ].map((st) => (
                    <button
                      key={st.id}
                      onClick={() => setStatusFilter(st.id)}
                      className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                        statusFilter === st.id
                          ? 'bg-white text-slate-900 shadow-xs font-semibold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>

                {/* Animal Species Filter */}
                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                  <span className="text-slate-400 hidden sm:inline">Species:</span>
                  <select
                    value={animalFilter}
                    onChange={(e) => setAnimalFilter(e.target.value)}
                    className="text-xs p-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-none"
                  >
                    <option value="All">All Species</option>
                    <option value="Dog">Dogs</option>
                    <option value="Cat">Cats</option>
                    <option value="Bird">Birds</option>
                    <option value="Wildlife">Wildlife</option>
                    <option value="Farm Animal">Farm Animals</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Cases Grid */}
            {filteredAndSortedCases.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAndSortedCases.map((rescueCase) => (
                  <CaseCard
                    key={rescueCase.id}
                    rescueCase={rescueCase}
                    volunteers={volunteers}
                    onViewDetails={(c) => setSelectedCaseForDetail(c)}
                    onAssignVolunteer={(c) => setCaseToDispatch(c)}
                    onAdvanceStatus={(c) => {
                      if (c.status === 'Assigned') {
                        handleUpdateStatus(c.id, 'In Progress');
                      } else if (c.status === 'In Progress') {
                        setSelectedCaseForDetail(c);
                      }
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="py-16 text-center bg-white border border-slate-200 rounded-xl">
                <p className="text-sm font-semibold text-slate-800">
                  No rescue cases match the selected filters.
                </p>
                <p className="text-xs text-slate-500 mt-1 mb-4">
                  Try clearing your search query or switching to All Cases.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('All');
                    setAnimalFilter('All');
                  }}
                  className="px-3.5 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ALL CASES VIEW */}
        {currentTab === 'cases' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                  All Rescue Cases
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Complete records of all reported, active, and resolved rescue operations.
                </p>
              </div>

              <button
                onClick={() => setIsNewCaseModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors whitespace-nowrap self-start sm:self-auto cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Register Case</span>
              </button>
            </div>

            {/* Filter controls */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Filter cases by ID, animal, reporter, location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-500 whitespace-nowrap">
                    Sort:
                  </span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="text-xs p-2 rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="priority">Highest Urgency First</option>
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto self-start sm:self-auto">
                {[
                  { id: 'All', label: 'All Cases' },
                  { id: 'Pending', label: `Pending Assignment (${pendingCases.length})` },
                  { id: 'Assigned', label: 'Assigned' },
                  { id: 'In Progress', label: 'Rescue in Progress' },
                  { id: 'Resolved', label: 'Resolved' },
                ].map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setStatusFilter(st.id)}
                    className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                      statusFilter === st.id
                        ? 'bg-white text-slate-900 shadow-xs font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAndSortedCases.map((c) => (
                <CaseCard
                  key={c.id}
                  rescueCase={c}
                  volunteers={volunteers}
                  onViewDetails={(item) => setSelectedCaseForDetail(item)}
                  onAssignVolunteer={(item) => setCaseToDispatch(item)}
                  onAdvanceStatus={(item) => {
                    if (item.status === 'Assigned') handleUpdateStatus(item.id, 'In Progress');
                    else if (item.status === 'In Progress') setSelectedCaseForDetail(item);
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: VOLUNTEERS DIRECTORY */}
        {currentTab === 'volunteers' && (
          <VolunteerList
            volunteers={volunteers}
            onOpenAddVolunteer={() => setIsVolunteerModalOpen(true)}
            onUpdateStatus={handleUpdateVolunteerStatus}
          />
        )}
      </main>

      {/* Modals */}
      {selectedCaseForDetail && (
        <CaseDetailModal
          rescueCase={selectedCaseForDetail}
          volunteers={volunteers}
          onClose={() => setSelectedCaseForDetail(null)}
          onUpdateStatus={handleUpdateStatus}
          onAssignVolunteer={handleAssignVolunteer}
          onAddHistoryNote={handleAddHistoryNote}
        />
      )}

      {caseToDispatch && (
        <DispatchModal
          caseToDispatch={caseToDispatch}
          volunteers={volunteers}
          onClose={() => setCaseToDispatch(null)}
          onConfirmDispatch={handleConfirmDispatch}
        />
      )}

      {isNewCaseModalOpen && (
        <NewCaseModal
          nextCaseId={generateNextCaseId(cases)}
          onClose={() => setIsNewCaseModalOpen(false)}
          onSubmit={handleCreateCase}
        />
      )}

      {isVolunteerModalOpen && (
        <VolunteerModal
          nextVolunteerId={generateNextVolunteerId(volunteers)}
          onClose={() => setIsVolunteerModalOpen(false)}
          onSubmit={handleAddVolunteer}
        />
      )}

      {/* Clean Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">
              Stray Animal Rescue &amp; Assistance
            </span>
            <span>·</span>
            <span>Coordinating rescue, one case at a time</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleResetDemo}
              className="text-slate-600 hover:text-emerald-700 transition-colors cursor-pointer"
            >
              Reset Sample Data
            </button>
            <span>·</span>
            <span>Saved in browser storage</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

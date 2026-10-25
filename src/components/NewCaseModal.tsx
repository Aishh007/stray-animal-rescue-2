import React, { useState } from 'react';
import { AnimalType, PriorityLevel, RescueCase } from '../types';
import { priorityToScore } from '../utils/heap';
import { X, Sparkles, MapPin, Phone, User } from 'lucide-react';

interface NewCaseModalProps {
  onClose: () => void;
  onSubmit: (newCase: Omit<RescueCase, 'id' | 'createdAt' | 'updatedAt' | 'history'>) => void;
  nextCaseId: string;
}

export const NewCaseModal: React.FC<NewCaseModalProps> = ({
  onClose,
  onSubmit,
  nextCaseId,
}) => {
  const [animalType, setAnimalType] = useState<AnimalType>('Dog');
  const [animalBreedOrDesc, setAnimalBreedOrDesc] = useState('');
  const [condition, setCondition] = useState('');
  const [location, setLocation] = useState('');
  const [landmark, setLandmark] = useState('');
  const [priority, setPriority] = useState<PriorityLevel>('High');
  const [reporterName, setReporterName] = useState('');
  const [reporterPhone, setReporterPhone] = useState('');
  const [notes, setNotes] = useState('');

  const applyTemplate = (
    type: AnimalType,
    desc: string,
    prio: PriorityLevel,
    cond: string,
    loc: string,
    mark: string
  ) => {
    setAnimalType(type);
    setAnimalBreedOrDesc(desc);
    setPriority(prio);
    setCondition(cond);
    setLocation(loc);
    setLandmark(mark);
    setReporterName('Local Resident');
    setReporterPhone('+1 (555) 438-9901');
    setNotes('Caller reported animal unable to move away from danger.');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!condition.trim() || !location.trim() || !reporterName.trim()) {
      return;
    }

    const score = priorityToScore(priority);

    onSubmit({
      animalType,
      animalBreedOrDesc: animalBreedOrDesc.trim() || undefined,
      condition: condition.trim(),
      location: location.trim(),
      landmark: landmark.trim() || undefined,
      priority,
      priorityScore: score,
      status: 'Pending',
      reporterName: reporterName.trim(),
      reporterPhone: reporterPhone.trim() || '+1 (555) 000-0000',
      notes: notes.trim() || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-2xl w-full my-auto overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-slate-900">
                Register Animal Rescue Case
              </span>
              <span className="text-xs font-mono font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {nextCaseId}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Cases are prioritized by urgency so animals needing immediate care receive help first.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Quick presets for evaluation */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              <span>Sample Scenarios:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() =>
                  applyTemplate(
                    'Dog',
                    'Shepherd mix, adult female',
                    'Critical',
                    'Trapped on train tracks with hind leg caught under switch rail. Fast-approaching cargo schedule.',
                    'Freight Rail Yard Crossing, Track 4B',
                    'Near North Signal Tower'
                  )
                }
                className="px-2.5 py-1 text-[11px] font-medium bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded text-slate-700 transition-colors cursor-pointer"
              >
                Track Entrapment (Critical)
              </button>
              <button
                type="button"
                onClick={() =>
                  applyTemplate(
                    'Cat',
                    'Calico, mother with 3 newborns',
                    'High',
                    'Flooded basement storm drain rising fast. Kittens in cardboard box on floating pallet.',
                    '742 South Elm Street, Basement',
                    'Corner Laundromat building'
                  )
                }
                className="px-2.5 py-1 text-[11px] font-medium bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded text-slate-700 transition-colors cursor-pointer"
              >
                Storm Drain Flooding (High)
              </button>
              <button
                type="button"
                onClick={() =>
                  applyTemplate(
                    'Wildlife',
                    'Juvenile Raccoon',
                    'Medium',
                    'Head stuck inside discarded plastic peanut butter jar, stumbling blindly near traffic.',
                    'Oak Ridge Community Park Playground',
                    'Next to picnic pavilion 2'
                  )
                }
                className="px-2.5 py-1 text-[11px] font-medium bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded text-slate-700 transition-colors cursor-pointer"
              >
                Jar Entrapment (Medium)
              </button>
            </div>
          </div>

          {/* Animal & Description Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Animal Species / Category *
              </label>
              <select
                value={animalType}
                onChange={(e) => setAnimalType(e.target.value as AnimalType)}
                className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Dog">Dog</option>
                <option value="Cat">Cat</option>
                <option value="Bird">Bird / Raptor</option>
                <option value="Wildlife">Wildlife</option>
                <option value="Farm Animal">Farm Animal</option>
                <option value="Other">Other Species</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Breed / Description
              </label>
              <input
                type="text"
                placeholder="e.g. Golden Retriever mix, collar with bell"
                value={animalBreedOrDesc}
                onChange={(e) => setAnimalBreedOrDesc(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Urgency Level Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
              <span>Urgency Level *</span>
              <span className="text-[11px] font-normal text-slate-500">
                Critical &gt; High &gt; Medium &gt; Low
              </span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setPriority('Critical')}
                className={`p-2 rounded-lg border text-xs text-left transition-all cursor-pointer ${
                  priority === 'Critical'
                    ? 'border-red-500 bg-red-50/70 text-red-900 font-semibold ring-1 ring-red-400'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="font-bold">Critical</div>
                <div className="text-[10px] text-red-700">Immediate life threat</div>
              </button>

              <button
                type="button"
                onClick={() => setPriority('High')}
                className={`p-2 rounded-lg border text-xs text-left transition-all cursor-pointer ${
                  priority === 'High'
                    ? 'border-amber-500 bg-amber-50/70 text-amber-900 font-semibold ring-1 ring-amber-400'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="font-bold">High</div>
                <div className="text-[10px] text-amber-700">Severe injury / trapped</div>
              </button>

              <button
                type="button"
                onClick={() => setPriority('Medium')}
                className={`p-2 rounded-lg border text-xs text-left transition-all cursor-pointer ${
                  priority === 'Medium'
                    ? 'border-emerald-500 bg-emerald-50/70 text-emerald-900 font-semibold ring-1 ring-emerald-400'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="font-bold">Medium</div>
                <div className="text-[10px] text-emerald-700">Moderate pain / distress</div>
              </button>

              <button
                type="button"
                onClick={() => setPriority('Low')}
                className={`p-2 rounded-lg border text-xs text-left transition-all cursor-pointer ${
                  priority === 'Low'
                    ? 'border-slate-500 bg-slate-100 text-slate-900 font-semibold ring-1 ring-slate-400'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="font-bold">Low</div>
                <div className="text-[10px] text-slate-600">Stable / shelter needed</div>
              </button>
            </div>
          </div>

          {/* Condition & Injury */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Injury / Distress Condition *
            </label>
            <textarea
              required
              rows={2}
              placeholder="Describe injuries, behavior, entrapment, or immediate risks..."
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Location & Landmark */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Incident Location / Address *
              </label>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  required
                  placeholder="Street address, intersection, or area"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full text-xs pl-8 pr-2.5 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Landmark / Spotting Clues
              </label>
              <input
                type="text"
                placeholder="e.g. Under water tower, behind supermarket"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Reporter Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Reporter Name *
              </label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  required
                  placeholder="Caller or witness name"
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  className="w-full text-xs pl-8 pr-2.5 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Reporter Phone Number
              </label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="+1 (555) 000-0000"
                  value={reporterPhone}
                  onChange={(e) => setReporterPhone(e.target.value)}
                  className="w-full text-xs pl-8 pr-2.5 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Special Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Special Rescuer Notes or Equipment (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Bring catch pole, animal is timid, parking in rear"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Form Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              Register Case
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

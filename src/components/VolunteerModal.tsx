import React, { useState } from 'react';
import { Volunteer, VolunteerStatus } from '../types';
import { X, User, Phone, Mail, Truck, MapPin, Award } from 'lucide-react';

interface VolunteerModalProps {
  onClose: () => void;
  onSubmit: (newVolunteer: Omit<Volunteer, 'id' | 'assignedCaseCount' | 'totalRescuedCount'>) => void;
  nextVolunteerId: string;
}

export const VolunteerModal: React.FC<VolunteerModalProps> = ({
  onClose,
  onSubmit,
  nextVolunteerId,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [specializationsStr, setSpecializationsStr] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [currentZone, setCurrentZone] = useState('');
  const [status, setStatus] = useState<VolunteerStatus>('Available');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    const specs = specializationsStr
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    onSubmit({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '.')}@volunteer.org`,
      specializations: specs.length > 0 ? specs : ['General Animal Handling', 'First Aid'],
      vehicle: vehicle.trim() || 'Standard Vehicle + Pet Carrier',
      currentZone: currentZone.trim() || 'Central District',
      status,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-lg w-full my-auto overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-slate-900">
                Register New Rescue Volunteer
              </span>
              <span className="text-xs font-mono font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {nextVolunteerId}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Add a certified rescuer, transporter, or veterinarian.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Full Name *
            </label>
            <div className="relative">
              <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                required
                placeholder="e.g. David Bradley"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs pl-8 pr-2.5 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Phone Contact *
              </label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  required
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs pl-8 pr-2.5 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="email"
                  placeholder="name@rescue.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs pl-8 pr-2.5 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Specializations (Comma separated)
            </label>
            <div className="relative">
              <Award className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="e.g. Canine Triage, High-angle Rescue, Trapped Animals"
                value={specializationsStr}
                onChange={(e) => setSpecializationsStr(e.target.value)}
                className="w-full text-xs pl-8 pr-2.5 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Vehicle &amp; Gear
              </label>
              <div className="relative">
                <Truck className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="e.g. SUV + Rescue Net &amp; Cages"
                  value={vehicle}
                  onChange={(e) => setVehicle(e.target.value)}
                  className="w-full text-xs pl-8 pr-2.5 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Primary Patrol / Service Zone
              </label>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="e.g. Westside &amp; Hills"
                  value={currentZone}
                  onChange={(e) => setCurrentZone(e.target.value)}
                  className="w-full text-xs pl-8 pr-2.5 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Current Duty Status
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['Available', 'On Mission', 'Busy', 'Offline'] as VolunteerStatus[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatus(s)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-medium border text-center transition-all ${
                    status === s
                      ? 'bg-emerald-600 text-white border-emerald-600 font-semibold'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors"
            >
              Add Volunteer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

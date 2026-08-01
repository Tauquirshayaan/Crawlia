import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { ChevronLeft, ChevronRight, Mail, AlertCircle } from "lucide-react";

export default function CalendarPage() {
  const daysInMonth = 31;
  const startingDayOfWeek = 3; // Wednesday (0 = Sunday, 1 = Monday, etc.)
  
  // Generating a standard calendar array
  const blanks = Array.from({ length: startingDayOfWeek }, (_, i) => null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const calendarGrid = [...blanks, ...days];

  // Mock schedule data
  const schedules = {
    4: [{ campaign: "SEO Outreach Q3", count: 120, color: "bg-blue-500" }],
    5: [{ campaign: "SEO Outreach Q3", count: 120, color: "bg-blue-500" }, { campaign: "Local Gyms (Test)", count: 45, color: "bg-purple-500" }],
    6: [{ campaign: "Local Gyms (Test)", count: 45, color: "bg-purple-500" }],
    12: [{ campaign: "E-comm Speed Audit", count: 350, color: "bg-[var(--color-brand-teal)]" }],
    13: [{ campaign: "E-comm Speed Audit", count: 350, color: "bg-[var(--color-brand-teal)]" }],
    14: [{ campaign: "E-comm Speed Audit", count: 350, color: "bg-[var(--color-brand-teal)]" }, { campaign: "Local Gyms (Test)", count: 45, color: "bg-purple-500" }],
  };

  const getDayDensity = (day: number) => {
    const events = schedules[day as keyof typeof schedules] || [];
    const totalSends = events.reduce((acc, curr) => acc + curr.count, 0);
    if (totalSends > 300) return 'high';
    if (totalSends > 100) return 'medium';
    if (totalSends > 0) return 'low';
    return 'none';
  };

  const densityColors = {
    none: 'bg-white/40 border-[var(--color-brand-border)] text-[var(--color-brand-slate)]',
    low: 'bg-[var(--color-brand-pastel)]/30 border-[var(--color-brand-teal)]/20 text-[var(--color-brand-ink)]',
    medium: 'bg-orange-50 border-orange-200 text-orange-900',
    high: 'bg-red-50 border-red-200 text-red-900',
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-outfit font-bold text-[var(--color-brand-ink)]">Send Schedule</h1>
          <p className="text-[var(--color-brand-slate)] mt-1">Manage your outreach density to protect domain reputation.</p>
        </div>
        <div className="flex items-center gap-4 bg-white/60 p-2 rounded-2xl border border-[var(--color-brand-border)]">
          <Button variant="secondary" size="sm" className="px-2">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="font-bold text-[var(--color-brand-ink)] min-w-[120px] text-center">August 2026</span>
          <Button variant="secondary" size="sm" className="px-2">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <GlassCard className="p-0 overflow-hidden">
        {/* Calendar Header */}
        <div className="grid grid-cols-7 border-b border-[var(--color-brand-border)] bg-white/40">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="py-3 text-center text-xs font-bold text-[var(--color-brand-slate)] uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 bg-[var(--color-brand-border)] gap-[1px]">
          {calendarGrid.map((day, idx) => {
            if (day === null) {
              return <div key={`blank-${idx}`} className="bg-white/40 min-h-[140px]"></div>;
            }

            const density = getDayDensity(day);
            const events = schedules[day as keyof typeof schedules] || [];

            return (
              <div 
                key={`day-${day}`} 
                className={`min-h-[140px] p-2 transition-colors ${densityColors[density]}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-sm font-semibold w-7 h-7 flex items-center justify-center rounded-full ${day === 14 ? 'bg-[var(--color-brand-ink)] text-white' : ''}`}>
                    {day}
                  </span>
                  {density === 'high' && (
                    <span title="High volume warning">
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    </span>
                  )}
                </div>
                
                <div className="space-y-1.5">
                  {events.map((event, i) => (
                    <div key={i} className={`${event.color} text-white text-[10px] px-2 py-1.5 rounded flex items-center justify-between font-medium shadow-sm`}>
                      <span className="truncate pr-2">{event.campaign}</span>
                      <span className="shrink-0 flex items-center gap-0.5"><Mail className="w-3 h-3" /> {event.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </GlassCard>
      
      {/* Legend */}
      <div className="flex items-center gap-6 text-sm text-[var(--color-brand-slate)] mt-4">
        <div className="font-semibold text-[var(--color-brand-ink)]">Density Legend:</div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[var(--color-brand-pastel)] border border-[var(--color-brand-teal)]/20"></div> Optimal (1-100)
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-orange-100 border border-orange-300"></div> Moderate (101-300)
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-100 border border-red-300"></div> High Risk (&gt;300)
        </div>
      </div>
    </div>
  );
}

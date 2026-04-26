import { useState } from 'react';
import { CheckCircle2, Circle, ChevronDown, ChevronUp, Heart, Activity, BookOpen, Star } from 'lucide-react';

type TaskCategory = 'lifestyle' | 'follow-up' | 'monitoring' | 'education';

interface CareTask {
  id: string;
  title: string;
  description?: string;
  category: TaskCategory;
  completed: boolean;
  priority?: 'high';
}

const CATEGORY_CONFIG: Record<TaskCategory, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  lifestyle:  { label: 'Lifestyle',   color: 'text-emerald-700', bg: 'bg-emerald-50',  icon: Heart },
  'follow-up':{ label: 'Follow-up',   color: 'text-blue-700',    bg: 'bg-blue-50',     icon: Star },
  monitoring: { label: 'Monitoring',  color: 'text-amber-700',   bg: 'bg-amber-50',    icon: Activity },
  education:  { label: 'Education',   color: 'text-purple-700',  bg: 'bg-purple-50',   icon: BookOpen },
};

const INITIAL_TASKS: CareTask[] = [
  { id: '1', title: 'Check blood pressure', description: 'Record your morning reading before medication', category: 'monitoring', completed: false, priority: 'high' },
  { id: '2', title: 'Walk 30 minutes', description: 'Low-impact walking as recommended by your care plan', category: 'lifestyle', completed: true },
  { id: '3', title: 'Schedule follow-up', description: 'Book your 3-month check-in with Dr. Johnson', category: 'follow-up', completed: false },
  { id: '4', title: 'Read blood pressure guide', description: 'Educational material sent by your care team', category: 'education', completed: true },
  { id: '5', title: 'Log daily water intake', description: 'Aim for 2 liters per day', category: 'monitoring', completed: false },
  { id: '6', title: 'Reduce sodium in your diet', description: 'Try to stay under 1500mg per day', category: 'lifestyle', completed: false },
];

export default function PatientTasksPage() {
  const [tasks, setTasks] = useState<CareTask[]>(INITIAL_TASKS);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(Object.keys(CATEGORY_CONFIG)));

  const toggle = (id: string) =>
    setTasks((p) => p.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));

  const toggleCategory = (cat: string) =>
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      next.has(cat) ? next.delete(cat) : next.add(cat);
      return next;
    });

  const allDone = tasks.every((t) => t.completed);
  const doneCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Care Tasks</h1>
        <p className="text-gray-500 text-sm mt-0.5">Your personalized care plan for this week</p>
      </div>

      {/* Overall progress */}
      <div className={`rounded-3xl p-5 ${allDone ? 'bg-gradient-to-br from-emerald-500 to-teal-500' : 'bg-gradient-to-br from-indigo-600 to-blue-600'} shadow-lg transition-all`}>
        <div className="flex justify-between items-start">
          <p className="text-white/80 text-sm font-bold">Weekly Progress</p>
          <p className="text-white text-3xl font-extrabold">{doneCount}<span className="text-white/60 text-lg ml-1">/{tasks.length}</span></p>
        </div>
        <div className="h-2.5 bg-white/20 rounded-full mt-3 overflow-hidden">
          <div className="h-full bg-white rounded-full transition-all duration-700" style={{ width: `${(doneCount / tasks.length) * 100}%` }} />
        </div>
        <p className="text-white/70 text-xs font-semibold mt-2">
          {allDone ? '🎉 All tasks complete! Great work this week.' : `${tasks.length - doneCount} tasks remaining`}
        </p>
      </div>

      {/* Tasks by category */}
      {(Object.entries(CATEGORY_CONFIG) as [TaskCategory, typeof CATEGORY_CONFIG[TaskCategory]][]).map(([cat, cfg]) => {
        const catTasks = tasks.filter((t) => t.category === cat);
        if (catTasks.length === 0) return null;
        const catDone = catTasks.filter((t) => t.completed).length;
        const isExpanded = expandedCategories.has(cat);
        const CatIcon = cfg.icon;

        return (
          <div key={cat} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <button
              onClick={() => toggleCategory(cat)}
              className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors text-left"
            >
              <div className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center ${cfg.bg}`}>
                <CatIcon size={15} className={cfg.color} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-extrabold text-gray-900">{cfg.label}</h2>
                  <span className="text-xs font-bold text-gray-400">{catDone}/{catTasks.length}</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full mt-1.5 overflow-hidden w-28">
                  <div className={`h-full rounded-full transition-all duration-500 ${cfg.bg.replace('bg-', 'bg-').replace('-50', '-400')}`}
                    style={{ width: `${(catDone / catTasks.length) * 100}%` }} />
                </div>
              </div>
              {isExpanded ? <ChevronUp size={16} className="text-gray-300" /> : <ChevronDown size={16} className="text-gray-300" />}
            </button>

            {isExpanded && (
              <div className="divide-y divide-gray-50">
                {catTasks.map((task) => (
                  <button
                    key={task.id}
                    onClick={() => toggle(task.id)}
                    className={`w-full flex items-start gap-3 px-5 py-4 text-left transition-all hover:bg-gray-50/50 ${task.completed ? 'opacity-70' : ''}`}
                  >
                    <div className={`shrink-0 mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      task.completed ? 'border-emerald-500 bg-emerald-500' : 'border-gray-300'
                    }`}>
                      {task.completed && <CheckCircle2 size={12} className="text-white" />}
                      {!task.completed && <Circle size={12} className="text-transparent" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={`text-sm font-bold ${task.completed ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                          {task.title}
                        </p>
                        {task.priority === 'high' && !task.completed && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-100 text-red-600">Priority</span>
                        )}
                      </div>
                      {task.description && (
                        <p className="text-xs text-gray-400 font-medium mt-0.5">{task.description}</p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

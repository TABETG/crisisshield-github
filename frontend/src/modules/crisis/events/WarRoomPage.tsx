import { useParams, Link } from 'react-router-dom';
import { AlertTriangle, Clock, User, GripVertical, ArrowLeft, Brain } from 'lucide-react';
import { crisisEvents, crisisPlans, organisationUsers, aiCrisisSummarySample } from '../../mock/mockData';
import { useState } from 'react';

export const WarRoomPage = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const event = crisisEvents.find(e => e.id === eventId);
  const plan = event ? crisisPlans.find(p => p.id === event.planId) : null;
  const owner = event ? organisationUsers.find(u => u.id === event.owner) : null;

  const [tasks, setTasks] = useState(event?.tasks || []);
  const [draggedTask, setDraggedTask] = useState<string | null>(null);

  if (!event || !plan) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Événement de crise non trouvé</p>
      </div>
    );
  }

  const tasksByStatus = {
    'A_FAIRE': tasks.filter(t => t.status === 'A_FAIRE'),
    'EN_COURS': tasks.filter(t => t.status === 'EN_COURS'),
    'FAIT': tasks.filter(t => t.status === 'FAIT'),
    'BLOQUE': tasks.filter(t => t.status === 'BLOQUE'),
  };

  const handleDragStart = (taskId: string) => {
    setDraggedTask(taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (newStatus: string) => {
    if (!draggedTask) return;

    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === draggedTask ? { ...task, status: newStatus } : task
      )
    );
    setDraggedTask(null);
  };

  const calculateDuration = () => {
    const start = new Date(event.startedAt).getTime();
    const end = event.closedAt ? new Date(event.closedAt).getTime() : Date.now();
    const durationMs = end - start;
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const getStatusColor = (status: string) => {
    if (status === 'A_FAIRE') return 'border-gray-300 bg-gray-50';
    if (status === 'EN_COURS') return 'border-blue-300 bg-blue-50';
    if (status === 'FAIT') return 'border-green-300 bg-green-50';
    if (status === 'BLOQUE') return 'border-red-300 bg-red-50';
    return 'border-gray-300 bg-gray-50';
  };

  const getStatusLabel = (status: string) => {
    if (status === 'A_FAIRE') return 'À FAIRE';
    if (status === 'EN_COURS') return 'EN COURS';
    if (status === 'FAIT') return 'FAIT';
    if (status === 'BLOQUE') return 'BLOQUÉ';
    return status;
  };

  const getPriorityColor = (priority: string) => {
    if (priority === 'CRITIQUE') return 'bg-red-100 text-red-700';
    if (priority === 'HAUTE') return 'bg-orange-100 text-orange-700';
    if (priority === 'MOYENNE') return 'bg-yellow-100 text-yellow-700';
    return 'bg-blue-100 text-blue-700';
  };

  return (
    <div className="space-y-6">
      <Link
        to="/app/crisis/events"
        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Retour aux événements
      </Link>

      <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border-2 border-red-200 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4 flex-1">
            <div className="w-14 h-14 rounded-xl bg-red-600 flex items-center justify-center shadow-lg">
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{event.name}</h1>
              <p className="text-gray-700 mb-4">{event.description}</p>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <div className="text-xs text-gray-600 mb-1">Sévérité</div>
                  <div className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${
                    event.severity === 'CRITIQUE' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {event.severity}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">Statut</div>
                  <div className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${
                    event.status === 'EN_COURS' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {event.status === 'EN_COURS' ? 'EN COURS' : 'CLÔTURÉE'}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">Responsable</div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-900">{owner?.fullName || 'N/A'}</span>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">Durée</div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-900">{calculateDuration()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {event.status === 'EN_COURS' && (
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200 p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 mb-2">Résumé IA de la crise</h3>
              <p className="text-gray-700 text-sm mb-3">{aiCrisisSummarySample.summary}</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-xs font-semibold text-gray-600 mb-2">Décisions clés</h4>
                  <ul className="space-y-1">
                    {aiCrisisSummarySample.keyDecisions.map((d, i) => (
                      <li key={i} className="text-sm text-gray-700 flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-gray-600 mb-2">Prochaines étapes</h4>
                  <ul className="space-y-1">
                    {aiCrisisSummarySample.nextSteps.map((s, i) => (
                      <li key={i} className="text-sm text-gray-700 flex items-start">
                        <span className="text-cyan-600 mr-2">→</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Kanban des Tâches</h2>
              <p className="text-sm text-gray-600 mt-1">Glissez-déposez pour changer le statut</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-4 gap-4">
                {Object.entries(tasksByStatus).map(([status, statusTasks]) => (
                  <div
                    key={status}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(status)}
                    className={`rounded-lg border-2 border-dashed p-4 min-h-[500px] ${getStatusColor(status)}`}
                  >
                    <div className="mb-4">
                      <h3 className="text-sm font-bold text-gray-900 uppercase mb-1">
                        {getStatusLabel(status)}
                      </h3>
                      <p className="text-xs text-gray-600">{statusTasks.length} tâches</p>
                    </div>
                    <div className="space-y-3">
                      {statusTasks.map((task) => {
                        const assignee = organisationUsers.find(u => u.id === task.assignedTo);
                        return (
                          <div
                            key={task.id}
                            draggable
                            onDragStart={() => handleDragStart(task.id)}
                            className={`bg-white rounded-lg p-4 border border-gray-200 shadow-sm cursor-move hover:shadow-md transition-all ${
                              draggedTask === task.id ? 'opacity-50 scale-95' : ''
                            }`}
                          >
                            <div className="flex items-start gap-2 mb-3">
                              <GripVertical className="w-4 h-4 text-gray-400 mt-0.5" />
                              <h4 className="font-semibold text-gray-900 text-sm flex-1">{task.title}</h4>
                            </div>
                            <div className="flex items-center gap-2 mb-3">
                              <span className={`px-2 py-1 rounded text-xs font-semibold ${getPriorityColor(task.priority)}`}>
                                {task.priority}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-xs text-gray-600">
                              <div className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                <span>{assignee?.fullName || 'Non assigné'}</span>
                              </div>
                              {task.completedAt && (
                                <span className="text-green-600 font-medium">✓ Fait</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col max-h-[800px]">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Timeline</h2>
            <p className="text-sm text-gray-600 mt-1">{event.timeline.length} entrées</p>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {event.timeline.slice().reverse().map((entry) => (
              <div key={entry.id} className="relative pl-6 pb-6 border-l-2 border-gray-200 last:pb-0">
                <div className={`absolute left-0 top-0 -translate-x-1/2 w-3 h-3 rounded-full ${
                  entry.type === 'DECISION' ? 'bg-blue-600' :
                  entry.type === 'ACTION' ? 'bg-green-600' :
                  'bg-gray-400'
                }`} />
                <div className="mb-1">
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                    entry.type === 'DECISION' ? 'bg-blue-100 text-blue-700' :
                    entry.type === 'ACTION' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {entry.type}
                  </span>
                </div>
                <p className="text-sm text-gray-900 mb-2">{entry.message}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="font-medium">{entry.author}</span>
                  <span>•</span>
                  <span>{new Date(entry.at).toLocaleString('fr-FR')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

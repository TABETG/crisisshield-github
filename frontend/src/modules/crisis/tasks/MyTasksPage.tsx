import { Link } from 'react-router-dom';
import { CheckSquare, ExternalLink } from 'lucide-react';
import { crisisEvents, mockCurrentUser } from '../../mock/mockData';
import { Badge } from '../../shared/components';

export const MyTasksPage = () => {
  const myTasks = crisisEvents
    .flatMap(event =>
      event.tasks
        .filter(task => task.assignedTo === mockCurrentUser.id)
        .map(task => ({
          ...task,
          eventId: event.id,
          eventName: event.name,
        }))
    );

  const getStatusColor = (status: string) => {
    if (status === 'FAIT') return 'success';
    if (status === 'EN_COURS') return 'info';
    if (status === 'BLOQUE') return 'danger';
    return 'warning';
  };

  const getPriorityColor = (priority: string) => {
    if (priority === 'CRITIQUE') return 'bg-red-100 text-red-700';
    if (priority === 'HAUTE') return 'bg-orange-100 text-orange-700';
    return 'bg-yellow-100 text-yellow-700';
  };

  const tasksByStatus = {
    'EN_COURS': myTasks.filter(t => t.status === 'EN_COURS'),
    'A_FAIRE': myTasks.filter(t => t.status === 'A_FAIRE'),
    'BLOQUE': myTasks.filter(t => t.status === 'BLOQUE'),
    'FAIT': myTasks.filter(t => t.status === 'FAIT'),
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mes Tâches</h1>
        <p className="text-gray-600 mt-1">
          {myTasks.length} tâches assignées à {mockCurrentUser.fullName}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { key: 'EN_COURS', label: 'En cours', color: 'blue' },
          { key: 'A_FAIRE', label: 'À faire', color: 'yellow' },
          { key: 'BLOQUE', label: 'Bloqué', color: 'red' },
          { key: 'FAIT', label: 'Terminé', color: 'green' },
        ].map(({ key, label }) => {
          const tasks = tasksByStatus[key as keyof typeof tasksByStatus];
          return (
            <div key={key} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="text-2xl font-bold text-gray-900">{tasks.length}</div>
              <div className="text-sm text-gray-600">{label}</div>
            </div>
          );
        })}
      </div>

      {myTasks.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <CheckSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Aucune tâche assignée</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(tasksByStatus).map(([status, tasks]) => {
            if (tasks.length === 0) return null;
            const labels: Record<string, string> = {
              'EN_COURS': 'En cours',
              'A_FAIRE': 'À faire',
              'BLOQUE': 'Bloqué',
              'FAIT': 'Terminé',
            };
            return (
              <div key={status} className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {labels[status]} ({tasks.length})
                  </h2>
                </div>
                <div className="divide-y divide-gray-100">
                  {tasks.map(task => (
                    <div key={task.id} className="p-6 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900">{task.title}</h3>
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${getPriorityColor(task.priority)}`}>
                              {task.priority}
                            </span>
                            <Badge variant={getStatusColor(task.status) as any}>
                              {labels[task.status]}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">
                            <span className="font-medium">Événement:</span> {task.eventName}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>Créé le {new Date(task.createdAt).toLocaleDateString('fr-FR')}</span>
                            {task.completedAt && (
                              <span>Terminé le {new Date(task.completedAt).toLocaleDateString('fr-FR')}</span>
                            )}
                          </div>
                        </div>
                        <Link
                          to={`/app/crisis/events/${task.eventId}`}
                          className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium inline-flex items-center"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          War Room
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

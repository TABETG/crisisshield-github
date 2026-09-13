import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Plus, GripVertical, X } from 'lucide-react';
import { useState } from 'react';

export const PlanFormPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    type: 'CYBER_ATTACK',
    criticality: 'HAUTE',
    description: '',
    steps: [] as any[]
  });

  const [newStep, setNewStep] = useState({
    title: '',
    description: '',
    role: '',
    targetDurationMinutes: 30
  });

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Plan créé: ${formData.name}\n\n${formData.steps.length} étapes définies.\n\nEn production, ce plan serait sauvegardé dans la base de données.`);
    navigate('/app/crisis/plans');
  };

  const addStep = () => {
    if (!newStep.title.trim()) return;
    setFormData({
      ...formData,
      steps: [...formData.steps, { ...newStep, id: Date.now().toString(), orderIndex: formData.steps.length + 1 }]
    });
    setNewStep({ title: '', description: '', role: '', targetDurationMinutes: 30 });
  };

  const removeStep = (index: number) => {
    setFormData({
      ...formData,
      steps: formData.steps.filter((_, i) => i !== index)
    });
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newSteps = [...formData.steps];
    const draggedStep = newSteps[draggedIndex];
    newSteps.splice(draggedIndex, 1);
    newSteps.splice(index, 0, draggedStep);

    setFormData({ ...formData, steps: newSteps });
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div>
      <Link to="/app/crisis/plans" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4">
        <ArrowLeft className="w-4 h-4 mr-1" />
        Retour aux plans
      </Link>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Créer un plan de crise</h1>
          <p className="text-sm text-gray-600 mt-1">Définissez les étapes et procédures pour gérer une crise</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nom du plan *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="ex: Attaque ransomware"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="CYBER_ATTACK">Cyberattaque</option>
                <option value="INFRASTRUCTURE_OUTAGE">Panne infrastructure</option>
                <option value="DATA_LEAK">Fuite de données</option>
                <option value="NATURAL_DISASTER">Catastrophe naturelle</option>
                <option value="OTHER">Autre</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Criticité *</label>
              <select
                value={formData.criticality}
                onChange={(e) => setFormData({ ...formData, criticality: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="CRITIQUE">Critique</option>
                <option value="HAUTE">Haute</option>
                <option value="MOYENNE">Moyenne</option>
                <option value="BASSE">Basse</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Décrivez le contexte et l'objectif de ce plan"
            />
          </div>

          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Étapes du plan ({formData.steps.length})</h3>
            </div>

            {formData.steps.length > 0 && (
              <div className="space-y-3 mb-4">
                {formData.steps.map((step, index) => (
                  <div
                    key={step.id}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg cursor-move hover:bg-gray-100 transition ${
                      draggedIndex === index ? 'opacity-50' : ''
                    }`}
                  >
                    <GripVertical className="w-5 h-5 text-gray-400" />
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{step.title}</div>
                      <div className="text-sm text-gray-600">{step.role} - {step.targetDurationMinutes} min</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeStep(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Ajouter une étape</h4>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <input
                  type="text"
                  value={newStep.title}
                  onChange={(e) => setNewStep({ ...newStep, title: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Titre de l'étape"
                />
                <input
                  type="text"
                  value={newStep.role}
                  onChange={(e) => setNewStep({ ...newStep, role: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Rôle responsable"
                />
              </div>
              <input
                type="text"
                value={newStep.description}
                onChange={(e) => setNewStep({ ...newStep, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none mb-3"
                placeholder="Description de l'étape"
              />
              <div className="flex items-center justify-between">
                <input
                  type="number"
                  value={newStep.targetDurationMinutes}
                  onChange={(e) => setNewStep({ ...newStep, targetDurationMinutes: parseInt(e.target.value) || 0 })}
                  className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Durée (min)"
                />
                <button
                  type="button"
                  onClick={addStep}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium inline-flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <Link
              to="/app/crisis/plans"
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              Annuler
            </Link>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium inline-flex items-center"
            >
              <Save className="w-4 h-4 mr-2" />
              Créer le plan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

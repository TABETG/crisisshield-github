import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const MOCK_TOKEN = 'mock-jwt-token-12345';
const MOCK_REFRESH_TOKEN = 'mock-refresh-token-67890';

const mockUser = {
  id: '1',
  email: 'admin@crisisshield.com',
  fullName: 'Admin User',
  roles: ['ORG_ADMIN', 'CRISIS_MANAGER'],
  status: 'ACTIVE',
  organisation: {
    id: '1',
    name: 'Acme Corporation',
    logoUrl: 'https://via.placeholder.com/200',
    timezone: 'UTC',
    defaultLanguage: 'en'
  },
  lastLogin: new Date().toISOString(),
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: new Date().toISOString()
};

const mockPlans = [
  {
    id: '1',
    name: 'Cyber Attack Response Plan',
    type: 'CYBER_ATTACK',
    criticality: 'CRITICAL',
    description: 'Comprehensive plan for handling cyber security incidents',
    status: 'PUBLISHED',
    nextReviewDate: '2025-03-01',
    steps: [
      { id: '1', title: 'Initial Assessment', description: 'Assess the scope and impact', roleResponsible: 'CRISIS_MANAGER', criticality: 'CRITICAL', targetDuration: 15, order: 0 },
      { id: '2', title: 'Containment', description: 'Isolate affected systems', roleResponsible: 'ORG_ADMIN', criticality: 'HIGH', targetDuration: 30, order: 1 }
    ],
    createdBy: 'Admin User',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-02-20T14:30:00Z'
  },
  {
    id: '2',
    name: 'Natural Disaster Protocol',
    type: 'NATURAL_DISASTER',
    criticality: 'HIGH',
    description: 'Emergency response for natural disasters',
    status: 'DRAFT',
    nextReviewDate: '2025-06-01',
    steps: [],
    createdBy: 'Admin User',
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-02-01T10:00:00Z'
  }
];

const mockEvents = [
  {
    id: '1',
    planId: '1',
    planName: 'Cyber Attack Response Plan',
    status: 'ACTIVE',
    severity: 'CRITICAL',
    startTime: '2024-11-30T08:00:00Z',
    description: 'Active security breach detected',
    createdBy: 'Admin User',
    createdAt: '2024-11-30T08:00:00Z',
    updatedAt: '2024-11-30T08:00:00Z'
  }
];

const mockTasks = [
  {
    id: '1',
    title: 'Review security logs',
    description: 'Analyze logs for breach indicators',
    status: 'IN_PROGRESS',
    assigneeRole: 'CRISIS_MANAGER',
    assigneeId: '1',
    assigneeName: 'Admin User',
    stepId: '1',
    eventId: '1',
    createdAt: '2024-11-30T08:05:00Z',
    updatedAt: '2024-11-30T09:00:00Z'
  },
  {
    id: '2',
    title: 'Notify stakeholders',
    description: 'Send initial notification to key stakeholders',
    status: 'TO_DO',
    assigneeRole: 'ORG_ADMIN',
    assigneeId: '1',
    assigneeName: 'Admin User',
    stepId: '1',
    eventId: '1',
    createdAt: '2024-11-30T08:05:00Z',
    updatedAt: '2024-11-30T08:05:00Z'
  }
];

const mockTimeline = [
  {
    id: '1',
    eventId: '1',
    type: 'STATUS_CHANGE',
    message: 'Crisis activated',
    authorId: '1',
    authorName: 'Admin User',
    createdAt: '2024-11-30T08:00:00Z'
  },
  {
    id: '2',
    eventId: '1',
    type: 'COMMENT',
    message: 'Security team has been notified and is investigating',
    authorId: '1',
    authorName: 'Admin User',
    createdAt: '2024-11-30T08:10:00Z'
  }
];

const mockUsers = [
  mockUser,
  {
    id: '2',
    email: 'manager@crisisshield.com',
    fullName: 'Crisis Manager',
    roles: ['CRISIS_MANAGER', 'ORG_USER'],
    status: 'ACTIVE',
    lastLogin: '2024-11-29T15:30:00Z',
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z'
  }
];

// Auth endpoints
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (email === 'admin@crisisshield.com' && password === 'admin123') {
    res.json({ accessToken: MOCK_TOKEN, refreshToken: MOCK_REFRESH_TOKEN });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

app.post('/api/auth/refresh', (req, res) => {
  res.json({ accessToken: MOCK_TOKEN, refreshToken: MOCK_REFRESH_TOKEN });
});

app.get('/api/auth/me', (req, res) => {
  res.json(mockUser);
});

// Dashboard
app.get('/api/dashboard/summary', (req, res) => {
  res.json({
    plansCount: mockPlans.length,
    activeCrisesCount: mockEvents.filter(e => e.status === 'ACTIVE').length,
    overdueReviewsCount: 3,
    recentActivities: mockTimeline
  });
});

// Plans
app.get('/api/crisis/plans', (req, res) => res.json(mockPlans));
app.get('/api/crisis/plans/:id', (req, res) => {
  const plan = mockPlans.find(p => p.id === req.params.id);
  res.json(plan || {});
});
app.post('/api/crisis/plans', (req, res) => {
  const newPlan = { ...req.body, id: Date.now().toString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  mockPlans.push(newPlan);
  res.json(newPlan);
});
app.put('/api/crisis/plans/:id', (req, res) => {
  const index = mockPlans.findIndex(p => p.id === req.params.id);
  if (index >= 0) {
    mockPlans[index] = { ...mockPlans[index], ...req.body, updatedAt: new Date().toISOString() };
    res.json(mockPlans[index]);
  } else {
    res.status(404).json({ message: 'Plan not found' });
  }
});
app.get('/api/crisis/plans/:id/documents', (req, res) => res.json([]));
app.post('/api/crisis/plans/:id/documents', (req, res) => res.json({ id: '1', name: 'document.pdf' }));
app.post('/api/crisis/plans/:id/activate', (req, res) => {
  const plan = mockPlans.find(p => p.id === req.params.id);
  const newEvent = {
    id: Date.now().toString(),
    planId: req.params.id,
    planName: plan?.name || 'Unknown Plan',
    status: 'ACTIVE',
    severity: plan?.criticality || 'HIGH',
    startTime: new Date().toISOString(),
    createdBy: 'Admin User',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  mockEvents.push(newEvent);
  res.json(newEvent);
});

// Events
app.get('/api/crisis/events', (req, res) => res.json(mockEvents));
app.get('/api/crisis/events/:id', (req, res) => {
  const event = mockEvents.find(e => e.id === req.params.id);
  res.json(event || {});
});
app.post('/api/crisis/events/:id/close', (req, res) => {
  const event = mockEvents.find(e => e.id === req.params.id);
  if (event) {
    event.status = 'CLOSED';
    event.endTime = new Date().toISOString();
    res.json(event);
  } else {
    res.status(404).json({ message: 'Event not found' });
  }
});
app.get('/api/crisis/events/:id/tasks', (req, res) => {
  res.json(mockTasks.filter(t => t.eventId === req.params.id));
});
app.patch('/api/crisis/tasks/:taskId', (req, res) => {
  const task = mockTasks.find(t => t.id === req.params.taskId);
  if (task) {
    Object.assign(task, req.body, { updatedAt: new Date().toISOString() });
    res.json(task);
  } else {
    res.status(404).json({ message: 'Task not found' });
  }
});
app.get('/api/crisis/events/:id/timeline', (req, res) => {
  res.json(mockTimeline.filter(t => t.eventId === req.params.id));
});
app.post('/api/crisis/events/:id/timeline', (req, res) => {
  const newEntry = {
    id: Date.now().toString(),
    eventId: req.params.id,
    ...req.body,
    authorId: '1',
    authorName: 'Admin User',
    createdAt: new Date().toISOString()
  };
  mockTimeline.push(newEntry);
  res.json(newEntry);
});
app.get('/api/crisis/tasks/my', (req, res) => res.json(mockTasks));

// Admin
app.get('/api/admin/users', (req, res) => res.json(mockUsers));
app.post('/api/admin/users', (req, res) => {
  const newUser = { ...req.body, id: Date.now().toString(), status: 'ACTIVE', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  mockUsers.push(newUser);
  res.json(newUser);
});
app.patch('/api/admin/users/:id', (req, res) => {
  const user = mockUsers.find(u => u.id === req.params.id);
  if (user) {
    Object.assign(user, req.body, { updatedAt: new Date().toISOString() });
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});
app.get('/api/admin/organisation', (req, res) => res.json(mockUser.organisation));
app.put('/api/admin/organisation', (req, res) => {
  Object.assign(mockUser.organisation, req.body);
  res.json(mockUser.organisation);
});
app.post('/api/admin/organisation/logo', (req, res) => {
  res.json({ logoUrl: 'https://via.placeholder.com/200' });
});

// Emergency Kits MVP2
app.get('/api/emergency/kits', (req, res) => res.json([{ id: '1', name: 'Emergency Kit 2024-11-30', status: 'READY', generatedAt: new Date().toISOString(), fileSize: 5242880, downloadUrl: '#', includedPlans: ['Plan 1', 'Plan 2'], createdBy: 'Admin User' }]));
app.get('/api/emergency/kits/:id', (req, res) => res.json({ id: req.params.id, name: 'Emergency Kit 2024-11-30', status: 'READY', generatedAt: new Date().toISOString(), fileSize: 5242880, downloadUrl: '#', includedPlans: ['Plan 1', 'Plan 2'], createdBy: 'Admin User' }));
app.post('/api/emergency/kits', (req, res) => res.json({ id: Date.now().toString(), ...req.body, status: 'GENERATING', generatedAt: new Date().toISOString(), createdBy: 'Admin User' }));

// Audit Logs MVP2
app.get('/api/audit/logs', (req, res) => res.json([{ id: '1', timestamp: new Date().toISOString(), userId: '1', userName: 'Admin User', action: 'LOGIN', ipAddress: '192.168.1.1' }, { id: '2', timestamp: new Date(Date.now() - 3600000).toISOString(), userId: '1', userName: 'Admin User', action: 'CREATE_PLAN', resourceType: 'PLAN', details: 'Created plan: Cyber Attack Response' }]));
app.get('/api/audit/logs/export', (req, res) => res.json({ url: '#' }));

// Billing MVP2
app.get('/api/billing/overview', (req, res) => res.json({ currentPlan: 'PROFESSIONAL', subscriptionStatus: 'ACTIVE', limits: { maxUsers: 50, maxPlans: 100, maxDocuments: 1000, maxStorage: 10000 }, usage: { users: 12, plans: 23, documents: 145, storageUsed: 2340 }, nextBillingDate: '2025-01-01', amount: 299, currency: '$' }));
app.post('/api/billing/upgrade', (req, res) => res.json({ checkoutUrl: 'https://stripe.com/checkout' }));

// Partner MVP2
app.get('/api/partner/organisations', (req, res) => res.json([{ id: '1', name: 'Acme Corp', plan: 'PROFESSIONAL', createdAt: '2024-01-01', stats: { plansCount: 23, activeCrisesCount: 2, usersCount: 12, overdueReviewsCount: 3 } }, { id: '2', name: 'TechStart Inc', plan: 'STARTER', createdAt: '2024-02-15', stats: { plansCount: 8, activeCrisesCount: 0, usersCount: 5, overdueReviewsCount: 1 } }]));
app.get('/api/partner/organisations/:id', (req, res) => res.json({ id: req.params.id, name: 'Acme Corp', plan: 'PROFESSIONAL', createdAt: '2024-01-01', stats: { plansCount: 23, activeCrisesCount: 2, usersCount: 12, overdueReviewsCount: 3 } }));

// Reports MVP3
app.get('/api/reports', (req, res) => res.json([{ id: '1', type: 'CRISIS_SUMMARY', status: 'READY', generatedAt: new Date().toISOString(), generatedBy: '1', generatedByName: 'Admin User', fileName: 'crisis-summary-2024-11.pdf', fileSize: 245600, downloadUrl: '#' }]));
app.get('/api/reports/:id', (req, res) => res.json({ id: req.params.id, type: 'CRISIS_SUMMARY', status: 'READY', generatedAt: new Date().toISOString(), generatedBy: '1', generatedByName: 'Admin User', fileName: 'crisis-summary-2024-11.pdf', fileSize: 245600, downloadUrl: '#' }));
app.get('/api/reports/:id/download', (req, res) => res.json({ url: '#' }));

// System Status MVP3
app.get('/api/admin/tech/status', (req, res) => res.json({ version: '1.0.0', uptime: 864000, services: [{ name: 'API Gateway', status: 'UP', responseTime: 45 }, { name: 'Database', status: 'UP', responseTime: 12 }, { name: 'Storage', status: 'UP', responseTime: 23 }], security: { pkiStatus: 'HEALTHY', hsmConnected: true, certificateInfo: { commonName: 'crisisshield.com', expiresAt: '2025-12-31T00:00:00Z', issuer: 'DigiCert' }, lastHealthCheck: new Date().toISOString() } }));
app.get('/api/admin/security/status', (req, res) => res.json({ pkiStatus: 'HEALTHY', hsmConnected: true, lastHealthCheck: new Date().toISOString() }));

// AI Endpoints MVP3
app.post('/api/ai/plans/generate', (req, res) => res.json({ suggestedPlan: { name: 'AI Generated Plan', type: 'CYBER_ATTACK', criticality: req.body.criticality, description: 'An AI-generated crisis response plan', steps: [{ title: 'Initial Assessment', description: 'Evaluate situation', roleResponsible: 'CRISIS_MANAGER', criticality: 'HIGH', targetDuration: 15, order: 0 }] } }));
app.post('/api/ai/plans/:id/analyze', (req, res) => res.json({ score: 85, suggestions: ['Add communication step', 'Define escalation criteria'], missingElements: ['Recovery procedures'], strengths: ['Clear roles', 'Well-documented steps'] }));
app.post('/api/ai/crisis-events/:id/summarize', (req, res) => res.json({ summary: 'Crisis successfully managed with minimal impact', keyEvents: ['Crisis activated at 08:00', 'Containment achieved at 09:30'], recommendations: ['Review communication protocols', 'Update documentation'], riskLevel: 'MEDIUM' }));

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`\n🚀 Mock API Server running on http://localhost:${PORT}`);
  console.log(`\n📧 Login credentials:`);
  console.log(`   Email: admin@crisisshield.com`);
  console.log(`   Password: admin123\n`);
});

import express from 'express';

const router = express.Router();

// Mock workflow data
const mockWorkflows = [
  {
    id: 'WF001',
    invoiceId: 'NF003-2024',
    supplier: 'Hydro Alunorte',
    total: 8756.25,
    status: 'DIVERGENCE_DETECTED',
    divergences: [
      {
        id: 'DIV001',
        type: 'XML_VALIDATION_ERROR',
        message: 'Invalid XML structure detected',
        severity: 'HIGH',
        createdAt: '2024-01-13T09:15:00Z'
      },
      {
        id: 'DIV002',
        type: 'MISSING_FIELD',
        message: 'CNPJ field is missing',
        severity: 'MEDIUM',
        createdAt: '2024-01-13T09:16:00Z'
      }
    ],
    createdAt: '2024-01-13T09:15:00Z'
  },
  {
    id: 'WF002',
    invoiceId: 'NF004-2024',
    supplier: 'Rusal Brasil',
    total: 12345.67,
    status: 'RESOLVED',
    divergences: [
      {
        id: 'DIV003',
        type: 'TAX_CALCULATION_ERROR',
        message: 'ICMS calculation does not match',
        severity: 'HIGH',
        createdAt: '2024-01-12T14:30:00Z',
        resolvedAt: '2024-01-12T16:45:00Z'
      }
    ],
    createdAt: '2024-01-12T14:30:00Z',
    resolvedAt: '2024-01-12T16:45:00Z'
  },
  {
    id: 'WF003',
    invoiceId: 'NF005-2024',
    supplier: 'Mineração Rio do Norte',
    total: 9876.54,
    status: 'PENDING_VALIDATION',
    divergences: [],
    createdAt: '2024-01-11T11:20:00Z'
  }
];

// Get all workflows
router.get('/', (req, res) => {
  const { status, supplier } = req.query;
  
  let filteredWorkflows = mockWorkflows;
  
  if (status) {
    filteredWorkflows = filteredWorkflows.filter(workflow => 
      workflow.status === status
    );
  }
  
  if (supplier) {
    filteredWorkflows = filteredWorkflows.filter(workflow => 
      workflow.supplier.toLowerCase().includes(supplier.toString().toLowerCase())
    );
  }
  
  res.json({
    success: true,
    data: filteredWorkflows,
    total: filteredWorkflows.length,
    timestamp: new Date().toISOString()
  });
});

// Get specific workflow
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const workflow = mockWorkflows.find(wf => wf.id === id);
  
  if (!workflow) {
    return res.status(404).json({
      success: false,
      message: 'Workflow not found'
    });
  }
  
  res.json({
    success: true,
    data: workflow,
    timestamp: new Date().toISOString()
  });
});

// Resolve divergence
router.post('/:id/resolve', (req, res) => {
  const { id } = req.params;
  const { divergenceId, resolution } = req.body;
  
  const workflow = mockWorkflows.find(wf => wf.id === id);
  
  if (!workflow) {
    return res.status(404).json({
      success: false,
      message: 'Workflow not found'
    });
  }
  
  const divergence = workflow.divergences.find(div => div.id === divergenceId);
  
  if (!divergence) {
    return res.status(404).json({
      success: false,
      message: 'Divergence not found'
    });
  }
  
  // Mark divergence as resolved
  divergence.resolvedAt = new Date().toISOString();
  divergence.resolution = resolution;
  
  // Check if all divergences are resolved
  const allResolved = workflow.divergences.every(div => div.resolvedAt);
  
  if (allResolved) {
    workflow.status = 'RESOLVED';
    workflow.resolvedAt = new Date().toISOString();
  }
  
  res.json({
    success: true,
    message: 'Divergence resolved successfully',
    data: workflow,
    timestamp: new Date().toISOString()
  });
});

// Mark workflow as resolved
router.patch('/:id/mark-resolved', (req, res) => {
  const { id } = req.params;
  const workflow = mockWorkflows.find(wf => wf.id === id);
  
  if (!workflow) {
    return res.status(404).json({
      success: false,
      message: 'Workflow not found'
    });
  }
  
  workflow.status = 'RESOLVED';
  workflow.resolvedAt = new Date().toISOString();
  
  res.json({
    success: true,
    message: 'Workflow marked as resolved',
    data: workflow,
    timestamp: new Date().toISOString()
  });
});

// Get workflow statistics
router.get('/stats/overview', (req, res) => {
  const totalWorkflows = mockWorkflows.length;
  const pendingValidation = mockWorkflows.filter(wf => wf.status === 'PENDING_VALIDATION').length;
  const divergenceDetected = mockWorkflows.filter(wf => wf.status === 'DIVERGENCE_DETECTED').length;
  const resolved = mockWorkflows.filter(wf => wf.status === 'RESOLVED').length;
  
  const totalDivergences = mockWorkflows.reduce((sum, wf) => sum + wf.divergences.length, 0);
  const resolvedDivergences = mockWorkflows.reduce((sum, wf) => 
    sum + wf.divergences.filter(div => div.resolvedAt).length, 0
  );
  
  res.json({
    success: true,
    data: {
      totalWorkflows,
      pendingValidation,
      divergenceDetected,
      resolved,
      totalDivergences,
      resolvedDivergences,
      resolutionRate: totalDivergences > 0 ? (resolvedDivergences / totalDivergences * 100).toFixed(1) : '0'
    },
    timestamp: new Date().toISOString()
  });
});

export default router;

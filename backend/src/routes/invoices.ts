import express from 'express';

const router = express.Router();

// Mock invoice data
const mockInvoices = [
  {
    id: 'INV001',
    invoiceId: 'NF001-2024',
    supplier: 'Vale Alumínio',
    total: 10234.50,
    status: 'PENDING_VALIDATION',
    validationStatus: 'READING',
    xmlData: '<?xml version="1.0" encoding="UTF-8"?><nfeProc>...</nfeProc>',
    createdAt: '2024-01-15T10:00:00Z',
    divergences: []
  },
  {
    id: 'INV002',
    invoiceId: 'NF002-2024',
    supplier: 'Alcoa Brasil',
    total: 5421.00,
    status: 'VALIDATED',
    validationStatus: 'READY',
    xmlData: '<?xml version="1.0" encoding="UTF-8"?><nfeProc>...</nfeProc>',
    createdAt: '2024-01-14T15:30:00Z',
    divergences: []
  },
  {
    id: 'INV003',
    invoiceId: 'NF003-2024',
    supplier: 'Hydro Alunorte',
    total: 8756.25,
    status: 'ERROR',
    validationStatus: 'VALIDATING',
    xmlData: '<?xml version="1.0" encoding="UTF-8"?><nfeProc>...</nfeProc>',
    createdAt: '2024-01-13T09:15:00Z',
    divergences: [
      {
        id: 'DIV001',
        type: 'XML_VALIDATION_ERROR',
        message: 'Invalid XML structure detected',
        status: 'PENDING'
      },
      {
        id: 'DIV002',
        type: 'MISSING_FIELD',
        message: 'CNPJ field is missing',
        status: 'PENDING'
      }
    ]
  }
];

// Get all invoices
router.get('/', (req, res) => {
  const { status, supplier, validationStatus } = req.query;
  
  let filteredInvoices = mockInvoices;
  
  if (status) {
    filteredInvoices = filteredInvoices.filter(invoice => 
      invoice.status === status
    );
  }
  
  if (supplier) {
    filteredInvoices = filteredInvoices.filter(invoice => 
      invoice.supplier.toLowerCase().includes(supplier.toString().toLowerCase())
    );
  }
  
  if (validationStatus) {
    filteredInvoices = filteredInvoices.filter(invoice => 
      invoice.validationStatus === validationStatus
    );
  }
  
  res.json({
    success: true,
    data: filteredInvoices,
    total: filteredInvoices.length,
    timestamp: new Date().toISOString()
  });
});

// Get specific invoice
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const invoice = mockInvoices.find(inv => inv.id === id);
  
  if (!invoice) {
    return res.status(404).json({
      success: false,
      message: 'Invoice not found'
    });
  }
  
  res.json({
    success: true,
    data: invoice,
    timestamp: new Date().toISOString()
  });
});

// Validate invoice
router.post('/:id/validate', (req, res) => {
  const { id } = req.params;
  const invoice = mockInvoices.find(inv => inv.id === id);
  
  if (!invoice) {
    return res.status(404).json({
      success: false,
      message: 'Invoice not found'
    });
  }
  
  // Simulate validation process
  setTimeout(() => {
    const hasErrors = Math.random() > 0.7; // 30% chance of errors
    
    if (hasErrors) {
      invoice.status = 'ERROR';
      invoice.validationStatus = 'READY';
      invoice.divergences = [
        {
          id: `DIV${Date.now()}`,
          type: 'VALIDATION_ERROR',
          message: 'Invoice validation failed',
          status: 'PENDING'
        }
      ];
    } else {
      invoice.status = 'VALIDATED';
      invoice.validationStatus = 'READY';
      invoice.divergences = [];
    }
    
    res.json({
      success: true,
      message: 'Invoice validation completed',
      data: invoice,
      timestamp: new Date().toISOString()
    });
  }, 2000);
});

// Update invoice status
router.patch('/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  const invoice = mockInvoices.find(inv => inv.id === id);
  
  if (!invoice) {
    return res.status(404).json({
      success: false,
      message: 'Invoice not found'
    });
  }
  
  invoice.status = status;
  
  res.json({
    success: true,
    message: 'Invoice status updated',
    data: invoice,
    timestamp: new Date().toISOString()
  });
});

export default router;

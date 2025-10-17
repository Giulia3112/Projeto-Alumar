import express from 'express';

const router = express.Router();

// Mock EBS data
const mockEBSData = [
  {
    id: 1,
    invoiceId: 'NF001-2024',
    supplier: 'Vale Alumínio',
    total: 10234.50,
    status: 'Pending Validation',
    date: '2024-01-15',
    xmlData: '<?xml version="1.0" encoding="UTF-8"?><nfeProc>...</nfeProc>',
    jsonData: {
      emit: { nome: 'Vale Alumínio', cnpj: '12345678000123' },
      dest: { nome: 'Alumar', cnpj: '98765432000198' },
      total: { ICMSTot: { vNF: 10234.50 } }
    }
  },
  {
    id: 2,
    invoiceId: 'NF002-2024',
    supplier: 'Alcoa Brasil',
    total: 5421.00,
    status: 'Validated',
    date: '2024-01-14',
    xmlData: '<?xml version="1.0" encoding="UTF-8"?><nfeProc>...</nfeProc>',
    jsonData: {
      emit: { nome: 'Alcoa Brasil', cnpj: '11111111000111' },
      dest: { nome: 'Alumar', cnpj: '98765432000198' },
      total: { ICMSTot: { vNF: 5421.00 } }
    }
  },
  {
    id: 3,
    invoiceId: 'NF003-2024',
    supplier: 'Hydro Alunorte',
    total: 8756.25,
    status: 'Processing',
    date: '2024-01-13',
    xmlData: '<?xml version="1.0" encoding="UTF-8"?><nfeProc>...</nfeProc>',
    jsonData: {
      emit: { nome: 'Hydro Alunorte', cnpj: '22222222000122' },
      dest: { nome: 'Alumar', cnpj: '98765432000198' },
      total: { ICMSTot: { vNF: 8756.25 } }
    }
  }
];

// Test EBS connection
router.get('/test-connection', (req, res) => {
  // Simulate connection test
  setTimeout(() => {
    res.json({
      success: true,
      message: 'EBS connection successful (mock)',
      timestamp: new Date().toISOString(),
      connectionDetails: {
        host: 'ebs.alumar.local',
        port: 8080,
        database: 'EBS_PROD',
        status: 'CONNECTED'
      }
    });
  }, 1000);
});

// Fetch EBS data (purchase orders and invoices)
router.get('/data', (req, res) => {
  const { status, supplier } = req.query;
  
  let filteredData = mockEBSData;
  
  if (status) {
    filteredData = filteredData.filter(item => 
      item.status.toLowerCase().includes(status.toString().toLowerCase())
    );
  }
  
  if (supplier) {
    filteredData = filteredData.filter(item => 
      item.supplier.toLowerCase().includes(supplier.toString().toLowerCase())
    );
  }
  
  res.json({
    success: true,
    data: filteredData,
    total: filteredData.length,
    timestamp: new Date().toISOString()
  });
});

// Fetch specific invoice by ID
router.get('/data/:id', (req, res) => {
  const { id } = req.params;
  const invoice = mockEBSData.find(item => item.id.toString() === id);
  
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

// Simulate sending data back to EBS
router.post('/post-data', (req, res) => {
  const { invoiceId, action, data } = req.body;
  
  // Simulate processing delay
  setTimeout(() => {
    res.json({
      success: true,
      message: `Data successfully posted to EBS for invoice ${invoiceId}`,
      action,
      timestamp: new Date().toISOString(),
      response: {
        transactionId: `TXN-${Date.now()}`,
        status: 'COMPLETED'
      }
    });
  }, 1500);
});

export default router;

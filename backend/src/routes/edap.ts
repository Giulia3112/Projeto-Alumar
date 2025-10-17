import express from 'express';

const router = express.Router();

// Mock EDAP responses
const mockEDAPResponses = [
  {
    id: 'EDAP001',
    status: 'SUCCESS',
    message: 'NF-e successfully processed and sent to SEFAZ',
    timestamp: '2024-01-15T10:30:00Z',
    invoiceId: 'NF001-2024'
  },
  {
    id: 'EDAP002',
    status: 'PENDING',
    message: 'NF-e is being processed by EDAP',
    timestamp: '2024-01-15T11:15:00Z',
    invoiceId: 'NF002-2024'
  },
  {
    id: 'EDAP003',
    status: 'ERROR',
    message: 'Validation error in NF-e data',
    timestamp: '2024-01-15T12:00:00Z',
    invoiceId: 'NF003-2024',
    errors: ['Invalid CNPJ format', 'Missing fiscal information']
  }
];

// Test EDAP connection
router.get('/test-connection', (req, res) => {
  setTimeout(() => {
    res.json({
      success: true,
      message: 'EDAP connection successful (mock)',
      timestamp: new Date().toISOString(),
      connectionDetails: {
        endpoint: 'https://edap.sefaz.ma.gov.br/api',
        version: 'v2.1',
        status: 'CONNECTED',
        lastSync: '2024-01-15T10:00:00Z'
      }
    });
  }, 800);
});

// Send data to EDAP
router.post('/send', (req, res) => {
  const { invoiceData, action } = req.body;
  
  // Simulate EDAP processing
  setTimeout(() => {
    const isSuccess = Math.random() > 0.2; // 80% success rate
    
    if (isSuccess) {
      res.json({
        success: true,
        message: 'Data successfully sent to EDAP',
        data: {
          id: `EDAP${Date.now()}`,
          status: 'SUCCESS',
          invoiceId: invoiceData.invoiceId,
          sefazProtocol: `SEFAZ-${Date.now()}`,
          timestamp: new Date().toISOString()
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'EDAP processing failed',
        errors: ['Invalid XML format', 'Missing required fields'],
        data: {
          id: `EDAP${Date.now()}`,
          status: 'ERROR',
          invoiceId: invoiceData.invoiceId,
          timestamp: new Date().toISOString()
        }
      });
    }
  }, 2000);
});

// Get EDAP status for specific invoice
router.get('/status/:invoiceId', (req, res) => {
  const { invoiceId } = req.params;
  
  const response = mockEDAPResponses.find(r => r.invoiceId === invoiceId);
  
  if (!response) {
    return res.status(404).json({
      success: false,
      message: 'Invoice not found in EDAP system'
    });
  }
  
  res.json({
    success: true,
    data: response,
    timestamp: new Date().toISOString()
  });
});

// Get all EDAP responses
router.get('/responses', (req, res) => {
  const { status, limit = 10 } = req.query;
  
  let filteredResponses = mockEDAPResponses;
  
  if (status) {
    filteredResponses = filteredResponses.filter(r => 
      r.status.toLowerCase() === status.toString().toLowerCase()
    );
  }
  
  const limitedResponses = filteredResponses.slice(0, Number(limit));
  
  res.json({
    success: true,
    data: limitedResponses,
    total: filteredResponses.length,
    timestamp: new Date().toISOString()
  });
});

// Simulate SEFAZ manifestation
router.post('/manifestation', (req, res) => {
  const { invoiceId, manifestationType } = req.body;
  
  setTimeout(() => {
    res.json({
      success: true,
      message: `Manifestation ${manifestationType} processed successfully`,
      data: {
        invoiceId,
        manifestationType,
        protocol: `SEFAZ-MAN-${Date.now()}`,
        status: 'PROCESSED',
        timestamp: new Date().toISOString()
      }
    });
  }, 1200);
});

export default router;

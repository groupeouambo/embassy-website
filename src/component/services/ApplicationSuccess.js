import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import JsBarcode from 'jsbarcode';
import { downloadBarcode } from '../../utils/BarcodeGenerator';
import './applicationSuccess.css';

export default function ApplicationSuccess({ trackingNumber, applicationType, applicationId, onClose }) {
  const navigate = useNavigate();
  const barcodeRef = useRef(null);
  const [adminTracking, setAdminTracking] = React.useState(null);
  const [shippingCarrier, setShippingCarrier] = React.useState(null);
  const [applicationStatus, setApplicationStatus] = React.useState('pending');

  useEffect(() => {
    if (barcodeRef.current && trackingNumber) {
      try {
        JsBarcode(barcodeRef.current, trackingNumber, {
          format: 'CODE128',
          width: 2,
          height: 80,
          displayValue: true,
          fontSize: 16,
          margin: 10,
          background: '#ffffff',
          lineColor: '#000000'
        });
      } catch (error) {
        console.error('Barcode generation failed:', error);
      }
    }
  }, [trackingNumber]);

  // Poll for tracking number updates from admin
  useEffect(() => {
    if (!applicationId) return;

    const checkTrackingStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:4000';

        const endpointMap = {
          visa: 'visa-applications',
          marriage: 'marriage-applications',
          birth: 'birth-certificate-applications',
          travel: 'travel-pass-applications'
        };

        const endpoint = endpointMap[applicationType];
        if (!endpoint) return;

        const response = await fetch(`${apiUrl}/api/${endpoint}/${applicationId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.tracking_number) {
            setAdminTracking(data.tracking_number);
          }
          if (data.shipping_carrier) {
            setShippingCarrier(data.shipping_carrier);
          }
          if (data.status) {
            setApplicationStatus(data.status);
          }
        }
      } catch (error) {
        console.error('Failed to check tracking status:', error);
      }
    };

    // Check immediately
    checkTrackingStatus();

    // Poll every 10 seconds
    const interval = setInterval(checkTrackingStatus, 10000);

    return () => clearInterval(interval);
  }, [applicationId, applicationType]);

  const handleDownload = () => {
    downloadBarcode(trackingNumber, `${applicationType}-application`);
  };

  const handleDownloadPDF = async () => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:4000';

      const endpointMap = {
        visa: 'visa-applications',
        marriage: 'marriage-applications',
        birth: 'birth-certificate-applications',
        travel: 'travel-pass-applications'
      };

      const endpoint = endpointMap[applicationType];
      if (!endpoint || !applicationId) return;

      const response = await fetch(`${apiUrl}/api/${endpoint}/${applicationId}/pdf`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${applicationType}-application-${applicationId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Failed to download PDF:', error);
    }
  };

  const handleViewDashboard = () => {
    navigate('/dashboard/applications');
  };

  const applicationType_Label = {
    visa: 'Visa',
    birth: 'Birth Certificate',
    marriage: 'Marriage Certificate',
    travel: 'Travel Pass'
  }[applicationType] || 'Application';

  return (
    <div className="success-overlay">
      <div className="success-card">
        <div className="success-icon">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#10b981">
            <circle cx="12" cy="12" r="10" strokeWidth="2" />
            <path d="M9 12l2 2 4-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <h1>Application Submitted Successfully!</h1>
        <p className="success-message">
          Your {applicationType_Label} application has been received and is being processed.
        </p>

        <div className="tracking-section">
          <h3>Your Tracking Number</h3>
          <div className="tracking-number">{trackingNumber}</div>
          <p className="tracking-info">
            Please save this tracking number to check your application status
          </p>
        </div>

        <div className="barcode-section">
          <h3>Application Barcode</h3>
          <div className="barcode-container">
            <svg ref={barcodeRef}></svg>
          </div>
          <p className="barcode-info">
            Use this barcode at the embassy for quick reference
          </p>
        </div>

        {/* Admin Tracking Status */}
        <div className="tracking-status-section" style={{
          background: adminTracking ? '#f0fdf4' : '#fef3c7',
          border: `2px solid ${adminTracking ? '#10b981' : '#f59e0b'}`,
          borderRadius: '12px',
          padding: '20px',
          marginTop: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={adminTracking ? '#10b981' : '#f59e0b'} strokeWidth="2">
              <path d="M9 11l3 3L22 4" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#1f2937' }}>
              {adminTracking ? 'Tracking Number Assigned!' : 'Awaiting Admin Processing'}
            </h3>
          </div>

          {adminTracking ? (
            <div>
              <div style={{
                background: '#fff',
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '8px',
                border: '1px solid #d1fae5'
              }}>
                {shippingCarrier && (
                  <div style={{ marginBottom: '12px' }}>
                    <p style={{ margin: '0 0 4px 0', fontSize: '0.875rem', color: '#6b7280' }}>
                      Shipping Carrier:
                    </p>
                    <div style={{
                      display: 'inline-block',
                      padding: '6px 12px',
                      background: '#eff6ff',
                      border: '1px solid #bfdbfe',
                      borderRadius: '6px',
                      color: '#1e40af',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      textTransform: 'uppercase'
                    }}>
                      {shippingCarrier}
                    </div>
                  </div>
                )}
                <p style={{ margin: '0 0 4px 0', fontSize: '0.875rem', color: '#6b7280' }}>
                  Official Tracking Number:
                </p>
                <p style={{
                  margin: 0,
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: '#10b981',
                  fontFamily: 'monospace',
                  letterSpacing: '1px'
                }}>
                  {adminTracking}
                </p>
              </div>
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#059669' }}>
                ✓ Your application has been assigned an official tracking number{shippingCarrier ? ` via ${shippingCarrier.toUpperCase()}` : ''}. You can now track your shipment!
              </p>
            </div>
          ) : (
            <div>
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#92400e' }}>
                Your application is pending admin review. Once processed, an official tracking number will be assigned here.
              </p>
              <div style={{
                marginTop: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.875rem',
                color: '#78716c'
              }}>
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid #f59e0b',
                  borderTopColor: 'transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
                Checking for updates...
              </div>
            </div>
          )}

          <div style={{
            marginTop: '12px',
            padding: '10px',
            background: 'rgba(255, 255, 255, 0.5)',
            borderRadius: '6px',
            fontSize: '0.875rem',
            color: '#374151'
          }}>
            <strong>Status:</strong> {applicationStatus.replace(/_/g, ' ').toUpperCase()}
          </div>
        </div>

        <div className="success-actions">
          {applicationId && (
            <button onClick={handleDownloadPDF} className="btn-download" style={{ background: '#4285f4' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <polyline points="14 2 14 8 20 8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="12" y1="18" x2="12" y2="12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="9" y1="15" x2="15" y2="15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Download Full Application (PDF)
            </button>
          )}

          <button onClick={handleDownload} className="btn-download">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <polyline points="7 10 12 15 17 10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="12" y1="15" x2="12" y2="3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Download Barcode
          </button>

          <button onClick={handleViewDashboard} className="btn-dashboard">
            Go to My Dashboard
          </button>

          {onClose && (
            <button onClick={onClose} className="btn-close-success">
              Close
            </button>
          )}
        </div>

        <div className="next-steps">
          <h3>What Happens Next?</h3>
          <ol>
            <li>Download the full application PDF using the button above</li>
            <li>Mail the PDF to us at the embassy address for processing</li>
            <li>We will review your application within 2-3 business days</li>
            <li>Once processed, an official tracking number will appear above</li>
            <li>You will receive an email notification about the status updates</li>
            <li>Check your application status anytime in your dashboard</li>
            <li>Bring the printed barcode when visiting the embassy</li>
          </ol>
        </div>

        <div className="contact-reminder">
          <p>Questions? Contact us at:</p>
          <p><strong>Phone:</strong> +1 (202) 483-7800</p>
          <p><strong>Email:</strong> info@rcaembassy.org</p>
        </div>

        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
}

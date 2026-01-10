import React from 'react';
import { FaShippingFast, FaExternalLinkAlt } from 'react-icons/fa';
import './TrackingInfo.css';

// Tracking URL generators for different carriers
const getTrackingUrl = (carrier, trackingNumber) => {
  if (!trackingNumber) return null;

  const carrierLower = carrier?.toLowerCase() || '';

  if (carrierLower.includes('ups')) {
    return `https://www.ups.com/track?tracknum=${trackingNumber}`;
  } else if (carrierLower.includes('usps')) {
    return `https://tools.usps.com/go/TrackConfirmAction?tLabels=${trackingNumber}`;
  } else if (carrierLower.includes('fedex')) {
    return `https://www.fedex.com/fedextrack/?trknbr=${trackingNumber}`;
  } else if (carrierLower.includes('dhl')) {
    return `https://www.dhl.com/en/express/tracking.html?AWB=${trackingNumber}`;
  }

  return null;
};

// Get carrier logo/name display
const getCarrierDisplay = (carrier) => {
  if (!carrier) return { name: 'Standard Shipping', color: '#6b7280' };

  const carrierLower = carrier.toLowerCase();

  if (carrierLower.includes('ups')) {
    return { name: 'UPS', color: '#351c15', logo: '📦' };
  } else if (carrierLower.includes('usps')) {
    return { name: 'USPS', color: '#004B87', logo: '✉️' };
  } else if (carrierLower.includes('fedex')) {
    return { name: 'FedEx', color: '#4D148C', logo: '📮' };
  } else if (carrierLower.includes('dhl')) {
    return { name: 'DHL', color: '#FFCC00', logo: '🚚', textColor: '#D40511' };
  }

  return { name: carrier, color: '#6b7280', logo: '📫' };
};

export default function TrackingInfo({ trackingNumber, shippingCarrier, size = 'normal', showTitle = true }) {
  if (!trackingNumber) {
    return null;
  }

  const trackingUrl = getTrackingUrl(shippingCarrier, trackingNumber);
  const carrierDisplay = getCarrierDisplay(shippingCarrier);

  return (
    <div className={`tracking-info tracking-info-${size}`}>
      {showTitle && (
        <div className="tracking-header">
          <FaShippingFast className="tracking-icon" />
          <span>Package Tracking</span>
        </div>
      )}

      <div className="tracking-content">
        <div className="tracking-carrier" style={{
          borderColor: carrierDisplay.color,
          color: carrierDisplay.textColor || carrierDisplay.color
        }}>
          <span className="carrier-logo">{carrierDisplay.logo}</span>
          <span className="carrier-name">{carrierDisplay.name}</span>
        </div>

        <div className="tracking-number-display">
          <div className="tracking-label">Tracking Number</div>
          <div className="tracking-number-value">{trackingNumber}</div>
        </div>

        {trackingUrl && (
          <a
            href={trackingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="track-package-btn"
            style={{ borderColor: carrierDisplay.color, color: carrierDisplay.textColor || carrierDisplay.color }}
          >
            <span>Track Package</span>
            <FaExternalLinkAlt />
          </a>
        )}

        {!trackingUrl && shippingCarrier && (
          <div className="tracking-note">
            Contact {carrierDisplay.name} with tracking number to check status
          </div>
        )}
      </div>
    </div>
  );
}

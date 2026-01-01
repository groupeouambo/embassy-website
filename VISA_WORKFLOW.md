# Visa Application Workflow System

This document describes the visa application status management and tracking system.

## Features

### 1. Status Management

Admins can update visa application statuses through the following workflow:

- **pending** → Application submitted, awaiting review
- **under_review** → Application is being reviewed by staff
- **approved** → Visa application has been approved
- **denied** → Visa application has been denied
- **shipped** → Passport with visa has been shipped

### 2. Email Notifications

Applicants receive automatic email notifications when:
- Application status changes
- Tracking number is added for passport shipment

### 3. Tracking System

When a passport is shipped, admins can add a tracking number that:
- Is stored in the database
- Triggers an email notification to the applicant
- Displays on the applicant's dashboard

### 4. Status History

The system maintains a complete audit trail of status changes including:
- New status
- Previous status
- Admin who made the change
- Timestamp of change

## Setup Instructions

### Database Migration

If you have an existing database, run the migration to add new fields:

```bash
cd server
npm run migrate
```

This will add:
- `tracking_number` field (VARCHAR 100)
- `status_history` field (TEXT)
- `updated_at` timestamp field
- Status field converted to ENUM type
- Database indexes for better performance

### Environment Variables

Ensure your `server/.env` file includes:

```env
# Email notifications (required for status update emails)
SENDGRID_API_KEY=your_sendgrid_api_key
CONTACT_FROM=no-reply@yourdomain.com
```

## Admin Usage

### Accessing the Applications Page

1. Log in as an admin
2. Navigate to **Applications** from the sidebar
3. View all visa applications in a table

### Updating Application Status

1. Find the application in the table
2. Use the status dropdown to select a new status
3. The system will:
   - Update the database
   - Add entry to status history
   - Send email notification to applicant
   - Refresh the table

### Adding Tracking Numbers

1. Find the approved/shipped application
2. Click "Add Tracking" button
3. Enter the tracking number
4. Click "Save"
5. The system will:
   - Update the database
   - Send email with tracking number to applicant
   - Display tracking info on user dashboard

## User Dashboard

Users can view their applications with:
- Current status (color-coded badges)
- Submission date
- Tracking number (if available)
- Status statistics

## API Endpoints

### Update Application Status
```
PUT /api/visa-applications/:id/status
Authorization: Required (Admin only)
Body: { "status": "under_review" }
```

### Add Tracking Number
```
PUT /api/visa-applications/:id/tracking
Authorization: Required (Admin only)
Body: { "trackingNumber": "1Z999AA10123456784" }
```

### Get User Applications
```
GET /api/visa-applications/user/:username
Authorization: Required
Returns: Array of applications with tracking_number field
```

### Get All Applications (Admin)
```
GET /api/visa-applications
Authorization: Required (Admin only)
Returns: Array of all applications
```

## Email Templates

### Status Update Email

Subject: `Visa Application Status Update - [STATUS]`

Contains:
- Applicant name
- Application ID
- New status
- Status-specific message

### Tracking Number Email

Subject: `Tracking Number Available - Visa Application`

Contains:
- Applicant name
- Application ID
- Tracking number (large, bold)
- Instructions for tracking

## Database Schema

### visa_applications Table

```sql
CREATE TABLE visa_applications (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_name VARCHAR(255) NOT NULL,
  visa_type VARCHAR(50) NOT NULL,
  status ENUM('pending', 'under_review', 'approved', 'denied', 'shipped') NOT NULL DEFAULT 'pending',
  first_name VARCHAR(80),
  last_name VARCHAR(80),
  -- ... other fields ...
  tracking_number VARCHAR(100) DEFAULT NULL,
  status_history TEXT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_user_name (user_name),
  INDEX idx_status (status)
);
```

### status_history JSON Format

```json
[
  {
    "status": "under_review",
    "previousStatus": "pending",
    "changedBy": "admin@embassy.org",
    "changedAt": "2025-12-27T10:30:00.000Z"
  },
  {
    "status": "approved",
    "previousStatus": "under_review",
    "changedBy": "admin@embassy.org",
    "changedAt": "2025-12-28T14:15:00.000Z"
  }
]
```

## Security

- All endpoints require JWT authentication
- Status updates and tracking require admin privileges
- Users can only view their own applications
- Input validation on all fields
- Rate limiting on all endpoints

## Troubleshooting

### Emails not sending

1. Check `SENDGRID_API_KEY` is set in `.env`
2. Verify SendGrid account is active
3. Check server logs for email errors
4. Status updates will still work without email

### Migration fails

1. Ensure MySQL is running
2. Check database credentials in `.env`
3. Backup database before running migration
4. Migration is idempotent - safe to run multiple times

### Status dropdown not updating

1. Check browser console for errors
2. Verify admin JWT token is valid
3. Check network tab for API response
4. Ensure CORS is configured correctly

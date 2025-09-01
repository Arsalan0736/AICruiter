# Settings System Documentation

## Overview
The settings system has been integrated into your AI Interview Scheduler application to provide comprehensive user account management and customization options.

## Features

### 1. Profile Management
- **Profile Picture**: Upload and manage profile pictures
- **Personal Information**: Edit name, email (read-only), timezone, language
- **Real-time Updates**: Changes are immediately reflected across the application

### 2. Notification Preferences
- **Email Notifications**: Toggle email notification settings
- **Push Notifications**: Control browser push notifications
- **SMS Notifications**: Manage SMS notification preferences
- **Instant Updates**: Settings are saved immediately

### 3. Privacy & Security
- **Profile Visibility**: Control who can see your profile (Public/Private/Friends Only)
- **Email Display**: Choose whether to show email address to others
- **Contact Permissions**: Allow or block contact requests from other users

### 4. Appearance & Preferences
- **Theme Selection**: Light, Dark, or Auto theme options
- **Font Size**: Adjust text size for better readability
- **Layout Options**: Compact mode for space optimization
- **Interview Defaults**: Set default interview duration and type preferences

### 5. Tabbed Interface
- **Organized Sections**: Clean, intuitive tab navigation
- **Responsive Design**: Works seamlessly on all device sizes
- **Consistent Styling**: Matches your application's theme

## File Structure

```
app/
├── (main)/
│   ├── settings/
│   │   ├── page.jsx          # Main settings page
│   │   └── layout.js         # Settings layout
│   └── _components/
│       └── UserProfile.jsx   # User profile in sidebar
├── api/
│   └── settings/
│       └── route.js          # Settings API endpoints
└── provider.jsx              # Updated with SettingsProvider

context/
└── SettingsContext.jsx       # Settings state management

services/
└── Constants.jsx             # Already has settings in sidebar
```

## How It Works

### 1. Settings Flow
1. User navigates to Settings from sidebar
2. Settings are loaded from Supabase database
3. User makes changes in various tabs
4. Changes are saved to database and local state
5. Updates are reflected across the application

### 2. Data Management
- **Real-time Sync**: Settings are synchronized between database and UI
- **Context Management**: Centralized state management using React Context
- **Error Handling**: Comprehensive error handling for all operations

### 3. User Experience
- **Tab Navigation**: Easy switching between different setting categories
- **Instant Feedback**: Toast notifications for successful/failed operations
- **Loading States**: Visual feedback during save operations

## Database Schema

The system extends your existing `Users` table with new columns:
```sql
Users table:
- email (primary key)
- name
- picture
- credits
- timezone (new)
- language (new)
- notifications (JSON, new)
- privacy (JSON, new)
```

## Usage

### For Users
1. Navigate to **Settings** in the sidebar
2. Choose the appropriate tab for your needs
3. Make changes to your preferences
4. Click "Save Changes" to apply updates
5. Settings are immediately active across the application

### For Developers
1. **Access settings**: `const { settings } = useSettings()`
2. **Update settings**: `const result = await updateSettings(newSettings)`
3. **Update notifications**: `const result = await updateNotificationSetting(type, enabled)`
4. **Update privacy**: `const result = await updatePrivacySetting(type, value)`

## API Endpoints

### GET `/api/settings?email=user@example.com`
Retrieves user settings from the database.

### PUT `/api/settings`
Updates user settings in the database.

## Integration Points

### 1. Sidebar Integration
- **Settings Link**: Already exists in your sidebar navigation
- **User Profile**: Shows user info with quick settings access
- **Credit Display**: Integrated with billing system

### 2. User Context
- **Profile Updates**: Settings changes update user context
- **Real-time Sync**: Changes reflect immediately across components
- **Persistent Storage**: All settings are saved to database

### 3. Theme Consistency
- **Primary Colors**: Uses your existing color scheme
- **Component Styling**: Matches your UI components
- **Responsive Design**: Follows your layout patterns

## Future Enhancements

### Advanced Settings
- **Two-Factor Authentication**: Enhanced security options
- **API Key Management**: For developers and integrations
- **Data Export**: GDPR compliance features
- **Account Deletion**: User account management

### Customization Options
- **Custom Themes**: User-defined color schemes
- **Layout Presets**: Multiple layout options
- **Shortcut Keys**: Keyboard navigation support
- **Widget Customization**: Dashboard layout preferences

## Error Handling

The system includes comprehensive error handling:
- **Database Errors**: Connection and query failures
- **Validation Errors**: Input validation and sanitization
- **Network Errors**: API call failures
- **User Feedback**: Clear error messages and success notifications

## Styling

The settings system follows your existing theme:
- **Primary Colors**: Blue theme (`bg-primary`, `text-primary`)
- **Consistent Spacing**: Same padding and margins
- **Component Styling**: Matches existing UI components
- **Responsive Design**: Works on all screen sizes
- **Tab Navigation**: Clean, modern tab interface

## Testing

To test the settings system:
1. Navigate to the settings page
2. Test each tab functionality
3. Make changes and save them
4. Verify changes persist after page refresh
5. Check that settings are applied across the application

## Security

- **User Authentication**: Settings are tied to authenticated user accounts
- **Data Validation**: All inputs are validated and sanitized
- **Database Security**: Uses Supabase RLS (Row Level Security)
- **API Protection**: Endpoints validate user authentication

## Performance

- **Optimized Queries**: Efficient database operations
- **Context Optimization**: Minimal re-renders with React Context
- **Lazy Loading**: Settings are loaded only when needed
- **Caching**: Settings are cached in local state

## Support

For any issues or questions about the settings system, check:
1. Browser console for JavaScript errors
2. Network tab for API call failures
3. Supabase logs for database errors
4. User authentication status
5. Settings context state

## Migration Notes

If you're upgrading from a previous version:
1. The system automatically creates new columns in your Users table
2. Default values are provided for all new settings
3. Existing user data is preserved
4. No breaking changes to existing functionality

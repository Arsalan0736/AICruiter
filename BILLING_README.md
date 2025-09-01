# Billing System Documentation

## Overview
The billing system has been integrated into your AI Interview Scheduler application to manage interview credits and provide a seamless user experience.

## Features

### 1. Credit Management
- **Real-time credit tracking** from Supabase database
- **Automatic credit deduction** when creating interviews
- **Credit balance display** in the sidebar
- **Credit validation** before interview creation

### 2. Billing Page (`/billing`)
- **Current credits display** with real-time updates
- **Quick credit addition** (5 or 10 credits)
- **Pricing plans** with different tiers
- **Credit usage information**

### 3. Integration Points
- **Sidebar navigation** - Billing option already exists
- **Create Interview flow** - Credit validation and deduction
- **User authentication** - Credits tied to user accounts

## File Structure

```
app/
├── (main)/
│   ├── billing/
│   │   ├── page.jsx          # Main billing page
│   │   └── layout.js         # Billing layout
│   └── _components/
│       └── CreditDisplay.jsx # Credit display in sidebar
├── api/
│   └── billing/
│       └── route.js          # Billing API endpoints
└── provider.jsx              # Updated with BillingProvider

context/
└── BillingContext.jsx        # Billing state management

services/
└── Constants.jsx             # Already has billing in sidebar
```

## How It Works

### 1. Credit Flow
1. User creates an interview
2. System checks if user has enough credits (≥1)
3. If yes: Interview is created and 1 credit is deducted
4. If no: User is prompted to add credits

### 2. Credit Addition
- Users can add credits through the billing page
- Credits are immediately updated in the database
- Real-time updates across the application

### 3. Database Schema
The system uses the existing `Users` table with a `credits` column:
```sql
Users table:
- email (primary key)
- name
- picture
- credits (integer, default: 0)
```

## Usage

### For Users
1. Navigate to **Billing** in the sidebar
2. View current credit balance
3. Add credits using quick buttons or plan selection
4. Create interviews (credits are automatically deducted)

### For Developers
1. **Check credits**: `const { hasEnoughCredits } = useBilling()`
2. **Deduct credits**: `const result = await deductCredits(amount)`
3. **Add credits**: `const result = await addCredits(amount)`
4. **Get credit balance**: `const { credits } = useBilling()`

## Future Enhancements

### Payment Integration
The API route (`/api/billing/route.js`) is prepared for payment processor integration:
- Stripe integration
- PayPal integration
- Credit card processing
- Subscription management

### Advanced Features
- Credit usage analytics
- Invoice generation
- Team billing
- Credit expiration dates

## Error Handling

The system includes comprehensive error handling:
- Database connection errors
- Insufficient credit validation
- Credit deduction failures
- User authentication errors

## Styling

The billing system follows your existing theme:
- **Primary colors**: Blue theme (`bg-primary`, `text-primary`)
- **Consistent spacing**: Same padding and margins
- **Component styling**: Matches existing UI components
- **Responsive design**: Works on all screen sizes

## Testing

To test the billing system:
1. Create a new user account
2. Navigate to the billing page
3. Add some credits
4. Try creating an interview
5. Verify credits are deducted
6. Check credit balance updates

## Security

- Credits are tied to authenticated user accounts
- Credit operations require valid user session
- Database operations use Supabase RLS (Row Level Security)
- API endpoints validate user authentication

## Support

For any issues or questions about the billing system, check:
1. Browser console for JavaScript errors
2. Network tab for API call failures
3. Supabase logs for database errors
4. User authentication status

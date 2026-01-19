# EmailJS Setup Guide for Contact Form

This guide will help you set up EmailJS to enable email sending from the ContactUs form.

## Step 1: Create EmailJS Account

1. Go to [https://www.emailjs.com](https://www.emailjs.com)
2. Click **"Sign Up"** (free account available)
3. Verify your email address
4. Log in to your EmailJS dashboard

## Step 2: Add Email Service

1. In EmailJS dashboard, go to **"Email Services"**
2. Click **"Add New Service"**
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the setup instructions to connect your email account
5. **Copy your Service ID** (you'll need this later)

## Step 3: Create Email Template

1. Go to **"Email Templates"** in the dashboard
2. Click **"Create New Template"**
3. Use this template structure:

**Subject:**
```
New Support Request from {{from_name}}
```

**Content:**
```
You have received a new support request from RehabServE Contact Form.

Name: {{from_name}}
Organization: {{organization}}
Email: {{from_email}}

Message:
{{message}}

---
Reply to: {{reply_to}}
```

4. **Copy your Template ID** (you'll need this later)

## Step 4: Get Your Public Key

1. Go to **"Account"** → **"General"** in EmailJS dashboard
2. Find your **"Public Key"** (also called API Key)
3. **Copy your Public Key**

## Step 5: Configure Environment Variables

1. Create a `.env` file in the root of your project (same level as `package.json`)
2. Add the following variables:

```env
VITE_EMAILJS_SERVICE_ID=your_service_id_here
VITE_EMAILJS_TEMPLATE_ID=your_template_id_here
VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
```

3. Replace the placeholder values with your actual EmailJS credentials

## Step 6: Email Template Variables

The contact form sends the following variables to your EmailJS template:

```typescript
const templateParams = {
  from_name: formData.name,           // User's full name
  from_email: formData.email,         // User's email address
  organization: formData.organization, // User's organization/rehabilitation centre
  message: formData.message,         // User's message/inquiry
  to_email: 'support@rehabserve.utm.my', // Recipient email (configured in EmailJS service)
  reply_to: formData.email,          // Reply-to address (user's email)
};
```

**Important:** Make sure your EmailJS template uses these exact variable names:
- `{{from_name}}` - User's name
- `{{from_email}}` - User's email
- `{{organization}}` - Organization/rehabilitation centre
- `{{message}}` - User's message
- `{{reply_to}}` - Reply-to email (same as from_email)

The `to_email` is configured in your EmailJS service settings, not in the template variables.

## Step 7: Test the Form

1. Start your development server: `npm run dev`
2. Navigate to the Contact Support page
3. Fill out and submit the form
4. Check your email inbox for the test message

## Troubleshooting

- **"Email sending failed" error**: 
  - Verify your environment variables are set correctly
  - Check that your Service ID, Template ID, and Public Key are correct
  - Make sure your email service is properly connected in EmailJS

- **Emails not received**:
  - Check your spam/junk folder
  - Verify your email service connection in EmailJS dashboard
  - Check EmailJS dashboard for error logs

- **Environment variables not working**:
  - Make sure your `.env` file is in the root directory
  - Restart your development server after creating/updating `.env`
  - Variable names must start with `VITE_` for Vite to expose them

## Free Tier Limits

EmailJS free tier includes:
- 200 emails per month
- Basic email templates
- Standard support

For production use with higher volume, consider upgrading to a paid plan.

## Security Note

The Public Key is safe to expose in client-side code. However, for production, consider:
- Using rate limiting
- Adding CAPTCHA to prevent spam
- Implementing server-side validation

# Supabase Database Setup

This document explains how to set up the Supabase database for the Student Hostel Finder application.

## Prerequisites

1. A Supabase account and project
2. Your Supabase project URL and anon key configured in `.env.local`

## Database Schema Setup

### Option 1: Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `supabase-schema.sql`
4. Run the SQL script

### Option 2: Using Supabase CLI (Recommended for development)

1. Install Supabase CLI: `npm install -g supabase`
2. Login: `supabase login`
3. Link your project: `supabase link --project-ref your-project-ref`
4. Push the schema: `supabase db push`

## Database Tables

### Core Tables

- **profiles**: User profiles (extends auth.users)
- **hostels**: Hostel listings
- **rooms**: Individual rooms within hostels
- **reviews**: Student reviews for hostels
- **inquiries**: Student inquiries about hostels

### Key Features

- **Row Level Security (RLS)**: All tables have RLS enabled with appropriate policies
- **Automatic rating calculation**: Hostel ratings are automatically calculated from reviews
- **Timestamps**: All tables have created_at and updated_at fields with auto-update triggers
- **Relationships**: Proper foreign key relationships between tables
- **Indexes**: Optimized indexes for common queries

## Authentication Setup

The database is configured to work with Supabase Auth. When users sign up:

1. A record is automatically created in the `profiles` table
2. Users can have roles: 'student' or 'landlord'
3. Authentication is required for most operations

## Usage Examples

### Fetching hostels with rooms and reviews

```sql
SELECT
  h.*,
  json_agg(r.*) as rooms,
  json_agg(rv.*) as reviews
FROM hostels h
LEFT JOIN rooms r ON h.id = r.hostel_id
LEFT JOIN reviews rv ON h.id = rv.hostel_id
GROUP BY h.id;
```

### Getting landlord's hostels

```sql
SELECT * FROM hostels WHERE landlord_id = auth.uid();
```

## Security Policies

- **Students** can view all hostels and create reviews/inquiries
- **Landlords** can manage their own hostels and rooms, view inquiries for their properties
- **Users** can only update their own profiles and reviews

## Environment Variables

Make sure your `.env.local` file contains:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Next Steps

1. Set up authentication in your React app
2. Create components to interact with the database
3. Implement real-time subscriptions for live updates
4. Add file storage for hostel photos

## Migration Notes

If you need to modify the schema later:

1. Update the SQL file
2. Create migration files using Supabase CLI
3. Update the TypeScript types accordingly
4. Test thoroughly before deploying to production
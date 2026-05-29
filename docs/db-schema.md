# Database Schema

## Overview

The application uses three main tables:

- `leads`
- `lead_status_history`
- `users`

This design keeps the current lead state in the `leads` table while preserving every meaningful status change in `lead_status_history`.

## `leads`

- `id` - primary key
- `name` - required string
- `mobile_number` - required unique string
- `email` - required unique string
- `source` - required string
- `status` - required enum
- `created_at` - audit timestamp
- `updated_at` - audit timestamp

Purpose:

- stores the current business state of each lead
- supports listing, search, filtering, and pagination

## `lead_status_history`

- `id` - primary key
- `lead_id` - foreign key to `leads.id`
- `old_status` - enum, nullable for the first recorded status
- `new_status` - enum
- `changed_at` - audit timestamp

Purpose:

- records the initial status when a lead is created
- records all later status changes for auditability

Relationship:

- one lead can have many status history entries

## `users`

- `id` - primary key
- `username` - unique string
- `password_hash` - hashed password
- `is_active` - boolean
- `created_at` - audit timestamp
- `updated_at` - audit timestamp

Purpose:

- stores application users for JWT-based login
- supports protected lead APIs and protected frontend routes

## Status Enum Values

- `New`
- `In Progress`
- `Follow-up`
- `Converted`
- `Closed`

## Constraint Notes

- `mobile_number` is unique
- `email` is unique
- `lead_status_history.lead_id` references `leads.id`
- deleting a lead also deletes its status history records

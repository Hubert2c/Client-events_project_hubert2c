CivicEvents – Accessible City Events & Services Portal

Overview:
Frontend app for city events, announcements (audio), promos (video + captions), notifications, and event registrations. Supports admin and normal user roles.

Features:

Auth: Sign up/login with token storage and password strength checks

Events: List, search, register, feedback; admin can create/edit/delete

Announcements: Audio playback, transcript; admin can create/edit/delete

Promos: Video with captions; admin can create/edit/delete

Notifications: Bell icon, inbox; admin can create/delete

Dashboard (admin): Stats, activity feed, user management

Profile: Update full name/email

UI/UX:

Tailwind CSS, responsive, accessible

Skeleton loaders, toasts, modals, lazy loading for media

Role-based UI guards

Setup:

Clone repo and open index.html

Set baseUrl in ui.js to backend API

Uses jQuery and Tailwind via CDN

Notes:

Backend enforces security; frontend handles UX

File uploads via multipart/form-data

Notifications show unread counts; feedback limited to one per user/event

Demo: 5–7 minutes covering admin and user actions

Code: Modular JS files, semantic HTML, Tailwind styling, reusable UI helpers

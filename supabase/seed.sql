-- Replace the placeholder user id below with your real authenticated Supabase user id
-- before running this seed in a real project.

insert into public.social_posts (
  user_id,
  date,
  account_type,
  platform,
  status,
  category,
  campaign,
  city,
  media_references,
  cross_posted_to,
  tags,
  caption,
  notes
)
values
(
  'YOUR_USER_ID_HERE',
  '2026-05-29',
  'business',
  'Instagram',
  'drafted',
  'client-work',
  'M&M Cleaning Launch',
  'Renton',
  array['m-and-m-hero-reel.mov', 'pink-blue-brand-board.png'],
  array['Facebook', 'Google Business Profile'],
  array['cleaning', 'renton', 'launch'],
  'A cleaner home really does make the whole week feel lighter. We built M&M Cleaning Service to be easy to reach, careful in the details, and dependable from the first visit on.',
  'Use with hero reel and logo reveal. Keep CTA focused on quote requests.'
);

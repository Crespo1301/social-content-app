# SECURITY-CHECKLIST.md

Baseline checklist for this repo:

- [ ] Supabase keys live in env, never hardcoded
- [ ] Protected routes redirect correctly when auth is enabled
- [ ] `social_posts` table uses RLS on `user_id = auth.uid()`
- [ ] API routes verify authenticated user before write actions
- [ ] Demo mode is clearly separated from production mode
- [ ] No user-sensitive content is committed into repo seeds
- [ ] Input fields are treated as untrusted data
- [ ] Deployed app uses HTTPS through Vercel

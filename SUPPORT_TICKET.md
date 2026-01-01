# Support Ticket - Supabase Project Stuck in COMING_UP State

**Date**: 2026-01-01
**Project ID**: vvmahjuwrswdnaugsmcz
**Project URL**: https://vvmahjuwrswdnaugsmcz.supabase.co

## Problem

My project has been stuck in "COMING_UP" state for **24 hours** after attempting to restore it from paused state.

## Timeline

1. **2026-01-01 ~11:30 UTC**: Attempted to restore project via API POST `/v1/projects/{ref}/restore`
2. **API Response**: `"This project is COMING_UP, it may take a while to fully restore"`
3. **Current Status (12:19 UTC)**: Still in COMING_UP state after 24 hours

## Expected Behavior

Project should be fully restored and active within 2-5 minutes.

## Actual Behavior

Project remains in COMING_UP state for 24+ hours, preventing access to database.

## Impact

- Cannot access database
- Application down
- CORS errors on all API calls (ERR_FAILED 521)

## Request

Please investigate why the project restoration is stuck and manually restore/activate the project.

## Project Details

- **Project Ref**: vvmahjuwrswdnaugsmcz
- **Region**: Unknown (need to check)
- **Plan**: Free tier
- **Last Active**: ~7+ days ago (auto-paused)

---

**Submit this ticket here**: https://app.supabase.com/support/new

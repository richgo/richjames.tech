# TASK-003: LinkedIn Posts to Blog Integration

## Summary
Scrape LinkedIn posts from Rich's profile and publish them as blog posts on richjames.tech, with links back to the original LinkedIn posts.

## LinkedIn Profile
- **URL:** https://www.linkedin.com/in/richgojames/
- **Name:** Rich James

---

## Technical Approaches

### Option A: Browser Automation (Recommended for personal use)
Use Playwright/Puppeteer to scrape posts while authenticated.

**Pros:**
- Full access to all posts
- Can get rich content (images, links, reactions)
- Works without API approval

**Cons:**
- Against LinkedIn ToS (use at own risk)
- Requires login session management
- May break if LinkedIn changes UI

### Option B: LinkedIn API
Official API with OAuth authentication.

**Pros:**
- ToS compliant
- Stable endpoints

**Cons:**
- Requires LinkedIn Developer App approval
- Limited to posts via Marketing API (needs company page or ad account)
- Personal posts not easily accessible via API

### Option C: Manual Export + Parser
Export LinkedIn data via Settings → Get a copy of your data.

**Pros:**
- ToS compliant
- No scraping needed

**Cons:**
- Manual process (not automated)
- Limited data in export
- Need to re-export periodically

### Option D: Third-party Service (Phantombuster, etc.)
Use a service designed for LinkedIn data extraction.

**Pros:**
- Handles complexity
- More reliable

**Cons:**
- Paid service
- Still against ToS

---

## Recommended Implementation: Option A (Browser Automation)

### Architecture

```
┌─────────────────────────────────────────────────────┐
│                  LinkedIn Scraper                    │
├─────────────────────────────────────────────────────┤
│  1. Authenticate via stored session/cookies         │
│  2. Navigate to profile activity/posts              │
│  3. Scroll and collect post data                    │
│  4. Extract: text, date, images, engagement, URL    │
│  5. Generate markdown files                         │
└─────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────┐
│              content/blog/linkedin/                  │
├─────────────────────────────────────────────────────┤
│  YYYY-MM-DD-linkedin-post-{id}.md                   │
│  - frontmatter: title, date, tags, linkedinUrl      │
│  - content: post text + images                      │
│  - "Originally posted on LinkedIn" link             │
└─────────────────────────────────────────────────────┘
```

### Script: `scripts/linkedin-scraper.py`

```python
#!/usr/bin/env python3
"""
LinkedIn Post Scraper for richjames.tech
Scrapes posts and generates blog markdown files.
"""

import asyncio
import json
import os
import re
from datetime import datetime
from pathlib import Path

from playwright.async_api import async_playwright

PROFILE_URL = "https://www.linkedin.com/in/richgojames/"
POSTS_URL = "https://www.linkedin.com/in/richgojames/recent-activity/all/"
OUTPUT_DIR = Path("content/blog/linkedin")
COOKIES_FILE = Path(".linkedin-cookies.json")


async def login_and_save_cookies(page):
    """Manual login flow - saves cookies for future use."""
    await page.goto("https://www.linkedin.com/login")
    print("Please log in manually...")
    await page.wait_for_url("**/feed/**", timeout=120000)
    cookies = await page.context.cookies()
    COOKIES_FILE.write_text(json.dumps(cookies))
    print(f"Cookies saved to {COOKIES_FILE}")


async def load_cookies(context):
    """Load previously saved cookies."""
    if COOKIES_FILE.exists():
        cookies = json.loads(COOKIES_FILE.read_text())
        await context.add_cookies(cookies)
        return True
    return False


async def scrape_posts(page, max_posts=20):
    """Scrape posts from the activity page."""
    posts = []
    
    await page.goto(POSTS_URL)
    await page.wait_for_load_state("networkidle")
    
    # Scroll to load more posts
    for _ in range(5):
        await page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
        await asyncio.sleep(2)
    
    # Extract post elements
    post_elements = await page.query_selector_all('[data-urn*="activity"]')
    
    for el in post_elements[:max_posts]:
        try:
            post = {
                "id": await el.get_attribute("data-urn"),
                "text": await el.inner_text(),
                "date": datetime.now().isoformat(),  # Parse from UI
                "url": f"https://www.linkedin.com/feed/update/{await el.get_attribute('data-urn')}",
            }
            posts.append(post)
        except Exception as e:
            print(f"Error extracting post: {e}")
    
    return posts


def generate_markdown(post):
    """Generate blog markdown from a LinkedIn post."""
    post_id = post["id"].split(":")[-1]
    date = datetime.fromisoformat(post["date"])
    slug = f"{date.strftime('%Y-%m-%d')}-linkedin-{post_id}"
    
    # Clean and truncate text for title
    text = post["text"].strip()
    title = text[:60].replace("\n", " ") + "..." if len(text) > 60 else text
    
    content = f"""---
title: "{title}"
date: {date.strftime('%Y-%m-%d')}
tags: ["LinkedIn"]
linkedinUrl: "{post['url']}"
source: linkedin
---

{text}

---

*Originally posted on [LinkedIn]({post['url']})*
"""
    return slug, content


async def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        context = await browser.new_context()
        page = await context.new_page()
        
        # Load or create session
        if not await load_cookies(context):
            await login_and_save_cookies(page)
        
        # Verify login
        await page.goto(PROFILE_URL)
        if "login" in page.url:
            await login_and_save_cookies(page)
        
        # Scrape posts
        posts = await scrape_posts(page)
        print(f"Found {len(posts)} posts")
        
        # Generate markdown files
        for post in posts:
            slug, content = generate_markdown(post)
            filepath = OUTPUT_DIR / f"{slug}.md"
            if not filepath.exists():
                filepath.write_text(content)
                print(f"Created: {filepath}")
            else:
                print(f"Skipped (exists): {filepath}")
        
        await browser.close()


if __name__ == "__main__":
    asyncio.run(main())
```

### Blog Post Template

Each scraped post becomes:

```markdown
---
title: "Great insights from KubeCon this week..."
date: 2026-02-01
tags: ["LinkedIn", "Kubernetes", "Conference"]
linkedinUrl: "https://www.linkedin.com/feed/update/urn:li:activity:123456789"
source: linkedin
---

Great insights from KubeCon this week! The keynote on AI-native infrastructure
really resonated with how we're building systems at scale...

[Full post content here]

---

*Originally posted on [LinkedIn](https://www.linkedin.com/feed/update/urn:li:activity:123456789)*
```

### UI Updates

#### Blog Listing (`src/app/blog/BlogListClient.tsx`)
- Add LinkedIn icon badge for posts with `source: linkedin`
- Link icon goes to LinkedIn when clicked

#### Blog Post (`src/app/blog/[slug]/BlogPostClient.tsx`)
- Show "Originally posted on LinkedIn" banner at top
- Add LinkedIn share/view button

---

## Implementation Phases

### Phase 1: Scraper Script
- [ ] Create `scripts/linkedin-scraper.py`
- [ ] Set up Playwright with cookie persistence
- [ ] Handle login flow
- [ ] Extract post data (text, date, URL)
- [ ] Generate markdown files in `content/blog/linkedin/`

### Phase 2: Markdown Updates
- [ ] Update `src/lib/markdown.ts` to handle `linkedinUrl` frontmatter
- [ ] Add `source` field to BlogPost type
- [ ] Test with sample LinkedIn post

### Phase 3: UI Updates
- [ ] Add LinkedIn badge to blog cards
- [ ] Add "View on LinkedIn" button to post pages
- [ ] Style the "Originally posted" footer

### Phase 4: Automation (Optional)
- [ ] Create cron job to run scraper weekly
- [ ] Handle duplicate detection
- [ ] Notify on new posts imported

---

## Dependencies

```bash
# Python dependencies for scraper
pip install playwright
playwright install chromium
```

---

## Files to Create/Modify

### New Files
- `scripts/linkedin-scraper.py` - Main scraper script
- `content/blog/linkedin/` - Directory for LinkedIn posts
- `.linkedin-cookies.json` - Session persistence (gitignored)

### Modified Files
- `src/lib/markdown.ts` - Add linkedinUrl and source fields
- `src/app/blog/BlogListClient.tsx` - LinkedIn badge
- `src/app/blog/[slug]/BlogPostClient.tsx` - LinkedIn link
- `.gitignore` - Add cookie file

---

## Security Notes

1. **Cookie file**: Add `.linkedin-cookies.json` to `.gitignore`
2. **ToS**: This scraping approach is against LinkedIn ToS - personal risk
3. **Rate limiting**: Add delays between requests
4. **Session expiry**: Cookies may expire, need re-login flow

---

## Acceptance Criteria

- [ ] Scraper successfully extracts posts from LinkedIn profile
- [ ] Markdown files generated with correct frontmatter
- [ ] Blog displays LinkedIn posts with source attribution
- [ ] "View on LinkedIn" links work correctly
- [ ] No duplicate posts created on re-run
- [ ] Build passes with LinkedIn content

---

## Questions for Review

1. **Automation**: Run manually or schedule weekly?
2. **Content filtering**: Import all posts or filter by length/engagement?
3. **Images**: Download and host locally or link to LinkedIn CDN?
4. **Tags**: Auto-generate from content or manual curation?

---

*Ready for implementation. Run scraper manually first, then automate if desired.*

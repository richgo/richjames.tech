#!/usr/bin/env python3
"""
LinkedIn Post Scraper for richjames.tech
Scrapes posts and generates blog markdown files.

Usage:
    cd richjames.tech
    source .venv/bin/activate
    python scripts/linkedin-scraper.py [--login] [--max-posts N]
"""

import asyncio
import json
import os
import re
import hashlib
import argparse
from datetime import datetime
from pathlib import Path
from urllib.parse import urlparse

from playwright.async_api import async_playwright

# Configuration
PROFILE_URL = "https://www.linkedin.com/in/richgojames/"
POSTS_URL = "https://www.linkedin.com/in/richgojames/recent-activity/all/"
OUTPUT_DIR = Path("content/blog")
IMAGES_DIR = Path("public/img/linkedin")
COOKIES_FILE = Path(".linkedin-cookies.json")
MIN_PARAGRAPH_LENGTH = 100  # Minimum characters for a "paragraph"


async def login_and_save_cookies(page):
    """Manual login flow - saves cookies for future use."""
    print("\n🔐 LinkedIn Login Required")
    print("=" * 50)
    await page.goto("https://www.linkedin.com/login")
    print("Please log in manually in the browser window...")
    print("Waiting for successful login (timeout: 2 minutes)...")
    
    try:
        await page.wait_for_url("**/feed/**", timeout=120000)
        cookies = await page.context.cookies()
        COOKIES_FILE.write_text(json.dumps(cookies, indent=2))
        print(f"✅ Login successful! Cookies saved to {COOKIES_FILE}")
        return True
    except Exception as e:
        print(f"❌ Login failed or timed out: {e}")
        return False


async def load_cookies(context):
    """Load previously saved cookies."""
    if COOKIES_FILE.exists():
        try:
            cookies = json.loads(COOKIES_FILE.read_text())
            await context.add_cookies(cookies)
            print(f"✅ Loaded cookies from {COOKIES_FILE}")
            return True
        except Exception as e:
            print(f"⚠️ Failed to load cookies: {e}")
    return False


async def download_image(page, url, post_id):
    """Download image and save locally."""
    if not url or not url.startswith("http"):
        return None
    
    IMAGES_DIR.mkdir(parents=True, exist_ok=True)
    
    # Generate filename from URL hash
    url_hash = hashlib.md5(url.encode()).hexdigest()[:8]
    ext = Path(urlparse(url).path).suffix or ".jpg"
    filename = f"{post_id}-{url_hash}{ext}"
    filepath = IMAGES_DIR / filename
    
    if filepath.exists():
        print(f"  📷 Image exists: {filename}")
        return f"/img/linkedin/{filename}"
    
    try:
        response = await page.request.get(url)
        if response.ok:
            filepath.write_bytes(await response.body())
            print(f"  📷 Downloaded: {filename}")
            return f"/img/linkedin/{filename}"
    except Exception as e:
        print(f"  ⚠️ Failed to download image: {e}")
    
    return None


async def scrape_posts(page, max_posts=20):
    """Scrape posts from the activity page."""
    posts = []
    
    print(f"\n📡 Navigating to activity page...")
    await page.goto(POSTS_URL, timeout=60000)
    await asyncio.sleep(5)  # Give LinkedIn time to load
    
    # Scroll to load more posts
    print("📜 Scrolling to load posts...")
    for i in range(8):
        await page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
        await asyncio.sleep(1.5)
        print(f"  Scroll {i+1}/8...")
    
    # Find all post containers
    print("\n🔍 Extracting posts...")
    
    # LinkedIn's structure varies - try multiple selectors
    post_containers = await page.query_selector_all('[data-urn*="activity"]')
    
    if not post_containers:
        # Fallback selector
        post_containers = await page.query_selector_all('.feed-shared-update-v2')
    
    print(f"  Found {len(post_containers)} potential posts")
    
    for idx, container in enumerate(post_containers[:max_posts * 2]):  # Get extra, filter later
        try:
            # Get post URN/ID
            urn = await container.get_attribute("data-urn")
            if not urn:
                data_id = await container.get_attribute("data-id")
                urn = data_id if data_id else f"post-{idx}"
            
            post_id = urn.split(":")[-1] if ":" in urn else urn
            
            # Extract text content
            text_el = await container.query_selector('.feed-shared-update-v2__description, .break-words')
            text = ""
            if text_el:
                text = await text_el.inner_text()
                text = text.strip()
            
            # Skip if too short
            if len(text) < MIN_PARAGRAPH_LENGTH:
                print(f"  ⏭️ Skipping short post ({len(text)} chars): {text[:50]}...")
                continue
            
            # Extract images
            images = []
            img_elements = await container.query_selector_all('img[src*="media"]')
            for img in img_elements:
                src = await img.get_attribute("src")
                if src and "media" in src and "emoji" not in src.lower():
                    local_path = await download_image(page, src, post_id)
                    if local_path:
                        images.append(local_path)
            
            # Extract date (approximate from relative time)
            date_el = await container.query_selector('.feed-shared-actor__sub-description, time')
            date_text = ""
            if date_el:
                date_text = await date_el.inner_text()
            
            # Parse relative date
            post_date = parse_relative_date(date_text)
            
            # Build LinkedIn URL
            linkedin_url = f"https://www.linkedin.com/feed/update/urn:li:activity:{post_id}/"
            
            post = {
                "id": post_id,
                "text": text,
                "date": post_date.isoformat(),
                "date_text": date_text,
                "url": linkedin_url,
                "images": images,
            }
            
            posts.append(post)
            print(f"  ✅ Extracted: {text[:60]}...")
            
            if len(posts) >= max_posts:
                break
                
        except Exception as e:
            print(f"  ❌ Error extracting post: {e}")
            continue
    
    return posts


def parse_relative_date(date_text):
    """Parse LinkedIn's relative date format."""
    now = datetime.now()
    text = date_text.lower().strip()
    
    try:
        if "just now" in text or "now" in text:
            return now
        elif "minute" in text:
            mins = int(re.search(r"(\d+)", text).group(1))
            return now.replace(minute=now.minute - mins)
        elif "hour" in text:
            hours = int(re.search(r"(\d+)", text).group(1))
            return now.replace(hour=now.hour - hours)
        elif "day" in text:
            days = int(re.search(r"(\d+)", text).group(1))
            return now.replace(day=now.day - days)
        elif "week" in text:
            weeks = int(re.search(r"(\d+)", text).group(1))
            return now.replace(day=now.day - (weeks * 7))
        elif "month" in text:
            months = int(re.search(r"(\d+)", text).group(1))
            return now.replace(month=now.month - months)
        elif "year" in text:
            years = int(re.search(r"(\d+)", text).group(1))
            return now.replace(year=now.year - years)
    except:
        pass
    
    return now


def generate_title(text):
    """Generate a title from post text."""
    # Take first sentence or first 80 chars
    first_line = text.split('\n')[0].strip()
    first_sentence = re.split(r'[.!?]', first_line)[0].strip()
    
    if len(first_sentence) > 80:
        return first_sentence[:77] + "..."
    return first_sentence


def generate_markdown(post):
    """Generate blog markdown from a LinkedIn post."""
    post_id = post["id"]
    date = datetime.fromisoformat(post["date"])
    slug = f"{date.strftime('%Y-%m-%d')}-linkedin-{post_id}"
    
    # Generate title from first line/sentence
    title = generate_title(post["text"])
    title = title.replace('"', "'")  # Escape quotes for YAML
    
    # Build content
    content_lines = [
        "---",
        f'title: "{title}"',
        f"date: {date.strftime('%Y-%m-%dT%H:%M:%S')}",
        'tags: ["LinkedIn"]',
        f'linkedinUrl: "{post["url"]}"',
        "source: linkedin",
        "---",
        "",
        post["text"],
        "",
    ]
    
    # Add images if present
    if post["images"]:
        content_lines.append("")
        for img in post["images"]:
            content_lines.append(f"![LinkedIn Post Image]({img})")
        content_lines.append("")
    
    # Add LinkedIn attribution
    content_lines.extend([
        "",
        "---",
        "",
        f'*Originally posted on [LinkedIn]({post["url"]})*',
    ])
    
    return slug, "\n".join(content_lines)


async def main():
    parser = argparse.ArgumentParser(description="Scrape LinkedIn posts for blog")
    parser.add_argument("--login", action="store_true", help="Force new login")
    parser.add_argument("--max-posts", type=int, default=20, help="Maximum posts to scrape")
    parser.add_argument("--headless", action="store_true", help="Run in headless mode")
    args = parser.parse_args()
    
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    IMAGES_DIR.mkdir(parents=True, exist_ok=True)
    
    print("🚀 LinkedIn Post Scraper")
    print("=" * 50)
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=args.headless)
        context = await browser.new_context(
            viewport={"width": 1280, "height": 800},
            user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
        )
        page = await context.new_page()
        
        # Handle login
        if args.login or not COOKIES_FILE.exists():
            success = await login_and_save_cookies(page)
            if not success:
                await browser.close()
                return
        else:
            await load_cookies(context)
        
        # Verify login by checking profile page
        await page.goto(PROFILE_URL)
        await asyncio.sleep(2)
        
        if "login" in page.url or "authwall" in page.url:
            print("⚠️ Session expired, need to re-login...")
            success = await login_and_save_cookies(page)
            if not success:
                await browser.close()
                return
        
        print(f"✅ Logged in as: {PROFILE_URL}")
        
        # Scrape posts
        posts = await scrape_posts(page, max_posts=args.max_posts)
        print(f"\n📝 Scraped {len(posts)} qualifying posts")
        
        # Generate markdown files
        created = 0
        skipped = 0
        
        for post in posts:
            slug, content = generate_markdown(post)
            filepath = OUTPUT_DIR / f"{slug}.md"
            
            if not filepath.exists():
                filepath.write_text(content)
                print(f"  ✅ Created: {filepath.name}")
                created += 1
            else:
                print(f"  ⏭️ Exists: {filepath.name}")
                skipped += 1
        
        print(f"\n📊 Summary:")
        print(f"  Created: {created} new posts")
        print(f"  Skipped: {skipped} existing posts")
        print(f"  Total:   {len(posts)} posts processed")
        
        await browser.close()
    
    print("\n✨ Done!")


if __name__ == "__main__":
    asyncio.run(main())

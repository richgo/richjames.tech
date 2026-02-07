#!/usr/bin/env python3
"""
LinkedIn Job History Scraper for richjames.tech
"""

import asyncio
import json
import re
from pathlib import Path
from playwright.async_api import async_playwright

EXPERIENCE_URL = "https://www.linkedin.com/in/richgojames/details/experience/"
COOKIES_FILE = Path(".linkedin-cookies.json")
OUTPUT_FILE = Path("content/experience.json")


async def load_cookies(context):
    if COOKIES_FILE.exists():
        cookies = json.loads(COOKIES_FILE.read_text())
        await context.add_cookies(cookies)
        return True
    return False


async def main():
    print("🚀 LinkedIn Job History Scraper")
    print("=" * 50)
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        context = await browser.new_context(viewport={"width": 1280, "height": 1000})
        page = await context.new_page()
        
        if not await load_cookies(context):
            print("❌ No cookies found")
            await browser.close()
            return
        
        print("✅ Loaded cookies")
        print("📡 Navigating to experience page...")
        
        await page.goto(EXPERIENCE_URL, timeout=60000)
        await asyncio.sleep(5)
        
        # Scroll to load
        for i in range(8):
            await page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
            await asyncio.sleep(1)
        
        # Get the main content section
        main = await page.query_selector('main')
        if main:
            text = await main.inner_text()
            print("\n📄 Page content extracted. Parsing...")
            
            # Save raw text for debugging
            Path("content/experience-raw.txt").write_text(text)
            print("  Saved raw text to content/experience-raw.txt")
            
            # Try to parse structured content
            lines = text.split('\n')
            print(f"  {len(lines)} lines of text")
            
            # Print first 100 lines for analysis
            print("\n--- First 100 lines ---")
            for i, line in enumerate(lines[:100]):
                if line.strip():
                    print(f"{i}: {line.strip()[:80]}")
        else:
            print("❌ Could not find main content")
        
        await browser.close()
    
    print("\n✨ Done!")


if __name__ == "__main__":
    asyncio.run(main())

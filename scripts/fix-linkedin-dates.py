#!/usr/bin/env python3
"""
Fix LinkedIn post dates by estimating from content and ID order.
"""

import re
from datetime import datetime, timedelta
from pathlib import Path

CONTENT_DIR = Path("content/blog")

# Manual date estimates based on content analysis
# Format: activity_id -> (year, month, day)
KNOWN_DATES = {
    # Eduserv posts (oldest, ~2017-2018)
    "6153843411699929088": (2017, 6, 15),
    "6153844355015680000": (2017, 6, 15),
    
    # Serverless CQRS article (2018)
    "6367794936443736064": (2018, 2, 9),
    
    # Nationwide early posts (2019-2020)
    "6460453803496861696": (2019, 6, 20),
    "6486923865715929088": (2019, 9, 15),
    "6548099970615005184": (2020, 1, 20),
    "6556619839903936512": (2020, 2, 15),
    "6572923404976967680": (2020, 4, 10),
    
    # Nationwide website launch, hiring posts (2021)
    "6758661754030440448": (2021, 1, 25),
    "6760587064133083136": (2021, 1, 30),
    "6780748278595108864": (2021, 3, 15),
    "6783383055961726976": (2021, 3, 22),
    "6783692713674973184": (2021, 3, 23),
    "6796000182199734273": (2021, 5, 1),
    "6803934382752063488": (2021, 5, 25),
    "6823881884968222720": (2021, 7, 20),
    "6856574272232595457": (2021, 10, 15),
    
    # InfoQ, DevOps Summit, MS Ignite (2022)
    "6918176472364892160": (2022, 3, 15),
    "6925073972988407808": (2022, 4, 5),
    "6929523643181903872": (2022, 4, 15),
    "6929530225286377472": (2022, 4, 15),
    "6934752779974434817": (2022, 5, 1),
    "6969713576538206208": (2022, 8, 20),
    "6985286508911992832": (2022, 10, 1),
    "6986375220185939968": (2022, 10, 5),
    "6993899437878034432": (2022, 11, 10),
    
    # Lloyds reconnect (2024)
    "7212023532317257729": (2024, 3, 15),
    "7214560495431749633": (2024, 3, 25),
    
    # Lloyds Distinguished Engineer (2024)
    "7317854166079397891": (2024, 10, 15),
    
    # Recent achievement (2025)
    "7392165870862757888": (2025, 1, 20),
}

def fix_post_dates():
    print("🔧 Fixing LinkedIn Post Dates")
    print("=" * 50)
    
    # First, find all LinkedIn posts with wrong dates
    wrong_posts = list(CONTENT_DIR.glob("*-linkedin-*.md"))
    
    fixed = 0
    for filepath in sorted(wrong_posts):
        # Extract activity ID from filename
        match = re.search(r'linkedin-(\d+)\.md$', filepath.name)
        if not match:
            continue
        
        activity_id = match.group(1)
        
        if activity_id not in KNOWN_DATES:
            print(f"  ⚠️ Unknown ID: {activity_id}")
            continue
        
        year, month, day = KNOWN_DATES[activity_id]
        real_date = datetime(year, month, day)
        
        # Read content
        content = filepath.read_text()
        
        # Update date in frontmatter
        new_date_str = real_date.strftime('%Y-%m-%dT12:00:00')
        content = re.sub(r'^date: .+$', f'date: {new_date_str}', content, flags=re.MULTILINE)
        
        # Create new filename
        new_filename = f"{real_date.strftime('%Y-%m-%d')}-linkedin-{activity_id}.md"
        new_filepath = CONTENT_DIR / new_filename
        
        # Write and rename
        new_filepath.write_text(content)
        if filepath != new_filepath and filepath.exists():
            filepath.unlink()
        
        print(f"  ✅ {new_filename}")
        fixed += 1
    
    print(f"\n✅ Fixed {fixed} posts")

if __name__ == "__main__":
    fix_post_dates()

# Product requirements

## Epic EPIC-001 — Publish an accessible engineering portfolio

Outcome: Visitors can learn about Rich James and discover his work.

### Feature FEAT-001 — Landing page

Outcome: Visitors can discover the portfolio.

#### Story STORY-001 — Discover the portfolio

Architecture owner: `next-web`

As a visitor, I can discover the portfolio.

##### Acceptance AC-001 — Discover the portfolio

- Given the homepage loads
- When I inspect the hero and navigation
- Then the introduction and canonical article links are available
- Check: `site.home`

### Feature FEAT-002 — Markdown article archive

Outcome: Visitors can read dated articles.

#### Story STORY-002 — Read dated articles

Architecture owner: `next-web`

As a visitor, I can read dated articles.

##### Acceptance AC-002 — Read dated articles

- Given the checked-in Markdown is available
- When I open the archive and follow an article link
- Then the archive and article routes resolve
- Check: `site.blog`

### Feature FEAT-003 — Topic discovery

Outcome: Visitors can find posts by topic.

#### Story STORY-003 — Find posts by topic

Architecture owner: `next-web`

As a visitor, I can find posts by topic.

##### Acceptance AC-003 — Find posts by topic

- Given posts have tags
- When I open the tag index and follow a topic
- Then I see matching articles
- Check: `site.tags`

### Feature FEAT-004 — Profile and contact

Outcome: Visitors can find credentials and contact details.

#### Story STORY-004 — Find credentials and contact details

Architecture owner: `next-web`

As a visitor, I can find credentials and contact details.

##### Acceptance AC-004 — Find credentials and contact details

- Given the portfolio is available
- When I visit About and Contact
- Then the career history, credentials and contact links are accessible
- Check: `site.profile`

## Epic EPIC-002 — Demonstrate externally sourced engineering activity

Outcome: Visitors can discover current public open-source work from the homepage.

### Feature FEAT-005 — GitHub public activity

Outcome: Visitors can follow recent GitHub events to their repositories.

#### Story STORY-005 — Browse recent GitHub activity

Architecture owner: `next-web`

As a visitor, I can see recent public GitHub activity on the homepage and
open the corresponding repositories.

##### Acceptance AC-005 — Display recent activity

- Given GitHub returns valid supported events
- When the panel loads
- Then at most four events appear in feed order with readable labels and safe GitHub links
- Check: `activity.render`

##### Acceptance AC-006 — Preserve the homepage when the feed fails

- Given GitHub is rate limited, unreachable, empty or malformed
- When the panel finishes loading
- Then the homepage stays usable and links to the public GitHub profile
- Check: `activity.fallback`

##### Acceptance AC-007 — Reject unsafe event links

- Given the payload supplies unsafe repository names or untrusted repository URLs
- When the event mapper receives it
- Then unsafe entries produce no repository links
- Check: `activity.links`

##### Acceptance AC-008 — Verify the candidate independently

- Given a candidate patch for this story
- When the independent verifier applies it to a clean copy
- Then type checking, lint, unit tests, production build and strict CALM validation succeed
- Check: `site.qualification`

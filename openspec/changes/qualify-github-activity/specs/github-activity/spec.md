## ADDED Requirements

### Requirement: Public activity rendering
The homepage SHALL render up to four supported public GitHub events in feed order, with readable labels and HTTPS links to the matching GitHub repositories.

#### Scenario: Display recent supported events
- **WHEN** GitHub returns valid supported events
- **THEN** the panel shows at most the first four supported events in feed order, each with a readable label and its GitHub repository link

### Requirement: Activity fallback
The homepage SHALL remain usable and offer the public GitHub profile when the public feed is unavailable, empty, malformed or stalls past five seconds.

#### Scenario: Keep the homepage usable when the feed fails
- **WHEN** the feed returns a rate limit, a network error, an empty or malformed payload, or stalls for five seconds
- **THEN** the homepage remains usable and the panel links to the public GitHub profile

### Requirement: Safe activity links
The mapper SHALL reject unsafe repository names and mismatched or untrusted repository URLs, including credentialed URLs and non-default ports.

#### Scenario: Exclude unsafe repository links
- **WHEN** the mapper receives an event with an unsafe name or an untrusted repository URL
- **THEN** the event produces no repository link

### Requirement: Independent website qualification
The independent verifier SHALL apply a candidate patch to a disposable copy and run the reviewed type, lint, unit, production build, CALM and browser checks.

#### Scenario: Replay a candidate against the approved checks
- **WHEN** the independent verifier applies the approved STORY-005 patch to a clean copy
- **THEN** the type check, lint, mapper tests, production build, strict CALM validation and browser acceptance all pass

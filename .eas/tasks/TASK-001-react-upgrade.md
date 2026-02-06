# TASK-001: Upgrade to React 18

## Summary
Upgrade the site from React 17.0.2 to React 18.x, including updating all related dependencies and fixing any breaking changes.

## Current State
- React: 17.0.2
- React DOM: 17.0.2
- Gatsby: 3.3.0 (uses React 17)

## Target State
- React: 18.x (latest stable)
- React DOM: 18.x
- All components compatible with React 18 concurrent features

## Changes Required

### 1. Update Dependencies
```bash
# Core React packages
yarn upgrade react react-dom --latest

# Update react-helmet to react-helmet-async (React 18 compatible)
yarn remove react-helmet
yarn add react-helmet-async
```

### 2. Update ReactDOM.render
React 18 deprecates `ReactDOM.render()`. Check for any direct usage in:
- `gatsby-browser.js` (if exists)
- Any custom entry points

### 3. Fix React Helmet
Replace `react-helmet` with `react-helmet-async`:
```javascript
// Before
import { Helmet } from 'react-helmet'

// After
import { Helmet } from 'react-helmet-async'
```

### 4. Update Gatsby Plugins
Some Gatsby plugins may need updates for React 18:
- `gatsby-plugin-react-helmet` → may need version bump

## Files to Modify
- `package.json` - dependency versions
- `src/components/*.js` - any Helmet imports
- `src/templates/*.js` - any Helmet imports

## Acceptance Criteria
- [ ] React and React DOM updated to 18.x
- [ ] `yarn install` completes without errors
- [ ] `yarn build` completes successfully
- [ ] `yarn develop` starts without runtime errors
- [ ] All pages render correctly in browser
- [ ] No React 18 deprecation warnings in console

## Testing
```bash
yarn install
yarn build
yarn develop
# Manual: visit all pages, check console for errors
```

## Dependencies
None (this is the first task)

## Priority
1 (highest - foundational for other migrations)

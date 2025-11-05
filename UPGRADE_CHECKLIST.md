# Quick Upgrade Checklist

## 🎯 React Version Upgrade Checklist

### Pre-Upgrade
- [ ] Read React release notes and migration guide
- [ ] Check current library's React version
- [ ] Identify breaking changes
- [ ] Backup current working version

### Update Dependencies
- [ ] Update `peerDependencies` in package.json
  ```json
  "react": "^18.0.0 || ^19.0.0"
  "react-dom": "^18.0.0 || ^19.0.0"
  ```
- [ ] Update `devDependencies`
  ```bash
  npm install --save-dev @types/react@^19.0.1 @types/react-dom@^19.0.1
  ```
- [ ] Check other dependencies for compatibility

### Code Changes
- [ ] Fix JSX namespace: `JSX.Element` → `React.JSX.Element`
- [ ] Add `import React from 'react'` where needed
- [ ] Update deprecated React APIs
- [ ] Fix type errors
- [ ] Update styled-components types (if used)

### Build Configuration
- [ ] Update TypeScript config (jsx: "react-jsx")
- [ ] Update webpack externals (if needed)
- [ ] Check build tools compatibility

### Testing
- [ ] Run `npm run build` - should succeed
- [ ] Run `npx tsc --noEmit` - no type errors
- [ ] Test in target environment (Next.js, CRA, etc.)
- [ ] Test all component features

### Documentation
- [ ] Update README with new React version
- [ ] Update version number in package.json
- [ ] Create/update CHANGELOG.md

---

## 🚀 Next.js Compatibility Checklist

### Package Configuration
- [ ] Add `styled-components` to `peerDependencies`
  ```json
  "styled-components": "^6.0.0"
  ```

### Webpack Configuration
- [ ] Externalize `styled-components` in webpack externals
  ```javascript
  'styled-components': {
    commonjs: 'styled-components',
    commonjs2: 'styled-components',
    amd: 'styled-components',
  }
  ```
- [ ] Ensure React and React-DOM are externalized

### Build & Test
- [ ] Build library: `npm run build`
- [ ] Install in Next.js project
- [ ] Test SSR (Server-Side Rendering)
- [ ] Test client-side functionality

### Next.js Project Setup (Consumer Side)
- [ ] Install styled-components: `npm install styled-components`
- [ ] Configure next.config.js:
  ```javascript
  compiler: { styledComponents: true }
  ```
- [ ] Add `'use client'` directive if using App Router

---

## 🔧 Common Fixes

### TypeScript Errors
```typescript
// ❌ Before
export const Component = (): JSX.Element => {}

// ✅ After
import React from 'react';
export const Component = (): React.JSX.Element => {}
```

### Missing Types
```typescript
// Create .d.ts file for modules without types
// Example: webfontloader.d.ts
declare module 'webfontloader' {
  // ... type definitions
}
```

### Styled Components Types
```typescript
// Convert .js to .ts and add interface
interface Props {
  classKey: string;
  // ... other props
}

export const StyledComponent = styled.div<Props>`...`
```

### RefObject Types
```typescript
// ✅ Allow null in RefObject
const ref = useRef<HTMLCanvasElement | null>(null);

// ✅ Check before use
if (ref.current) {
  // use ref.current
}
```

---

## 📦 Build & Publish

### Before Publishing
- [ ] Run `npm run build`
- [ ] Test locally: `npm link` in library, `npm link library-name` in project
- [ ] Check bundle size
- [ ] Verify all exports work

### Versioning
- [ ] **Major** (2.0.0): Breaking changes
- [ ] **Minor** (1.5.0): New features, backward compatible
- [ ] **Patch** (1.4.3): Bug fixes

### Publish
```bash
npm version patch  # or minor, or major
npm publish
```

---

## ✅ Final Verification

- [ ] Library builds without errors
- [ ] Type definitions are generated correctly
- [ ] Works with React 19
- [ ] Works with Next.js 15
- [ ] No console warnings
- [ ] All features work as expected
- [ ] Documentation is updated


# Library Upgrade Guide: React & Next.js Compatibility

## 📚 Understanding This Library

### Library Architecture

This is a **React component library** that provides a customizable roulette wheel component. Here's how it's structured:

```
casino-style-custom-roulette/
├── src/
│   ├── index.tsx          # Main entry point - exports Wheel component
│   ├── components/
│   │   ├── Wheel/         # Main roulette wheel component
│   │   ├── WheelCanvas/   # Canvas rendering for the wheel
│   │   └── common/        # Shared utilities and styled components
│   ├── utils.ts           # Utility functions
│   └── strings.js         # Default constants
├── dist/                  # Built output (bundle.js + type definitions)
├── webpack.config.js      # Build configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Package metadata & dependencies
```

### Key Components

1. **Wheel Component** (`src/components/Wheel/index.tsx`)
   - Main component that handles spinning logic
   - Manages state (spinning, rotation degrees, etc.)
   - Uses `styled-components` for styling
   - Integrates with `webfontloader` for custom fonts

2. **WheelCanvas Component** (`src/components/WheelCanvas/index.tsx`)
   - Renders the wheel using HTML5 Canvas
   - Handles all the visual drawing (segments, text, images)

3. **Build System**
   - **Webpack**: Bundles the library into UMD format
   - **TypeScript**: Generates type definitions
   - **Externals**: React, React-DOM, and styled-components are externalized (not bundled)

---

## 🔄 How We Upgraded to React 19

### Step-by-Step Upgrade Process

#### 1. **Update Peer Dependencies**
```json
"peerDependencies": {
  "react": "^18.0.0 || ^19.0.0",      // Allow both React 18 & 19
  "react-dom": "^18.0.0 || ^19.0.0",
  "styled-components": "^6.0.0"       // Required peer dependency
}
```

**Why?** Peer dependencies tell consuming projects what versions they need to install. Using `^18.0.0 || ^19.0.0` allows maximum compatibility.

#### 2. **Update Dev Dependencies**
```json
"devDependencies": {
  "@types/react": "^19.0.1",          // React 19 type definitions
  "@types/react-dom": "^19.0.1"
}
```

**Why?** Dev dependencies are for development. We need React 19 types to ensure our code is compatible.

#### 3. **Fix JSX Namespace Issues**

**Before (React 18):**
```typescript
import { useEffect } from 'react';

export const Wheel = (): JSX.Element => {  // ❌ JSX namespace not found
  // ...
}
```

**After (React 19):**
```typescript
import React, { useEffect } from 'react';

export const Wheel = (): React.JSX.Element => {  // ✅ Explicit React namespace
  // ...
}
```

**Why?** React 19 changed how JSX types are resolved. Using `React.JSX.Element` is more explicit and compatible.

#### 4. **Update TypeScript Configuration**
```json
{
  "compilerOptions": {
    "jsx": "react-jsx",        // New JSX transform (React 17+)
    "lib": ["dom", "dom.iterable", "esnext"]
  }
}
```

#### 5. **Handle Type Issues**

**a) Missing Type Declarations**
- Created `src/webfontloader.d.ts` for `webfontloader` module
- This prevents TypeScript errors about missing types

**b) Styled Components Props**
- Converted `styles.js` to `styles.ts`
- Added proper TypeScript interfaces for styled component props:
```typescript
interface RotationContainerProps {
  classKey: string;
  startSpinningTime: number;
  // ... other props
}

export const RotationContainer = styled.div<RotationContainerProps>`...`
```

**c) RefObject Type Issues**
```typescript
// Fixed RefObject type to allow null
const drawWheel = (
  canvasRef: RefObject<HTMLCanvasElement | null>,  // ✅ Allows null
  // ...
)

// Added null check in useEffect
useEffect(() => {
  if (canvasRef.current) {  // ✅ Safety check
    drawWheel(canvasRef, data, drawWheelProps);
  }
}, [canvasRef, data, drawWheelProps, rouletteUpdater]);
```

---

## 🚀 Making It Next.js Compatible

### Step 1: Externalize Dependencies

**webpack.config.js:**
```javascript
externals: {
  react: {
    commonjs: 'react',
    commonjs2: 'react',
    amd: 'React',
    root: 'React',
  },
  'react-dom': {
    commonjs: 'react-dom',
    commonjs2: 'react-dom',
    amd: 'ReactDOM',
    root: 'ReactDOM',
  },
  'styled-components': {  // ✅ Critical for Next.js
    commonjs: 'styled-components',
    commonjs2: 'styled-components',
    amd: 'styled-components',
    root: 'styled',
  },
}
```

**Why?** 
- Prevents bundling React multiple times (Next.js already has React)
- Ensures styled-components works with Next.js's SSR
- Reduces bundle size

### Step 2: Add styled-components to Peer Dependencies

```json
"peerDependencies": {
  "styled-components": "^6.0.0"
}
```

**Why?** Next.js projects need to install styled-components themselves for proper SSR handling.

### Step 3: Ensure Client-Side Only Code (if needed)

For Next.js App Router, you might need to mark components as client-only:

```typescript
'use client';  // Add this if using Next.js App Router

import { Wheel } from 'casino-style-custom-roulette';
```

### Step 4: Next.js Configuration (in consuming project)

**next.config.js:**
```javascript
const nextConfig = {
  compiler: {
    styledComponents: true,  // Enable styled-components support
  },
  // Optional: Transpile packages
  transpilePackages: ['casino-style-custom-roulette'],
}
```

---

## 📋 General Library Upgrade Checklist

### Phase 1: Preparation

- [ ] **Check React Release Notes**
  - Review breaking changes: https://react.dev/blog
  - Check deprecation warnings
  - Review migration guides

- [ ] **Audit Current Dependencies**
  ```bash
  npm outdated
  npm audit
  ```

- [ ] **Review TypeScript Compatibility**
  - Check if TypeScript version supports new React types
  - Update `@types/react` and `@types/react-dom`

### Phase 2: Update Dependencies

- [ ] **Update Peer Dependencies**
  ```json
  "peerDependencies": {
    "react": "^NEW_VERSION",
    "react-dom": "^NEW_VERSION"
  }
  ```

- [ ] **Update Dev Dependencies**
  ```bash
  npm install --save-dev @types/react@NEW_VERSION @types/react-dom@NEW_VERSION
  ```

- [ ] **Update Build Tools** (if needed)
  - Webpack, TypeScript, etc.

### Phase 3: Code Changes

- [ ] **Fix Type Issues**
  - Update JSX.Element → React.JSX.Element
  - Fix deprecated API usage
  - Update type definitions

- [ ] **Update React APIs**
  - Check for deprecated hooks
  - Update to new APIs (e.g., `useId`, `useSyncExternalStore`)

- [ ] **Fix Build Configuration**
  - Update webpack externals
  - Update TypeScript config
  - Update babel config (if used)

### Phase 4: Testing

- [ ] **Build Test**
  ```bash
  npm run build
  ```

- [ ] **Type Check**
  ```bash
  npx tsc --noEmit
  ```

- [ ] **Test in Target Environment**
  - Test with Next.js project
  - Test with Create React App
  - Test with Vite

### Phase 5: Documentation

- [ ] **Update README**
  - Update compatibility notes
  - Update installation instructions
  - Update migration guide (if breaking changes)

- [ ] **Update Package Version**
  ```json
  "version": "2.0.0"  // Major version for breaking changes
  ```

---

## 🎯 Best Practices for Library Maintenance

### 1. **Version Strategy**

```json
{
  "version": "1.4.2"
}
```

- **Major** (1.x.x → 2.x.x): Breaking changes
- **Minor** (1.4.x → 1.5.x): New features, backward compatible
- **Patch** (1.4.1 → 1.4.2): Bug fixes

### 2. **Peer Dependencies Strategy**

```json
"peerDependencies": {
  "react": "^18.0.0 || ^19.0.0"  // Support multiple versions
}
```

**Benefits:**
- Maximum compatibility
- Consumers can use any supported version
- No forced upgrades

### 3. **Externalization Strategy**

**Always externalize:**
- React & React-DOM (prevents duplicate bundles)
- Framework-specific dependencies (styled-components, etc.)
- Large libraries that consumers likely have

**Bundle:**
- Small utility libraries
- Project-specific code
- Libraries that are unlikely to conflict

### 4. **TypeScript Best Practices**

- ✅ Always generate `.d.ts` files
- ✅ Use strict TypeScript settings
- ✅ Export types for consumers
- ✅ Use `peerDependencies` for types when possible

### 5. **Build Output**

```
dist/
├── bundle.js          # UMD bundle
├── index.d.ts         # Type definitions
└── assets/            # Static assets
```

**Why UMD?**
- Works in CommonJS (Node.js)
- Works in AMD (RequireJS)
- Works in browser globals
- Compatible with bundlers (Webpack, Vite, etc.)

---

## 🔍 Common Issues & Solutions

### Issue 1: "Module not found: Can't resolve 'react'"

**Solution:** Ensure React is in `peerDependencies` and `externals` in webpack.

### Issue 2: "styled-components not working in Next.js"

**Solution:**
1. Add styled-components to peerDependencies
2. Externalize it in webpack
3. Enable styled-components in next.config.js

### Issue 3: "JSX namespace not found"

**Solution:**
```typescript
import React from 'react';  // Add this
// Use React.JSX.Element instead of JSX.Element
```

### Issue 4: "Type errors with React 19"

**Solution:**
- Update @types/react to ^19.0.0
- Use React.JSX.Element
- Check for deprecated APIs

### Issue 5: "Bundle size too large"

**Solution:**
- Externalize dependencies
- Use tree-shaking
- Check for duplicate dependencies

---

## 📦 Installation & Usage

### For Local Development

```bash
# In library directory
npm run build

# In your Next.js project
npm install ../path/to/casino-style-custom-roulette
```

### For Production

```bash
# Publish to npm
npm publish

# Or use from GitHub
npm install github:username/casino-style-custom-roulette
```

### Usage in Next.js

```typescript
'use client';  // If using App Router

import { Wheel } from 'casino-style-custom-roulette';
import { WheelDataType } from 'casino-style-custom-roulette';

const data: WheelDataType[] = [
  { option: 'Prize 1', style: { backgroundColor: '#ff0000' } },
  // ...
];

export default function RoulettePage() {
  return (
    <Wheel
      mustStartSpinning={false}
      prizeNumber={0}
      data={data}
      onStopSpinning={() => console.log('Stopped!')}
    />
  );
}
```

---

## 🚨 Important Notes

1. **Always rebuild** after making changes:
   ```bash
   npm run build
   ```

2. **Test in target environment** before publishing

3. **Keep peer dependencies flexible** - use ranges like `^18.0.0 || ^19.0.0`

4. **Document breaking changes** in CHANGELOG.md

5. **Version according to semver** - respect semantic versioning

---

## 📚 Additional Resources

- [React 19 Upgrade Guide](https://react.dev/blog/2024/04/25/react-19)
- [Next.js App Router Docs](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Webpack Library Authoring](https://webpack.js.org/guides/author-libraries/)
- [Semantic Versioning](https://semver.org/)

---

## ✅ Summary

This library upgrade process involved:

1. ✅ Updated peer dependencies to support React 19
2. ✅ Updated dev dependencies (TypeScript types)
3. ✅ Fixed JSX namespace issues (React.JSX.Element)
4. ✅ Added proper TypeScript interfaces
5. ✅ Externalized styled-components for Next.js compatibility
6. ✅ Fixed all type errors
7. ✅ Removed testing dependencies (simplified)
8. ✅ Successfully built and tested

The library is now **React 19 compatible** and **Next.js 15 ready**! 🎉


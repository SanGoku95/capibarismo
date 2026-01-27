# 🎮 Qualifier Feature - Quick Reference

## 🔥 HOW TO USE

### For End Users

1. **Start Game**: Click "Jugar: ¿Quién Va?" on homepage
2. **Review Candidates**: See each candidate one by one
3. **Make Decision**:
   - Click **VA** (green) to accept
   - Click **NO VA** (red) to reject
   - Or use keyboard: **← / A** (reject) | **→ / D** (accept)
4. **Complete**: After reviewing all 36 candidates
5. **Proceed**: Click "¡A LA ARENA!" to start battles

### Minimum Requirements
- Must select at least **3 candidates** to proceed
- Can reset and start over anytime

---

## 🛠️ FOR DEVELOPERS

### Accessing Qualifier State

```typescript
import { useGameUIStore } from '@/store/useGameUIStore';

function MyComponent() {
  const { 
    gamePhase,              // 'QUALIFIER' | 'VERSUS' | 'RESULTS'
    qualifiedCandidateIds,  // ['id1', 'id2', ...]
    hasCompletedQualifier,  // boolean
    completeQualifier,      // () => void
    resetGamePhase,         // () => void
  } = useGameUIStore();
}
```

### Updating Qualified Candidates

```typescript
const { setQualifiedCandidates } = useGameUIStore();

// Set qualified candidates
setQualifiedCandidates(['candidate1', 'candidate2', 'candidate3']);
```

### Resetting the Game

```typescript
const { resetGamePhase } = useGameUIStore();

// Clear all qualifier data and restart
resetGamePhase();
```

### Checking Qualifier Status

```typescript
const { hasCompletedQualifier, qualifiedCandidateIds } = useGameUIStore();

if (hasCompletedQualifier && qualifiedCandidateIds.length >= 3) {
  // User has completed qualifier
  navigate('/jugar');
} else {
  // Redirect to qualifier
  navigate('/qualifier');
}
```

---

## 🎨 CUSTOMIZATION

### Change Minimum Required Candidates

**File**: `src/pages/QualifierPage.tsx`

```typescript
const MINIMUM_QUALIFIED = 3; // Change this number
```

### Modify Button Text

**File**: `src/components/game/QualifierCard.tsx`

```tsx
// Line ~128-140
<Button>
  NO VA  {/* Change this */}
</Button>

<Button>
  VA     {/* Change this */}
</Button>
```

### Update Page Title

**File**: `src/pages/QualifierPage.tsx`

```tsx
// Line ~152
<h1 className="...">
  ¿QUIÉN VA?  {/* Change this */}
</h1>
```

### Adjust Card Animation Speed

**File**: `src/components/game/QualifierCard.tsx`

```typescript
// Line ~26-35
const cardVariants = {
  visible: { 
    transition: {
      stiffness: 260,  // Higher = faster
      damping: 20,     // Lower = more bounce
    },
  },
  exit: {
    transition: {
      duration: 0.3,   // Exit animation speed
    },
  },
};
```

---

## 🐛 DEBUGGING

### Check Zustand State in DevTools

```javascript
// In browser console
useGameUIStore.getState()
```

### Reset Persisted State

```javascript
// In browser console
localStorage.removeItem('game-ui-storage')
location.reload()
```

### Check Current Game Phase

```javascript
// In browser console
useGameUIStore.getState().gamePhase
```

### View Qualified Candidates

```javascript
// In browser console
useGameUIStore.getState().qualifiedCandidateIds
```

---

## 📊 ANALYTICS EVENTS

### Track Qualifier Events

Add to your analytics:

```typescript
// Qualifier started
posthog.capture('qualifier_started');

// Candidate accepted
posthog.capture('candidate_accepted', { candidateId });

// Candidate rejected
posthog.capture('candidate_rejected', { candidateId });

// Qualifier completed
posthog.capture('qualifier_completed', { 
  totalSelected: qualifiedCandidateIds.length 
});

// Reset clicked
posthog.capture('qualifier_reset');
```

---

## 🔐 SECURITY NOTES

- ✅ All state is client-side (no server validation needed)
- ✅ No sensitive data stored
- ✅ Uses localStorage (secure in HTTPS)
- ✅ No API calls during qualifier phase

---

## ⚡ PERFORMANCE TIPS

### Image Optimization

Images are prefetched automatically. To improve loading:

1. **Compress images**: Use WebP format
2. **Lazy load**: Already implemented
3. **CDN**: Consider using image CDN for faster delivery

### State Management

Current implementation is optimal:
- ✅ Minimal re-renders
- ✅ Efficient filtering
- ✅ No unnecessary API calls

---

## 🧪 TESTING

### Unit Tests (Recommended)

```typescript
// __tests__/QualifierPage.test.tsx
describe('QualifierPage', () => {
  it('should show all candidates', () => {
    // Test implementation
  });

  it('should enforce minimum 3 candidates', () => {
    // Test implementation
  });

  it('should save state on completion', () => {
    // Test implementation
  });
});
```

### E2E Tests (Recommended)

```typescript
// cypress/e2e/qualifier.cy.ts
describe('Qualifier Flow', () => {
  it('completes qualifier and proceeds to versus', () => {
    cy.visit('/qualifier');
    
    // Accept 5 candidates
    for (let i = 0; i < 5; i++) {
      cy.contains('VA').click();
    }
    
    // Reject remaining
    for (let i = 5; i < 36; i++) {
      cy.contains('NO VA').click();
    }
    
    // Complete
    cy.contains('¡A LA ARENA!').click();
    cy.url().should('include', '/jugar');
  });
});
```

---

## 🚨 COMMON ISSUES

### Issue: Qualifier state not persisting

**Solution**: Check if localStorage is enabled

```javascript
// Test localStorage
localStorage.setItem('test', 'value');
console.log(localStorage.getItem('test')); // Should log 'value'
```

### Issue: Redirecting from /jugar not working

**Solution**: Clear persisted state

```javascript
localStorage.removeItem('game-ui-storage');
location.reload();
```

### Issue: Images not loading

**Solution**: Check image paths in candidate data

```typescript
// Verify candidate has images
import { listCandidates } from '@/data';

const candidates = listCandidates();
console.log(candidates.map(c => ({ 
  id: c.id, 
  hasFullBody: !!c.fullBody,
  hasHeadshot: !!c.headshot
})));
```

---

## 📞 SUPPORT

Need help? Check:
1. `docs/QUALIFIER_FEATURE.md` - Full documentation
2. `QUALIFIER_IMPLEMENTATION_COMPLETE.md` - Implementation summary
3. Code comments in modified files

---

**Version**: 1.0.0  
**Last Updated**: January 2026  
**Status**: ✅ Production Ready

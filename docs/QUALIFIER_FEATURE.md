# Qualifier Round Feature - Implementation Guide

## Overview

The Qualifier Round is a new game phase that solves the scalability problem when moving from 11 to 36 candidates. Instead of a full Round Robin (all vs all), users first filter candidates in a Tinder-style interface before proceeding to 1v1 battles.

## Game Flow

```
HOME PAGE → QUALIFIER (Filter) → VERSUS (1v1 Battles) → RESULTS
```

### Phase 1: QUALIFIER
- Users see candidates one-by-one
- Actions: "VA" (Accept) or "NO VA" (Reject)
- Minimum 3 candidates must be selected
- Thematic flavor: "¿QUIÉN VA?"

### Phase 2: VERSUS
- Traditional 1v1 comparisons
- **Only uses qualified candidates** from Phase 1
- Smart pair generation respects the filtered pool

### Phase 3: RESULTS
- Ranking based on ELO ratings
- Only shows qualified candidates

## Technical Implementation

### 1. State Management (Zustand Store)

**File**: `src/store/useGameUIStore.ts`

**New State Properties**:
- `gamePhase: GamePhase` - Current phase: 'QUALIFIER' | 'VERSUS' | 'RESULTS'
- `qualifiedCandidateIds: string[]` - Array of candidate IDs that passed the qualifier
- `hasCompletedQualifier: boolean` - Flag to track completion status

**New Actions**:
- `setQualifiedCandidates(candidateIds: string[])` - Updates the qualified roster
- `completeQualifier()` - Transitions from QUALIFIER to VERSUS phase
- `resetGamePhase()` - Resets the entire game flow
- `setGamePhase(phase: GamePhase)` - Manually sets the phase

**Persistence**:
Uses `zustand/middleware` persist to save qualifier state across sessions.

### 2. Qualifier UI Components

#### QualifierCard Component
**File**: `src/components/game/QualifierCard.tsx`

Features:
- Displays candidate with full-body image
- "VA" (green) and "NO VA" (red) buttons
- Progress indicator (e.g., "5 / 36")
- Info button to view candidate details
- Framer Motion animations for card swipes
- Respects `reducedMotion` preference

#### QualifierPage Component
**File**: `src/pages/QualifierPage.tsx`

Features:
- Cycles through all 36 candidates
- Tracks accepted candidates in local state
- Keyboard controls: Arrow Left (Reject), Arrow Right (Accept)
- Image prefetching for smooth transitions
- Completion screen when all candidates reviewed
- Minimum 3 candidates validation
- Reset functionality

### 3. Pair Generation Service Update

**File**: `src/services/pairGenerationService.ts`

**Key Change**:
```typescript
export function generateSmartPair(qualifiedCandidateIds?: string[]): Pair {
  const candidates = listCandidates(qualifiedCandidateIds);
  // ... rest of logic
}

function listCandidates(qualifiedCandidateIds?: string[]): CandidateBase[] {
  const allCandidates = Object.values(base);
  
  if (qualifiedCandidateIds && qualifiedCandidateIds.length > 0) {
    const qualifiedSet = new Set(qualifiedCandidateIds);
    return allCandidates.filter(c => qualifiedSet.has(c.id));
  }
  
  return allCandidates;
}
```

### 4. useGameAPI Hook Update

**File**: `src/hooks/useGameAPI.ts`

**Key Change**:
```typescript
export function useNextPair() {
  const qualifiedCandidateIds = useGameUIStore(state => state.qualifiedCandidateIds);
  const hasCompletedQualifier = useGameUIStore(state => state.hasCompletedQualifier);

  return useQuery({
    queryKey: ['game', 'nextpair', sessionId, qualifiedCandidateIds],
    queryFn: () => {
      const filterIds = hasCompletedQualifier && qualifiedCandidateIds.length > 0 
        ? qualifiedCandidateIds 
        : undefined;
      
      const pair = generateSmartPair(filterIds);
      // ...
    },
  });
}
```

### 5. Routing Updates

**File**: `src/App.tsx`

**New Route**:
```tsx
<Route path="/qualifier" element={<QualifierPage />} />
```

**Updated Navigation Flow**:
- Home Page → `/qualifier` (new primary CTA)
- Qualifier completion → `/jugar` (auto-navigation)
- Direct `/jugar` access → Redirects to `/qualifier` if not completed

### 6. JugarPage Protection

**File**: `src/pages/JugarPage.tsx`

**Key Addition**:
```typescript
useEffect(() => {
  if (!hasCompletedQualifier || qualifiedCandidateIds.length === 0) {
    navigate('/qualifier');
  }
}, [hasCompletedQualifier, qualifiedCandidateIds, navigate]);
```

## User Experience

### Qualifier Flow

1. **Entry**: User clicks "Jugar: ¿Quién Va?" on home page
2. **Selection**: Cards appear one by one
   - Left/A key or NO VA button = Reject
   - Right/D key or VA button = Accept
3. **Progress**: Header shows "Seleccionados: X / 36"
4. **Completion**: After reviewing all candidates:
   - Shows count of selected candidates
   - Validates minimum 3 candidates
   - "¡A LA ARENA!" button to proceed
   - Reset option to start over
5. **Transition**: Auto-navigates to `/jugar` with filtered roster

### Versus Mode

- Only generates pairs from qualified candidates
- All existing features work unchanged
- Rankings reflect only the qualified pool

## Design Philosophy

### Retro 90s Aesthetic Maintained
- Pixel fonts ("Press Start 2P")
- Neon colors (primary: magenta, accent: gold)
- Chunky borders and shadows
- Fighting game theme ("VA" vs "NO VA" = Fighter selection)
- Arcade-style animations

### Optimistic UI
- Instant card swipe animations
- No loading states between cards
- Prefetching next candidate images

### Accessibility
- Keyboard navigation support
- Respects `prefers-reduced-motion`
- Clear visual feedback
- ARIA labels on interactive elements

## Edge Cases Handled

1. **No candidates selected**: Validation prevents proceeding
2. **Only 1-2 candidates**: Warning message, requires minimum 3
3. **Direct /jugar navigation**: Redirects to qualifier if incomplete
4. **Browser refresh**: Qualifier state persists via Zustand persist
5. **Phase reset**: `resetGamePhase()` clears all qualifier data

## Configuration Constants

**Minimum Qualified Candidates**: 3  
Located in: `src/pages/QualifierPage.tsx`

```typescript
const MINIMUM_QUALIFIED = 3;
```

**Recommendation**: Adjust based on desired game length. Lower = faster games, Higher = more comprehensive rankings.

## Testing Checklist

- [ ] Qualifier displays all 36 candidates
- [ ] Accept/Reject buttons work correctly
- [ ] Keyboard controls (arrows/A/D) function
- [ ] Progress counter updates accurately
- [ ] Completion screen validates minimum candidates
- [ ] "¡A LA ARENA!" navigates to /jugar
- [ ] /jugar redirects to /qualifier if not completed
- [ ] Pair generation uses only qualified candidates
- [ ] Reset button clears selections
- [ ] State persists across page refreshes
- [ ] Animations respect reduced motion preference
- [ ] Mobile responsive design works

## Future Enhancements

1. **Smart Recommendations**: Suggest candidates based on user's political compass position
2. **Quick Select**: "Select All" or "Select Top 10 by Polls"
3. **Undo**: Allow going back to previous candidate
4. **Preview**: Show mini-profile while hovering over candidate
5. **Batch Mode**: Grid view to select multiple at once
6. **Analytics**: Track which candidates are most frequently qualified/rejected

## Migration Notes

**Backward Compatibility**:
- Old users without qualifier data can still access /jugar directly (for now)
- Consider forcing all users through qualifier after a grace period
- Monitor analytics on /jugar bounce rate vs /qualifier completion rate

**Database Impact**:
- No backend changes required
- All state is client-side (Zustand + localStorage)
- Voting API remains unchanged

## Files Modified

### Created Files
1. `src/pages/QualifierPage.tsx` (209 lines)
2. `src/components/game/QualifierCard.tsx` (154 lines)

### Modified Files
1. `src/store/useGameUIStore.ts` - Added game phase state
2. `src/services/pairGenerationService.ts` - Added qualified filtering
3. `src/hooks/useGameAPI.ts` - Updated pair query to use qualified IDs
4. `src/App.tsx` - Added /qualifier route
5. `src/pages/HomePage.tsx` - Updated CTA to point to /qualifier
6. `src/pages/JugarPage.tsx` - Added qualifier completion check

---

**Implementation Status**: ✅ Complete

**Est. Lines of Code**: ~500 LOC

**Breaking Changes**: None (fully backward compatible)

**Performance Impact**: Negligible (filtering happens in-memory)

# CRI (Constructed Response Items) System Documentation

## Overview

The CRI system is a sophisticated educational component that manages in-page quizzes within the iTELL textbook reading experience. CRI stands for "Constructed Response Items" - interactive questions that appear as users progress through textbook content, requiring written responses that are evaluated by AI.

## System Architecture

### Core Concept

The CRI system implements a "progressive disclosure" model where:
1. Only the first chunk of content is initially visible
2. Subsequent chunks are blurred out until unlocked
3. Users must complete CRI questions (when present) to progress
4. The system tracks user progress and manages state persistently

### Key Components

#### 1. Content Structure (`content/textbook/*.md`)
Each textbook page contains:
- **Chunks**: Content sections marked with `{#slug}` headers
- **CRI Definitions**: Frontmatter with question/answer pairs mapped to chunk slugs
- **Randomization**: CRI questions are randomly assigned to chunks on page load

Example:
```yaml
# Frontmatter
chunks:
- title: The U.S. Constitution
  slug: The-US-Constitution-4445
  type: regular

cri:
- question: When was the U.S. Constitution written?
  answer: The U.S. Constitution was written in 1787.
  slug: The-US-Constitution-4445
```

#### 2. State Management (`src/lib/store/cri-store.tsx`)

**Core Types:**
```typescript
type CRISnapshot = {
  currentChunk: string;        // Currently visible chunk
  chunkStatus: ChunkStatus;    // Status of each chunk 
  isAssignmentReady: boolean;  // Whether assignments are unlocked
  shouldBlur: boolean;         // Whether blurring is active
};

type ChunkStatus = Record<string, {
  hasQuestion: boolean;        // Whether chunk has a CRI
  status: undefined | "completed" | "passed";  // Completion status
}>;
```

**State Actions:**
- `finishChunk({ chunkSlug, passed })`: Mark chunk as completed/passed
- `advanceChunk({ chunkSlug })`: Move to next chunk in sequence
- `finishPage()`: Unlock assignments and disable blurring
- `resetPage()`: Reset all progress to initial state

**Key Features:**
- **State Validation**: `validateAndFixState()` detects and repairs corrupted localStorage data
- **Persistent Storage**: State synced to localStorage as `question-store-${pageSlug}`
- **Randomization Logic**: Each page gets at least one CRI, with 1/3 probability per available chunk

#### 3. Content Processing (`velite.config.ts` → `rehypeAddCri`)

The build process transforms markdown into interactive components:

1. **Markdown Structure**: Chunks defined with level-2 headings
2. **Plugin Pipeline**: 
   - `rehypeWrapHeadingSection`: Wraps chunks in `<section class="content-chunk">`
   - `rehypeAddCri`: Injects `<i-question>` components into matching chunks
3. **Component Mapping**: `<i-question>` → React CRI components in `content-components.tsx`

#### 4. Chunk Visibility Control (`chunk-control.tsx`)

**Primary Responsibilities:**
- Apply/remove `.blurred` CSS class based on state
- Insert "Continue Reading" buttons for progression
- Manage portal-based button rendering

**Core Logic:**
```typescript
// Synchronous blur application (prevents flash)
useLayoutEffect(() => {
  const blurStates = calculateBlurState();
  chunks.forEach((chunkSlug) => {
    const el = getChunkElement(chunkSlug, "data-chunk-slug");
    if (!el) return;
    
    el.classList.remove("blurred");
    if (blurStates[chunkSlug]) {
      el.classList.add("blurred");
    }
  });
}, [chunks, shouldBlur, currentChunk]);
```

**Button Management:**
- **Single Button Rule**: Only one "Continue Reading" button exists at a time
- **Clean Insertion**: `cleanupAllContinueButtons()` removes all existing buttons before creating new ones
- **Placement Logic**: Button appears on next chunk when current chunk has no CRI

#### 5. CRI Components

**CRI Stairs (`cri-stairs.tsx`)**
- Main CRI implementation with AI evaluation
- Handles answer submission and feedback display
- Manages streak tracking and progression

**CRI Variants**:
- `cri-reread.tsx`: For re-reading conditions
- `cri-simple.tsx`: Simplified version
- All variants share common shell (`cri-shell.tsx`)

**Continue Button (`continue-chunk-button.tsx`)**
- Triggers `advanceChunk()` action
- Simple component that relies on store for progression logic

**Finish CRI Button (`finish-cri-button.tsx`)**
- Appears after successful CRI completion
- Handles both chunk advancement and final page unlock

#### 6. Page Integration (`page-provider.tsx`)

**Initialization:**
```typescript
// Create store with optional localStorage recovery
const criStoreRef = useRef<CRIStore>(undefined);
if (!criStoreRef.current) {
  criStoreRef.current = createCRIStore(
    { chunks: page.chunks, pageStatus, status: pageCRIStatus },
    snapshot  // Validated localStorage data
  );
}
```

**State Persistence:**
```typescript
// Sync store changes to localStorage
useEffect(() => {
  const subscription = criStoreRef.current.subscribe((state) => {
    setSnapshot(state.context);
  });
  return () => subscription.unsubscribe();
}, []);
```

## Data Flow

### 1. Page Load
1. **Content Processing**: Markdown → HTML with CRI placeholders
2. **CRI Randomization**: `getPageCRIStatus()` assigns questions to chunks
3. **State Initialization**: Create store, validate/restore localStorage
4. **Initial Render**: Apply blur states synchronously

### 2. User Progression (No CRI)
1. User reads visible chunk
2. "Continue Reading" button appears on next blurred chunk
3. User clicks → `advanceChunk()` → next chunk becomes visible
4. Button moves to subsequent chunk

### 3. User Progression (With CRI)
1. User encounters CRI question in current chunk
2. No "Continue Reading" button shown (CRI handles progression)
3. User submits answer → AI evaluation
4. On success: "Continue Reading" button appears in CRI component
5. User clicks → `finishChunk({ passed: true })` → progression continues

### 4. State Persistence
1. Any store action triggers subscription
2. Current state saved to localStorage
3. On page reload, state restored and validated
4. Corrupted state automatically reset to clean state

## Recent Bug Fixes & Improvements

### 1. Race Condition Prevention
**Problem**: State updates and DOM manipulation happened simultaneously, causing inconsistent UI.

**Solution**: Added `setTimeout(0)` to defer store actions after UI updates:
```typescript
// cri-stairs.tsx - Answer submission
setState({ status: StatusStairs.PASSED, ... });
setTimeout(() => {
  store.trigger.finishChunk({ chunkSlug, passed: true });
}, 0);
```

### 2. State Corruption Recovery
**Problem**: Invalid localStorage data could break the entire system.

**Solution**: Added `validateAndFixState()` function that:
- Validates currentChunk exists in chunk list
- Ensures chunk completion consistency
- Resets to clean state if corruption detected

### 3. Multiple Button Bug
**Problem**: Multiple "Continue Reading" buttons appeared when chunks had no CRI.

**Solution**: Implemented `cleanupAllContinueButtons()`:
```typescript
const cleanupAllContinueButtons = () => {
  // Remove all containers from DOM
  document.querySelectorAll(".continue-reading-button-container")
    .forEach(container => container.remove());
  
  // Clear portal references
  if (portalIds.current.continueReading) {
    removePortal(portalIds.current.continueReading);
    portalIds.current.continueReading = "";
  }
};
```

### 4. Empty Input Validation
**Problem**: "Please submit a different answer" error shown on first empty submission.

**Solution**: Modified validation to only check duplicates for non-empty previous submissions:
```typescript
// Only check for duplicates if user previously submitted non-empty answer
if (input === state.input && state.input !== "") {
  setState({ error: "Please submit a different answer" });
  return;
}
```

### 5. Synchronous Blur Rendering
**Problem**: Flash of unblurred content before blur classes applied.

**Solution**: Use `useLayoutEffect` instead of `useEffect` for blur application:
```typescript
// Runs synchronously before browser paint
useLayoutEffect(() => {
  // Apply blur states immediately
}, [chunks, shouldBlur, currentChunk]);
```

## File Structure

```
src/
├── lib/store/cri-store.tsx              # Core state management
├── components/provider/page-provider.tsx # Context & localStorage sync
├── app/(textbook)/[slug]/_components/cri/
│   ├── chunk-control.tsx                # Visibility & button management
│   ├── cri-stairs.tsx                   # Main CRI component
│   ├── cri-reread.tsx                   # Re-reading variant
│   ├── cri-simple.tsx                   # Simplified variant
│   ├── continue-chunk-button.tsx        # Progression button
│   ├── finish-cri-button.tsx           # Post-CRI progression
│   └── types.ts                         # Shared types
├── components/content-components.tsx     # Markdown → React mapping
└── actions/cri.ts                      # Server actions for CRI data
```

## Configuration

### Environment Variables
- CRI evaluation handled by external AI service
- API endpoints configured in `lib/api-client.ts`

### Content Management
- CRI questions defined in markdown frontmatter
- Randomization probability: 1/3 per chunk
- Minimum 1 CRI per page guaranteed

## Debugging

### Console Logging
The system includes comprehensive logging for debugging:
- `[CRI] Current chunk: X, has question: Y`
- `[CRI] Inserting continue button on chunk: X`
- `[CRI] Found orphaned chunk X, adding continue button`

### Common Issues
1. **Buttons not appearing**: Check console for DOM element lookup failures
2. **State corruption**: Look for validation warnings in console
3. **Race conditions**: Verify setTimeout usage in state transitions

## Performance Considerations

### Optimizations
- **Synchronous blur**: Prevents layout shifts
- **Portal cleanup**: Aggressive cleanup prevents memory leaks  
- **State validation**: Catches edge cases before they become errors

### Monitoring
- Track CRI completion rates via dashboard
- Monitor localStorage corruption frequency
- Performance metrics for blur/unblur operations

## Future Enhancements

### Potential Improvements
1. **Predictive Loading**: Pre-load next chunk content
2. **Offline Support**: Enhanced localStorage resilience
3. **Analytics**: Detailed progression tracking
4. **Accessibility**: Screen reader optimization for blur states
5. **Mobile**: Touch-specific interaction patterns

### Architecture Evolution
- Consider moving to server-side state for multi-device sync
- Implement proper error boundaries for CRI failures
- Add comprehensive unit tests for state transitions
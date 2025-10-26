# Spinner Component Guide

A modern, reusable spinner component with smooth animations applied throughout the application.

## Overview

The `Spinner` component provides a beautiful, animated loading indicator that can be used in any loading state. It features:

- ✨ Smooth rotating animation with 10 bars
- 🎨 Customizable sizes (sm, md, lg)
- 🎯 Color support (uses `currentColor` by default)
- 📦 Lightweight and performant
- ♿ Accessible
- 🔄 Reusable across the application

## Component Location

**File:** `components/ui/spinner.tsx`

## Usage

### Basic Usage

```tsx
import { Spinner } from "@/components/ui/spinner"

export default function MyComponent() {
  return <Spinner />
}
```

### With Size

```tsx
<Spinner size="sm" />   {/* Small: 16px */}
<Spinner size="md" />   {/* Medium: 32px (default) */}
<Spinner size="lg" />   {/* Large: 48px */}
```

### With Color

```tsx
<Spinner className="text-primary" />
<Spinner className="text-blue-500" />
<Spinner className="text-white" />
```

### Combined

```tsx
<Spinner size="lg" className="text-primary" />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Size of the spinner |
| `color` | `string` | `"currentColor"` | CSS color value |
| `className` | `string` | `""` | Additional CSS classes |

## Size Reference

- **sm**: 16px × 16px (small loading indicators)
- **md**: 32px × 32px (default, general use)
- **lg**: 48px × 48px (prominent loading states)

## Where It's Used

### 1. Uploaded Files Panel
**File:** `components/uploaded-files-panel.tsx`

Shows when loading consolidated files from Supabase:

```tsx
if (isLoading) {
  return (
    <div className="flex flex-col items-center justify-center p-12 gap-4">
      <Spinner size="lg" className="text-primary" />
      <div className="text-muted-foreground">Loading consolidated files...</div>
    </div>
  )
}
```

### 2. File Upload Section
**File:** `components/file-upload-section.tsx`

Shows when processing ZIP files:

```tsx
{isLoading && (
  <div className="bg-primary/5 text-primary text-sm rounded-lg px-3 py-2 flex items-center gap-2">
    <Spinner size="sm" className="text-primary" />
    <span>Processing files...</span>
  </div>
)}
```

### 3. Share Request Dialog
**File:** `components/share-request-dialog.tsx`

Shows when submitting a share request:

```tsx
{isSubmitting ? (
  <>
    <Spinner size="sm" className="text-primary-foreground" />
    <span className="ml-2">Submitting...</span>
  </>
) : (
  "Submit Request"
)}
```

## Animation Details

### Keyframe Animation

The spinner uses a custom `spinner-fzua35` keyframe animation:

```css
@keyframes spinner-fzua35 {
  0%, 10%, 20%, 30%, 50%, 60%, 70%, 80%, 90%, 100% {
    transform: rotate(calc(var(--rotation) * 1deg)) translate(0, calc(var(--translation) * 1%));
  }
  50% {
    transform: rotate(calc(var(--rotation) * 1deg)) translate(0, calc(var(--translation) * 1.5%));
  }
}
```

### How It Works

1. **10 bars** arranged in a circle
2. Each bar rotates at a different angle (36° increments)
3. Each bar animates with a staggered delay (0.1s - 1.0s)
4. At 50% of the animation, bars translate outward slightly
5. Creates a smooth, pulsing rotation effect

## Styling

### CSS Classes

The component automatically injects these styles:

- `.spinner` - Main container
- `.spinner div` - Individual bars
- `.spinner div:nth-child(n)` - Specific bar styling with CSS variables

### CSS Variables Used

- `--delay` - Animation delay (0.1 to 1.0)
- `--rotation` - Rotation angle (36° to 360°)
- `--translation` - Translation distance (150%)

## Customization

### Change Animation Speed

Modify the animation duration in `components/ui/spinner.tsx`:

```tsx
// Current: 1s
animation: spinner-fzua35 1s calc(var(--delay) * 1s) infinite ease;

// Faster: 0.6s
animation: spinner-fzua35 0.6s calc(var(--delay) * 1s) infinite ease;

// Slower: 1.5s
animation: spinner-fzua35 1.5s calc(var(--delay) * 1s) infinite ease;
```

### Change Number of Bars

Add or remove `<div></div>` elements and update CSS:

```tsx
// Add 12th bar
<div></div>

// Add CSS for 12th bar
.spinner div:nth-child(11) {
  --delay: 1.1;
  --rotation: 330;
  --translation: 150;
}
```

### Change Bar Color

Use the `color` prop or `className`:

```tsx
// Via prop
<Spinner color="rgb(255, 0, 0)" />

// Via className
<Spinner className="text-red-500" />
```

## Performance

- **Lightweight:** ~2KB minified
- **Efficient:** Uses CSS animations (GPU accelerated)
- **No Dependencies:** Pure React + CSS
- **Lazy Loaded:** Styles injected only when component mounts

## Accessibility

- Uses `currentColor` for color inheritance
- Respects `prefers-reduced-motion` (can be enhanced)
- Semantic HTML structure
- No ARIA labels needed (decorative element)

## Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- IE11: ⚠️ CSS animations supported, but may need polyfills

## Examples

### Loading State in a Card

```tsx
import { Spinner } from "@/components/ui/spinner"
import { Card } from "@/components/ui/card"

export function LoadingCard() {
  return (
    <Card className="p-8 flex flex-col items-center gap-4">
      <Spinner size="lg" className="text-primary" />
      <p className="text-muted-foreground">Loading data...</p>
    </Card>
  )
}
```

### Loading Overlay

```tsx
export function LoadingOverlay() {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <Spinner size="lg" className="text-white" />
    </div>
  )
}
```

### Button Loading State

```tsx
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

export function SubmitButton({ isLoading }) {
  return (
    <Button disabled={isLoading}>
      {isLoading ? (
        <>
          <Spinner size="sm" className="text-primary-foreground" />
          <span className="ml-2">Loading...</span>
        </>
      ) : (
        "Submit"
      )}
    </Button>
  )
}
```

### Inline Loading

```tsx
export function InlineLoading() {
  return (
    <div className="flex items-center gap-2">
      <Spinner size="sm" className="text-primary" />
      <span>Processing...</span>
    </div>
  )
}
```

## Troubleshooting

### Spinner Not Showing

**Problem:** Spinner appears but doesn't animate

**Solution:** Check that styles are injected:
```tsx
// Verify in browser DevTools
// Look for <style> tag with spinner-fzua35 keyframes
```

### Wrong Color

**Problem:** Spinner color doesn't match

**Solution:** Use `className` instead of `color` prop:
```tsx
// ❌ Wrong
<Spinner color="text-primary" />

// ✅ Correct
<Spinner className="text-primary" />
```

### Size Not Working

**Problem:** Spinner size doesn't change

**Solution:** Use valid size values:
```tsx
// ✅ Valid
<Spinner size="sm" />
<Spinner size="md" />
<Spinner size="lg" />

// ❌ Invalid
<Spinner size="xl" />
<Spinner size="small" />
```

## Future Enhancements

- [ ] Add `prefers-reduced-motion` support
- [ ] Add more size options (xs, xl, 2xl)
- [ ] Add animation speed prop
- [ ] Add bar count customization
- [ ] Add gradient color support
- [ ] Add pulse/bounce variants

## Related Components

- `Button` - Often contains spinners
- `Card` - Common container for spinners
- `Dialog` - Can show spinners during submission

## See Also

- [Tailwind CSS Colors](https://tailwindcss.com/docs/customizing-colors)
- [CSS Animations](https://developer.mozilla.org/en-US/docs/Web/CSS/animation)
- [React Hooks](https://react.dev/reference/react/hooks)

---

**Last Updated:** 2024
**Version:** 1.0.0

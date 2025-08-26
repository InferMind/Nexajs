# Nexa Frontend Components

This directory contains all reusable components for the Nexa AI Business Hub frontend application.

## Structure

```
components/
├── ui/                 # Basic UI components
│   ├── Button.tsx     # Reusable button component
│   ├── Card.tsx       # Card container component
│   ├── Input.tsx      # Form input component
│   ├── Badge.tsx      # Status/label badge component
│   ├── Modal.tsx      # Modal dialog component
│   ├── SearchInput.tsx # Search input with clear functionality
│   ├── LoadingSpinner.tsx # Loading spinner component
│   ├── EmptyState.tsx # Empty state placeholder
│   ├── StatCard.tsx   # Statistics card component
│   ├── ProgressBar.tsx # Progress bar component
│   ├── AppIcon.tsx    # App icon with gradient background
│   └── index.ts       # Export all UI components
├── layout/            # Layout components
│   ├── PageHeader.tsx # Page header with title, description, actions
│   └── index.ts       # Export all layout components
└── README.md          # This file
```

## Usage Guidelines

### UI Components

#### Button
```tsx
import { Button } from '@/components/ui'

<Button variant="primary" size="lg" icon={Plus} loading={isLoading}>
  Create New
</Button>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'ghost' | 'outline'
- `size`: 'sm' | 'md' | 'lg'
- `loading`: boolean
- `icon`: LucideIcon
- `iconPosition`: 'left' | 'right'

#### Card
```tsx
import { Card } from '@/components/ui'

<Card variant="hover" padding="lg" onClick={handleClick}>
  <h3>Card Title</h3>
  <p>Card content...</p>
</Card>
```

**Props:**
- `variant`: 'default' | 'hover' | 'gradient' | 'glass'
- `padding`: 'sm' | 'md' | 'lg'
- `onClick`: () => void

#### Input
```tsx
import { Input } from '@/components/ui'

<Input
  label="Email Address"
  icon={Mail}
  placeholder="Enter your email"
  error={errors.email}
  helpText="We'll never share your email"
/>
```

**Props:**
- `label`: string
- `error`: string
- `helpText`: string
- `icon`: LucideIcon
- `iconPosition`: 'left' | 'right'

#### Badge
```tsx
import { Badge } from '@/components/ui'

<Badge variant="success" size="sm">
  Active
</Badge>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
- `size`: 'sm' | 'md' | 'lg'

#### Modal
```tsx
import { Modal } from '@/components/ui'

<Modal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  title="Modal Title"
  size="lg"
>
  <p>Modal content...</p>
</Modal>
```

**Props:**
- `isOpen`: boolean
- `onClose`: () => void
- `title`: string
- `size`: 'sm' | 'md' | 'lg' | 'xl'
- `showCloseButton`: boolean

#### SearchInput
```tsx
import { SearchInput } from '@/components/ui'

<SearchInput
  value={searchQuery}
  onChange={setSearchQuery}
  placeholder="Search apps..."
  onClear={() => setSearchQuery('')}
/>
```

#### StatCard
```tsx
import { StatCard } from '@/components/ui'

<StatCard
  title="Total Users"
  value="1,234"
  change="+12%"
  trend="up"
  icon={Users}
  gradient="from-blue-500 to-cyan-500"
  bgColor="bg-blue-50"
  textColor="text-blue-700"
/>
```

#### ProgressBar
```tsx
import { ProgressBar } from '@/components/ui'

<ProgressBar
  value={75}
  max={100}
  label="Progress"
  showValue={true}
  gradient="from-green-500 to-emerald-500"
/>
```

#### AppIcon
```tsx
import { AppIcon } from '@/components/ui'

<AppIcon
  icon={FileText}
  gradient="from-blue-500 to-purple-500"
  size="lg"
  hover={true}
/>
```

#### EmptyState
```tsx
import { EmptyState } from '@/components/ui'

<EmptyState
  icon={FileText}
  title="No documents found"
  description="Upload your first document to get started"
  actionLabel="Upload Document"
  onAction={() => setShowUpload(true)}
/>
```

### Layout Components

#### PageHeader
```tsx
import { PageHeader } from '@/components/layout'

<PageHeader
  title="Dashboard"
  description="Welcome to your AI business assistant"
  icon={LayoutDashboard}
  breadcrumbs={[
    { label: 'Home', href: '/' },
    { label: 'Dashboard' }
  ]}
  actions={
    <Button variant="primary" icon={Plus}>
      New Task
    </Button>
  }
/>
```

## Design System

### Colors
- **Primary**: Blue to Purple gradient (`from-blue-600 to-purple-600`)
- **Success**: Green (`text-green-600`, `bg-green-50`)
- **Warning**: Yellow/Orange (`text-yellow-600`, `bg-yellow-50`)
- **Error**: Red (`text-red-600`, `bg-red-50`)
- **Info**: Blue (`text-blue-600`, `bg-blue-50`)

### Typography
- **Font**: Inter (loaded in globals.css)
- **Headings**: Font weights 600-800
- **Body**: Font weight 400-500

### Spacing
- **Small**: 4px, 8px, 12px
- **Medium**: 16px, 20px, 24px
- **Large**: 32px, 40px, 48px

### Border Radius
- **Small**: 8px
- **Medium**: 12px
- **Large**: 16px, 20px

### Shadows
- **Small**: `shadow-sm`
- **Medium**: `shadow-md`
- **Large**: `shadow-lg`, `shadow-xl`

## Best Practices

1. **Consistency**: Always use components instead of custom styles
2. **Accessibility**: All components include proper ARIA labels and keyboard navigation
3. **Responsive**: Components are mobile-first and responsive by default
4. **Performance**: Components are optimized for React rendering
5. **Type Safety**: All components are fully typed with TypeScript

## Adding New Components

1. Create the component in the appropriate directory (`ui/` or `layout/`)
2. Add proper TypeScript interfaces
3. Include all necessary props with defaults
4. Add the component to the respective `index.ts` file
5. Update this README with usage examples
6. Test the component in different contexts

## Import Paths

Use the configured path aliases:
```tsx
import { Button, Card } from '@/components/ui'
import { PageHeader } from '@/components/layout'
```

This ensures clean imports and better maintainability.
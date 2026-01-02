# 📋 Trello Task Clone

A full-featured Trello Task Clone built with Next.js, TypeScript, and SCSS. This project demonstrates modern React development practices, state management, drag & drop functionality, and responsive design.

## 🎯 Features

### Core Functionality

- ✅ **Board Management**

  - Fixed demo board with editable title
  - Clean, intuitive board layout

- ✅ **List Management**

  - Create, edit, and delete lists
  - Horizontal drag & drop to reorder lists
  - Inline title editing

- ✅ **Card Management**

  - Create, edit, and delete cards
  - Vertical drag & drop within lists
  - Cross-list drag & drop functionality
  - Card comment count badges

- ✅ **Comments System**

  - View and add comments for each card
  - Modal interface for card details
  - Relative timestamp display
  - Edit card title from modal

- ✅ **Data Persistence**

  - All data stored in localStorage
  - Automatic save on every change
  - Data persists across browser sessions

- ✅ **Responsive Design**
  - Mobile-first approach
  - Optimized for desktop, tablet, and mobile devices
  - Touch-friendly drag & drop

## 🛠️ Technologies Used

### Core Framework & Language

- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type-safe JavaScript

### Styling

- **SCSS** - CSS preprocessor
  - Variables for theming
  - Mixins for reusable styles
  - Nesting for organized code
  - Partials for modular architecture

### State Management

- **Zustand** - Lightweight state management library

### Drag & Drop

- **@dnd-kit/core** - Core drag & drop functionality
- **@dnd-kit/sortable** - Sortable drag & drop
- **@dnd-kit/utilities** - Utility functions

### Package Manager

- **pnpm** - Fast, disk space efficient package manager

## 📦 Installation

### Prerequisites

- Node.js 18+
- pnpm (or npm/yarn)

### Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd trello-task-clone
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Run development server**

   ```bash
   pnpm dev
   ```

4. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
pnpm build
pnpm start
```

## 📁 Project Structure

```
trello-task-clone/
├── app/
│   ├── layout.tsx          # Root layout component
│   ├── page.tsx            # Main page component
│
├── features/                # Feature-based organization
│   ├── board/
│   │   ├── components/
│   │   │   ├── Board.tsx       # Main board container
│   │   │   └── BoardHeader.tsx # Board header with editable title
│   │   ├── hooks/
│   │   │   └── useBoardActions.ts
│   │   ├── services/
│   │   │   └── boardService.ts
│   │   └── types/
│   │
│   ├── lists/
│   │   ├── components/
│   │   │   ├── List.tsx        # List component (draggable)
│   │   │   ├── ListHeader.tsx  # List header with title and delete
│   │   │   ├── ListsContainer.tsx # Container for all lists
│   │   │   └── AddList.tsx     # Add new list component
│   │   ├── hooks/
│   │   │   └── useListActions.ts
│   │   ├── services/
│   │   │   └── listService.ts
│   │   └── types/
│   │
│   ├── cards/
│   │   ├── components/
│   │   │   ├── Card.tsx        # Card component (draggable)
│   │   │   ├── CardModal.tsx   # Modal for card details and comments
│   │   │   └── AddCard.tsx     # Add new card component
│   │   ├── hooks/
│   │   │   └── useCardActions.ts
│   │   ├── services/
│   │   │   └── cardService.ts
│   │   └── types/
│   │
│   └── comments/
│       ├── components/
│       │   ├── Comment.tsx     # Individual comment component
│       │   └── CommentList.tsx # List of comments
│       ├── hooks/
│       │   └── useCommentActions.ts
│       ├── services/
│       │   └── commentService.ts
│       └── types/
│
├── shared/                   # Shared code across features
│   ├── components/
│   │   └── ui/               # Reusable UI components
│   │       ├── BoardSkeleton.tsx
│   │       ├── ConfirmModal.tsx
│   │       ├── EmptyState.tsx
│   │       ├── ErrorDisplay.tsx
│   │       ├── LoadingSpinner.tsx
│   │       ├── SkeletonCard.tsx
│   │       └── SkeletonList.tsx
│   ├── hooks/
│   │   └── useBoard.ts       # Custom hook for board state
│   ├── services/
│   │   ├── storageService.ts      # localStorage service
│   │   └── boardInitializationService.ts
│   ├── store/
│   │   └── boardStore.ts     # Zustand store for state management
│   ├── types/
│   │   ├── index.ts          # TypeScript type definitions
│   │   └── store.ts          # Store-specific types
│   └── utils/
│       ├── helpers.ts        # Helper functions (ID generation, timestamps)
│       └── formatters.ts     # Formatting utilities (date formatting)
│
└── styles/                   # Styles organized by component
    ├── globals.scss          # Main SCSS file (imports all partials)
    ├── _variables.scss       # SCSS variables (colors, spacing, typography)
    ├── _mixins.scss          # SCSS mixins (buttons, inputs, responsive)
    ├── _base.scss            # Base/reset styles
    ├── components/
    │   ├── _board.scss       # Board component styles
    │   ├── _list.scss        # List component styles
    │   ├── _card.scss        # Card component styles
    │   ├── _modal.scss       # Modal component styles
    │   └── _skeleton.scss    # Skeleton component styles
    └── utils/
        ├── _layout.scss      # Layout utilities
        └── _utilities.scss   # General utilities
```

## 🎨 Design & Styling

### Color Palette

- Primary: `#0079bf` (Trello blue)
- Background: `#f4f5f7` (Light gray)
- Text: `#172b4d` (Dark blue)
- Secondary Text: `#6b778c` (Gray)

### Responsive Breakpoints

- Mobile: `< 768px`
- Tablet: `768px - 1024px`
- Desktop: `> 1024px`

### Styling Approach

- SCSS-only (no Tailwind CSS)
- BEM-inspired class naming
- Mobile-first responsive design
- Custom scrollbar styling
- Smooth transitions and animations

## 🔧 Key Implementation Details

### State Management

The application uses Zustand for state management with a single store (`boardStore`) that manages:

- Board state
- Lists (stored as objects with IDs as keys)
- Cards (stored as objects with IDs as keys)
- Loading and error states

### Drag & Drop

Implemented using @dnd-kit:

- **Lists**: Horizontal drag & drop using `horizontalListSortingStrategy`
- **Cards**: Vertical drag & drop using `verticalListSortingStrategy`
- Supports dragging cards between different lists
- Visual feedback during drag operations

### Data Persistence

- All data stored in `localStorage` with key `trello-clone-board`
- Data structure: `{ board, lists: [], cards: [] }`
- Automatic save on every state change
- SSR-safe implementation (checks for `window` object)

### Component Architecture

- **Separation of Concerns**: UI components, business logic, and state management are separated
- **Reusability**: Common UI patterns extracted into reusable components
- **Type Safety**: Full TypeScript coverage with strict types
- **Accessibility**: ARIA labels, keyboard navigation support

## 📝 Usage Guide

### Creating a List

1. Click the "+ Add another list" button at the end of the board
2. Enter a list title
3. Click "Add List" or press Enter

### Editing a List Title

1. Click on the list title
2. Edit the text inline
3. Press Enter or click outside to save
4. Press Escape to cancel

### Deleting a List

1. Click the "×" button in the list header
2. Confirm deletion in the dialog

### Creating a Card

1. Click "+ Add a card" at the bottom of a list
2. Enter card title
3. Click "Add Card" or press Enter

### Editing a Card Title

1. Click on the card title (inline editing)
2. Or click the card to open modal and edit from there

### Moving Cards

- **Within a list**: Drag the card up or down
- **Between lists**: Drag the card to another list
- **Drag lists**: Drag list headers to reorder horizontally

### Adding Comments

1. Click on a card to open the modal
2. Scroll to the comments section
3. Type your comment
4. Click "Add Comment" or press Ctrl/Cmd + Enter

### Editing Board Title

1. Click on the board title at the top
2. Edit inline
3. Press Enter or click outside to save

## 🧪 Testing

The application has been tested for:

- ✅ Board title editing
- ✅ List CRUD operations (Create, Read, Update, Delete)
- ✅ Card CRUD operations
- ✅ Drag & drop functionality (lists and cards)
- ✅ Comments functionality
- ✅ Modal interactions (open, close, keyboard)
- ✅ localStorage persistence
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Cross-browser compatibility

## 🚀 Deployment

### Build

```bash
pnpm build
```

### Start Production Server

```bash
pnpm start
```

### Deploy to Vercel

The easiest way to deploy is using [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import project in Vercel
3. Deploy (automatic builds on push)

## 📄 License

This project is for educational/demonstration purposes.

## 👨‍💻 Development Notes

### Code Quality

- TypeScript strict mode enabled
- SOLID principles applied
- DRY (Don't Repeat Yourself) principle
- Clean code practices
- Comprehensive error handling
- SSR-safe implementations

### Performance Considerations

- Efficient state updates
- Optimized re-renders
- LocalStorage operations are synchronous but lightweight
- Drag & drop with activation constraints for better UX

### Future Enhancements (Optional)

- [ ] Card due dates and labels
- [ ] Card attachments
- [ ] User authentication
- [ ] Multiple boards
- [ ] Card archiving
- [ ] Search functionality
- [ ] Keyboard shortcuts
- [ ] Dark mode

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [@dnd-kit Documentation](https://docs.dndkit.com)
- [SCSS Documentation](https://sass-lang.com/documentation)

---

**Built with ❤️ using Next.js, TypeScript, and SCSS**

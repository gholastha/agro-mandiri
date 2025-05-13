import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ViewMode = 'grid' | 'list';
type SortDirection = 'asc' | 'desc';

interface FilterOptions {
  category?: string | null;
  query?: string;
  showInactive?: boolean;
}

// Define the state interface
interface ProductPreferencesState {
  // View preferences
  viewMode: ViewMode;
  // Sorting preferences
  sortField: string;
  sortDirection: SortDirection;
  // Filter preferences
  categoryFilter: string | null;
  searchQuery: string;
  showInactiveProducts: boolean;
}

// Define the actions interface
interface ProductPreferencesActions {
  setViewMode: (mode: ViewMode) => void;
  setSorting: (field: string, direction?: SortDirection) => void;
  setFilter: (filter: FilterOptions) => void;
  resetFilters: () => void;
}

// Combine state and actions
type ProductPreferencesStore = ProductPreferencesState & ProductPreferencesActions;

// Create the store with persist middleware
export const useProductPreferences = create<ProductPreferencesStore>()(
  persist(
    (set) => ({
      // Initial view mode is grid
      viewMode: 'grid' as ViewMode,
      
      // Initial sorting
      sortField: 'name',
      sortDirection: 'asc' as SortDirection,
      
      // Initial filter values
      categoryFilter: null,
      searchQuery: '',
      showInactiveProducts: false,
      
      // Actions
      setViewMode: (mode: ViewMode) => set({ viewMode: mode }),
      
      setSorting: (field: string, direction?: SortDirection) => {
        set((state) => {
          // If clicking the same field, toggle direction
          if (field === state.sortField && !direction) {
            return { 
              sortField: field, 
              sortDirection: state.sortDirection === 'asc' ? 'desc' : 'asc'
            };
          }
          // Otherwise set to the new field and direction (or default to asc)
          return { 
            sortField: field, 
            sortDirection: direction || 'asc'
          };
        });
      },
      
      setFilter: (filter: FilterOptions) => 
        set((state) => ({
          categoryFilter: filter.category !== undefined ? filter.category : state.categoryFilter,
          searchQuery: filter.query !== undefined ? filter.query : state.searchQuery,
          showInactiveProducts: filter.showInactive !== undefined ? filter.showInactive : state.showInactiveProducts,
        })),
        
      resetFilters: () => set({
        categoryFilter: null,
        searchQuery: '',
        showInactiveProducts: false,
      }),
    }),
    {
      name: 'agro-mandiri-product-preferences',
    }
  )
);

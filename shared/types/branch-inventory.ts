export interface BranchInventory {
  id: string; // UUID
  branch_id: string; // Branch ID (UUID)
  product_id: string; // Product ID (UUID)
  quantity_on_hand: number;
  quantity_available: number;
  quantity_reserved: number;
  quantity_damaged: number;
  min_stock_level: number;
  max_stock_level?: number | null;
  reorder_point?: number | null;
  reorder_quantity?: number | null;
  unit_cost?: number | null; // OMR
  last_cost?: number | null; // OMR
  average_cost?: number | null; // OMR
  shelf_location?: string | null;
  storage_location?: string | null;
  last_received_date?: Date | null;
  last_sold_date?: Date | null;
  last_counted_date?: Date | null;
  is_active: boolean;
  is_featured: boolean;
  needs_reorder: boolean;
  total_sold: number;
  total_received: number;
  notes?: string | null;
  created_at: Date;
  updated_at: Date;
}

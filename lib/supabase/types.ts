export type PriceType = 'free' | 'symbolic' | 'fixed' | 'negotiable'
export type SymbolicPrice = 'cokolada' | 'kava' | 'pivo' | 'banany' | 'vlastni'

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          full_name: string
          city: string
          phone: string | null
          avatar_url: string | null
          bio: string | null
          preferred_transfer_location: string | null
          is_verified: boolean
          is_admin: boolean
          rating_avg: number
          rating_count: number
          created_at: string
        }
        Insert: {
          id: string
          full_name: string
          city?: string
          phone?: string | null
          avatar_url?: string | null
          bio?: string | null
          preferred_transfer_location?: string | null
          is_verified?: boolean
          is_admin?: boolean
          rating_avg?: number
          rating_count?: number
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['users']['Insert']>
      }
      listings: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string
          category: string
          price_type: PriceType
          price_amount: number | null
          price_text: string | null
          photos: string[]
          transfer_location: string | null
          location_lat: number | null
          location_lng: number | null
          is_active: boolean
          is_sold: boolean
          expires_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description: string
          category: string
          price_type: PriceType
          price_amount?: number | null
          price_text?: string | null
          photos?: string[]
          transfer_location?: string | null
          location_lat?: number | null
          location_lng?: number | null
          is_active?: boolean
          is_sold?: boolean
          expires_at?: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['listings']['Insert']>
      }
      comments: {
        Row: {
          id: string
          listing_id: string
          user_id: string
          text: string
          created_at: string
        }
        Insert: {
          id?: string
          listing_id: string
          user_id: string
          text: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['comments']['Insert']>
      }
      ratings: {
        Row: {
          id: string
          rater_id: string
          rated_id: string
          listing_id: string | null
          score: number
          comment: string | null
          created_at: string
        }
        Insert: {
          id?: string
          rater_id: string
          rated_id: string
          listing_id?: string | null
          score: number
          comment?: string | null
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['ratings']['Insert']>
      }
    }
    Views: {}
    Functions: {}
    Enums: {
      price_type_enum: PriceType
      symbolic_price_enum: SymbolicPrice
    }
  }
}

export type UserRow = Database['public']['Tables']['users']['Row']
export type ListingRow = Database['public']['Tables']['listings']['Row']
export type RatingRow = Database['public']['Tables']['ratings']['Row']

export type PostRow = {
  id: string
  user_id: string
  title: string
  text: string
  created_at: string
}

export type ReplyRow = {
  id: string
  post_id: string
  user_id: string
  text: string
  created_at: string
}

export type PostWithUser = PostRow & {
  users: Pick<UserRow, 'full_name' | 'avatar_url'>
  replies: { count: number }[]
}

export type ReplyWithUser = ReplyRow & {
  users: Pick<UserRow, 'full_name' | 'avatar_url'>
}
export type CommentRow = Database['public']['Tables']['comments']['Row']

export type CommentWithUser = CommentRow & {
  users: Pick<UserRow, 'full_name' | 'avatar_url'>
}

// Listing s připojeným profilem uživatele
export type ListingWithUser = ListingRow & {
  users: Pick<UserRow, 'id' | 'full_name' | 'avatar_url' | 'rating_avg' | 'rating_count' | 'city' | 'phone' | 'is_verified'>
}

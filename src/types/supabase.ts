
export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            categories: {
                Row: {
                    id: string
                    name: string
                    slug: string
                    sort_order: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    slug: string
                    sort_order?: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    slug?: string
                    sort_order?: number
                    created_at?: string
                }
            }
            listings: {
                Row: {
                    id: string
                    user_id: string
                    category_id: string
                    title: string
                    description: string
                    price: number | null
                    is_free: boolean
                    province: string
                    city: string
                    youtube_url: string | null
                    status: 'published' | 'paused' | 'deleted'
                    featured_until: string | null
                    premium_until: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id?: string
                    category_id: string
                    title: string
                    description: string
                    price?: number | null
                    is_free?: boolean
                    province: string
                    city: string
                    youtube_url?: string | null
                    status?: 'published' | 'paused' | 'deleted'
                    featured_until?: string | null
                    premium_until?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    category_id?: string
                    title?: string
                    description?: string
                    price?: number | null
                    is_free?: boolean
                    province?: string
                    city?: string
                    youtube_url?: string | null
                    status?: 'published' | 'paused' | 'deleted'
                    featured_until?: string | null
                    premium_until?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            listing_images: {
                Row: {
                    id: string
                    listing_id: string
                    storage_path: string
                    sort_order: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    listing_id: string
                    storage_path: string
                    sort_order?: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    listing_id?: string
                    storage_path?: string
                    sort_order?: number
                    created_at?: string
                }
            }
        }
    }
}

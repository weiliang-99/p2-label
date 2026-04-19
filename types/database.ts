export type Platform = 'facebook' | 'instagram' | 'youtube' | 'tiktok'
export type PostStatus = 'draft' | 'pending_review' | 'approved' | 'scheduled' | 'published' | 'failed'
export type UserRole = 'owner' | 'manager' | 'editor' | 'viewer'
export type FileType = 'image' | 'video' | 'gif'
export type ApprovalAction = 'submitted' | 'approved' | 'rejected' | 'revision_requested'

export interface Database {
  public: {
    Tables: {
      teams: {
        Row: {
          id: string
          name: string
          brand_name: string
          industry: string
          primary_color: string
          plan: 'free' | 'pro' | 'enterprise'
          created_at: string
        }
        Insert: Omit<teams_Row, 'id' | 'created_at'>
        Update: Partial<Omit<teams_Row, 'id'>>
      }
      profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          role: UserRole
          team_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<profiles_Row, 'created_at' | 'updated_at'>
        Update: Partial<Omit<profiles_Row, 'id'>>
      }
      social_accounts: {
        Row: {
          id: string
          team_id: string
          platform: Platform
          account_name: string
          account_id: string
          access_token: string | null
          is_connected: boolean
          created_at: string
        }
        Insert: Omit<social_accounts_Row, 'id' | 'created_at'>
        Update: Partial<Omit<social_accounts_Row, 'id'>>
      }
      posts: {
        Row: {
          id: string
          team_id: string
          author_id: string
          title: string
          caption_zh: string | null
          caption_en: string | null
          media_urls: string[]
          platforms: string[]
          status: PostStatus
          scheduled_at: string | null
          published_at: string | null
          is_recurring: boolean
          recurrence_rule: Record<string, unknown> | null
          template_id: string | null
          category_id: string | null
          hashtag_set_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<posts_Row, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<posts_Row, 'id'>>
      }
      post_analytics: {
        Row: {
          id: string
          post_id: string
          platform: Platform
          impressions: number
          reach: number
          likes: number
          comments: number
          shares: number
          saves: number
          clicks: number
          engagement_rate: number
          recorded_at: string
        }
        Insert: Omit<post_analytics_Row, 'id'>
        Update: Partial<Omit<post_analytics_Row, 'id'>>
      }
      content_templates: {
        Row: {
          id: string
          team_id: string
          name: string
          description: string | null
          caption_template_zh: string | null
          caption_template_en: string | null
          platforms: string[]
          category_id: string | null
          created_at: string
        }
        Insert: Omit<content_templates_Row, 'id' | 'created_at'>
        Update: Partial<Omit<content_templates_Row, 'id'>>
      }
      content_categories: {
        Row: {
          id: string
          team_id: string
          name_zh: string
          name_en: string
          color: string
          icon: string | null
          sort_order: number
        }
        Insert: Omit<content_categories_Row, 'id'>
        Update: Partial<Omit<content_categories_Row, 'id'>>
      }
      hashtag_sets: {
        Row: {
          id: string
          team_id: string
          name: string
          hashtags: string[]
          platform: string | null
          usage_count: number
          created_at: string
        }
        Insert: Omit<hashtag_sets_Row, 'id' | 'created_at'>
        Update: Partial<Omit<hashtag_sets_Row, 'id'>>
      }
      media_library: {
        Row: {
          id: string
          team_id: string
          file_name: string
          file_path: string
          file_type: FileType
          file_size: number
          width: number | null
          height: number | null
          thumbnail_url: string | null
          tags: string[]
          uploaded_by: string
          created_at: string
        }
        Insert: Omit<media_library_Row, 'id' | 'created_at'>
        Update: Partial<Omit<media_library_Row, 'id'>>
      }
      approval_logs: {
        Row: {
          id: string
          post_id: string
          action: ApprovalAction
          actor_id: string
          comment: string | null
          created_at: string
        }
        Insert: Omit<approval_logs_Row, 'id' | 'created_at'>
        Update: Partial<Omit<approval_logs_Row, 'id'>>
      }
    }
  }
}

// Shorthand aliases used above
type teams_Row = Database['public']['Tables']['teams']['Row']
type profiles_Row = Database['public']['Tables']['profiles']['Row']
type social_accounts_Row = Database['public']['Tables']['social_accounts']['Row']
type posts_Row = Database['public']['Tables']['posts']['Row']
type post_analytics_Row = Database['public']['Tables']['post_analytics']['Row']
type content_templates_Row = Database['public']['Tables']['content_templates']['Row']
type content_categories_Row = Database['public']['Tables']['content_categories']['Row']
type hashtag_sets_Row = Database['public']['Tables']['hashtag_sets']['Row']
type media_library_Row = Database['public']['Tables']['media_library']['Row']
type approval_logs_Row = Database['public']['Tables']['approval_logs']['Row']

// Convenience re-exports
export type Team = Database['public']['Tables']['teams']['Row']
export type Profile = Database['public']['Tables']['profiles']['Row']
export type SocialAccount = Database['public']['Tables']['social_accounts']['Row']
export type Post = Database['public']['Tables']['posts']['Row']
export type PostAnalytics = Database['public']['Tables']['post_analytics']['Row']
export type ContentTemplate = Database['public']['Tables']['content_templates']['Row']
export type ContentCategory = Database['public']['Tables']['content_categories']['Row']
export type HashtagSet = Database['public']['Tables']['hashtag_sets']['Row']
export type MediaFile = Database['public']['Tables']['media_library']['Row']
export type ApprovalLog = Database['public']['Tables']['approval_logs']['Row']

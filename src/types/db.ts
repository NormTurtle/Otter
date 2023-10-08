import { Database } from './supabase';

export type Bookmark = Omit<
  Database['public']['Tables']['bookmarks']['Row'],
  'tweet'
> & {
  tweet?: {
    text: string;
    username: string;
    url: string;
  };
};
export type BookmarkType = Database['public']['Enums']['type'];
export type BookmarkStatus = Database['public']['Enums']['status'];
export type Tweet = Database['public']['Tables']['tweets']['Row'];
export type Toot = Database['public']['Tables']['toots']['Row'];
export type TweetUrls = {
  url: string;
  expanded_url: string;
  display_url: string;
  indices: number[];
}[];
export type TootUrls = {
  type: string;
  isLink: boolean;
  href: string;
  end: number;
  start: number;
}[];

export interface BookmarkFormValues
  extends Omit<
    Bookmark,
    | 'id'
    | 'created_at'
    | 'modified_at'
    | 'collection'
    | 'click_count'
    | 'excerpt'
    | 'feed'
  > {
  id?: string;
}

export type UserProfile = Omit<
  Database['public']['Tables']['profiles']['Row'],
  'settings'
> & {
  settings: {
    uiState: {
      tags: boolean;
      types: boolean;
      groupByDate: boolean;
      pinnedTags: string[];
      topTags: boolean;
      topTagsLimit: number;
    };
  };
};

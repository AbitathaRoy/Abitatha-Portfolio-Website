import { supabase } from '../lib/supabase';

export interface SiteContent {
  id: string;
  section: string;
  content_key: string;
  content_value: string;
  content_type: 'text' | 'number' | 'url' | 'json';
  created_at: string;
  updated_at: string;
}

export interface PageSetting {
  id: string;
  page: string;
  setting_key: string;
  setting_value: string;
  setting_type: 'text' | 'boolean' | 'number' | 'json';
  created_at: string;
  updated_at: string;
}

export class ContentService {
  // Get content by section
  static async getContentBySection(section: string): Promise<Record<string, any>> {
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .eq('section', section);

      if (error) {
        console.error('Error fetching content:', error);
        return {};
      }

      // Convert to key-value object
      const content: Record<string, any> = {};
      data?.forEach((item) => {
        let value = item.content_value;
        
        // Parse based on content type
        if (item.content_type === 'number') {
          value = parseInt(value, 10);
        } else if (item.content_type === 'json') {
          try {
            value = JSON.parse(value);
          } catch (e) {
            console.error('Error parsing JSON content:', e);
          }
        }
        
        content[item.content_key] = value;
      });

      return content;
    } catch (error) {
      console.error('Error in getContentBySection:', error);
      return {};
    }
  }

  // Update content
  static async updateContent(
    section: string,
    contentKey: string,
    value: any,
    contentType: 'text' | 'number' | 'url' | 'json' = 'text'
  ): Promise<boolean> {
    try {
      let contentValue = value;
      
      // Stringify if JSON type
      if (contentType === 'json') {
        contentValue = JSON.stringify(value);
      } else {
        contentValue = String(value);
      }

      const { error } = await supabase
        .from('site_content')
        .upsert({
          section,
          content_key: contentKey,
          content_value: contentValue,
          content_type: contentType,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'section,content_key'
        });

      if (error) {
        console.error('Error updating content:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in updateContent:', error);
      return false;
    }
  }

  // Get page settings
  static async getPageSettings(page: string): Promise<Record<string, any>> {
    try {
      const { data, error } = await supabase
        .from('page_settings')
        .select('*')
        .eq('page', page);

      if (error) {
        console.error('Error fetching page settings:', error);
        return {};
      }

      // Convert to key-value object
      const settings: Record<string, any> = {};
      data?.forEach((item) => {
        let value = item.setting_value;
        
        // Parse based on setting type
        if (item.setting_type === 'number') {
          value = parseInt(value, 10);
        } else if (item.setting_type === 'boolean') {
          value = value === 'true';
        } else if (item.setting_type === 'json') {
          try {
            value = JSON.parse(value);
          } catch (e) {
            console.error('Error parsing JSON setting:', e);
          }
        }
        
        settings[item.setting_key] = value;
      });

      return settings;
    } catch (error) {
      console.error('Error in getPageSettings:', error);
      return {};
    }
  }

  // Update page setting
  static async updatePageSetting(
    page: string,
    settingKey: string,
    value: any,
    settingType: 'text' | 'boolean' | 'number' | 'json' = 'text'
  ): Promise<boolean> {
    try {
      let settingValue = value;
      
      // Convert based on setting type
      if (settingType === 'boolean') {
        settingValue = String(Boolean(value));
      } else if (settingType === 'json') {
        settingValue = JSON.stringify(value);
      } else {
        settingValue = String(value);
      }

      const { error } = await supabase
        .from('page_settings')
        .upsert({
          page,
          setting_key: settingKey,
          setting_value: settingValue,
          setting_type: settingType,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'page,setting_key'
        });

      if (error) {
        console.error('Error updating page setting:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in updatePageSetting:', error);
      return false;
    }
  }

  // Get all content for admin editing
  static async getAllContent(): Promise<SiteContent[]> {
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .order('section', { ascending: true })
        .order('content_key', { ascending: true });

      if (error) {
        console.error('Error fetching all content:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAllContent:', error);
      return [];
    }
  }

  // Get all page settings for admin editing
  static async getAllPageSettings(): Promise<PageSetting[]> {
    try {
      const { data, error } = await supabase
        .from('page_settings')
        .select('*')
        .order('page', { ascending: true })
        .order('setting_key', { ascending: true });

      if (error) {
        console.error('Error fetching all page settings:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAllPageSettings:', error);
      return [];
    }
  }
}
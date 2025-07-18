import React, { useState, useEffect } from 'react';
import { X, Save, Loader, Edit, Plus, Trash2 } from 'lucide-react';
import { ContentService, SiteContent, PageSetting } from '../services/contentService';

interface ContentEditorProps {
  onClose: () => void;
  section?: string; // If provided, only edit this section
  page?: string; // If provided, only edit this page
}

const ContentEditor: React.FC<ContentEditorProps> = ({ onClose, section, page }) => {
  const [content, setContent] = useState<SiteContent[]>([]);
  const [pageSettings, setPageSettings] = useState<PageSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'settings'>('content');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [allContent, allSettings] = await Promise.all([
        ContentService.getAllContent(),
        ContentService.getAllPageSettings()
      ]);

      // Filter by section/page if specified
      const filteredContent = section 
        ? allContent.filter(c => c.section === section)
        : allContent;
      
      const filteredSettings = page
        ? allSettings.filter(s => s.page === page)
        : allSettings;

      setContent(filteredContent);
      setPageSettings(filteredSettings);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContentUpdate = async (item: SiteContent, newValue: string) => {
    setSaving(true);
    try {
      const success = await ContentService.updateContent(
        item.section,
        item.content_key,
        newValue,
        item.content_type
      );
      
      if (success) {
        // Update local state
        setContent(prev => prev.map(c => 
          c.id === item.id 
            ? { ...c, content_value: newValue }
            : c
        ));
      }
    } catch (error) {
      console.error('Error updating content:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleSettingUpdate = async (item: PageSetting, newValue: string) => {
    setSaving(true);
    try {
      const success = await ContentService.updatePageSetting(
        item.page,
        item.setting_key,
        newValue,
        item.setting_type
      );
      
      if (success) {
        // Update local state
        setPageSettings(prev => prev.map(s => 
          s.id === item.id 
            ? { ...s, setting_value: newValue }
            : s
        ));
      }
    } catch (error) {
      console.error('Error updating setting:', error);
    } finally {
      setSaving(false);
    }
  };

  const groupedContent = content.reduce((acc, item) => {
    if (!acc[item.section]) acc[item.section] = [];
    acc[item.section].push(item);
    return acc;
  }, {} as Record<string, SiteContent[]>);

  const groupedSettings = pageSettings.reduce((acc, item) => {
    if (!acc[item.page]) acc[item.page] = [];
    acc[item.page].push(item);
    return acc;
  }, {} as Record<string, PageSetting[]>);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 flex items-center gap-3">
          <Loader className="w-6 h-6 animate-spin text-blue-600" />
          <span>Loading content...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Edit className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">
              {section ? `Edit ${section}` : page ? `Edit ${page} Page` : 'Content Editor'}
            </h2>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Tabs */}
        {!section && !page && (
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('content')}
                className={`px-6 py-3 font-medium transition-colors ${
                  activeTab === 'content'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Site Content
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`px-6 py-3 font-medium transition-colors ${
                  activeTab === 'settings'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Page Settings
              </button>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)] p-6">
          {(activeTab === 'content' || section) && (
            <div className="space-y-8">
              {Object.entries(groupedContent).map(([sectionName, items]) => (
                <div key={sectionName} className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 capitalize">
                    {sectionName.replace(/_/g, ' ')}
                  </h3>
                  
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="bg-white rounded-lg p-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {item.content_key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          <span className="ml-2 text-xs text-gray-500">({item.content_type})</span>
                        </label>
                        
                        {item.content_type === 'text' && item.content_value.length > 100 ? (
                          <textarea
                            value={item.content_value}
                            onChange={(e) => handleContentUpdate(item, e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            disabled={saving}
                          />
                        ) : (
                          <input
                            type={item.content_type === 'number' ? 'number' : 'text'}
                            value={item.content_value}
                            onChange={(e) => handleContentUpdate(item, e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            disabled={saving}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {(activeTab === 'settings' || page) && (
            <div className="space-y-8">
              {Object.entries(groupedSettings).map(([pageName, items]) => (
                <div key={pageName} className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 capitalize">
                    {pageName} Page Settings
                  </h3>
                  
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="bg-white rounded-lg p-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {item.setting_key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          <span className="ml-2 text-xs text-gray-500">({item.setting_type})</span>
                        </label>
                        
                        {item.setting_type === 'boolean' ? (
                          <select
                            value={item.setting_value}
                            onChange={(e) => handleSettingUpdate(item, e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            disabled={saving}
                          >
                            <option value="true">True</option>
                            <option value="false">False</option>
                          </select>
                        ) : (
                          <input
                            type={item.setting_type === 'number' ? 'number' : 'text'}
                            value={item.setting_value}
                            onChange={(e) => handleSettingUpdate(item, e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            disabled={saving}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Status */}
        {saving && (
          <div className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-lg">
            <Loader className="w-4 h-4 animate-spin" />
            <span>Saving...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentEditor;
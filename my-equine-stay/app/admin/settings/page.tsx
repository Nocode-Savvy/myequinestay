"use client";

import { useState } from "react";
import { Save, CheckCircle2, Sliders, Shield, Palette, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/config";

export default function AdminSettingsPage() {
  const [siteName, setSiteName] = useState<string>(siteConfig.name);
  const [tagline, setTagline] = useState<string>(siteConfig.tagline);
  const [contactEmail, setContactEmail] = useState(siteConfig.contactEmail);
  const [supportEmail, setSupportEmail] = useState(siteConfig.supportEmail);
  const [primaryColor, setPrimaryColor] = useState("#1F3A2B");
  const [accentColor, setAccentColor] = useState("#E1B534");
  const [shelterName, setShelterName] = useState("Florida Equine Rescue Alliance");
  const [shelterUrl, setShelterUrl] = useState("https://example.com");

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="font-serif font-bold text-2xl text-[#1F3A2B]">Platform &amp; Branding Settings</h1>
        <p className="text-xs text-[#6E7771] mt-0.5">
          Configure branding, colors, contact emails, and partner charities.
        </p>
      </div>

      {saved && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-2xl flex items-center gap-3 text-xs text-green-800">
          <CheckCircle2 size={18} className="text-green-600 flex-shrink-0" />
          <span><strong>Settings updated successfully:</strong> Changes saved to platform settings.</span>
        </div>
      )}

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* General Branding Section */}
        <div className="bg-white p-6 rounded-2xl border border-[#E5E0D6] shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E5E0D6]">
            <Sliders size={18} className="text-[#E1B534]" />
            <h2 className="font-serif font-bold text-base text-[#1B221E]">Brand Identity</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1B221E] mb-1.5">Platform Site Name</label>
              <input
                type="text"
                required
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="input-base text-sm border-[#E5E0D6] focus:border-[#1F3A2B]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1B221E] mb-1.5">Tagline</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="input-base text-sm border-[#E5E0D6] focus:border-[#1F3A2B]"
              />
            </div>
          </div>
        </div>

        {/* Color Palette Customization */}
        <div className="bg-white p-6 rounded-2xl border border-[#E5E0D6] shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E5E0D6]">
            <Palette size={18} className="text-[#E1B534]" />
            <h2 className="font-serif font-bold text-base text-[#1B221E]">Theme Colors</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1B221E] mb-1.5">Primary Forest Green</label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-10 h-10 rounded-lg border border-[#E5E0D6] cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="input-base text-sm font-mono flex-1 border-[#E5E0D6]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1B221E] mb-1.5">Accent Gold / CTA Color</label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-10 h-10 rounded-lg border border-[#E5E0D6] cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="input-base text-sm font-mono flex-1 border-[#E5E0D6]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Communication Channels */}
        <div className="bg-white p-6 rounded-2xl border border-[#E5E0D6] shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E5E0D6]">
            <Shield size={18} className="text-[#E1B534]" />
            <h2 className="font-serif font-bold text-base text-[#1B221E]">Contact &amp; Support Channels</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1B221E] mb-1.5">General Inquiry Email</label>
              <input
                type="email"
                required
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="input-base text-sm border-[#E5E0D6]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1B221E] mb-1.5">Owner Support Email</label>
              <input
                type="email"
                required
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="input-base text-sm border-[#E5E0D6]"
              />
            </div>
          </div>
        </div>

        {/* Shelter Partner Giving Section */}
        <div className="bg-white p-6 rounded-2xl border border-[#E5E0D6] shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E5E0D6]">
            <Heart size={18} className="text-red-500" />
            <h2 className="font-serif font-bold text-base text-[#1B221E]">Equine Shelter Partner</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1B221E] mb-1.5">Rescue Organization Name</label>
              <input
                type="text"
                value={shelterName}
                onChange={(e) => setShelterName(e.target.value)}
                className="input-base text-sm border-[#E5E0D6]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1B221E] mb-1.5">Partner Website URL</label>
              <input
                type="url"
                value={shelterUrl}
                onChange={(e) => setShelterUrl(e.target.value)}
                className="input-base text-sm border-[#E5E0D6]"
              />
            </div>
          </div>
        </div>

        <Button type="submit" variant="gold" size="lg" isLoading={saving}>
          <Save size={16} /> Save Platform Configuration
        </Button>
      </form>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Save, CheckCircle2, Sliders, Palette, Heart, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/config";
import { createClient } from "@/lib/supabase/client";

export default function AdminSettingsPage() {
  const supabase = createClient();

  const [siteName, setSiteName] = useState<string>(siteConfig.name);
  const [tagline, setTagline] = useState<string>(siteConfig.tagline);
  const [contactEmail, setContactEmail] = useState(siteConfig.contactEmail);
  const [supportEmail, setSupportEmail] = useState(siteConfig.supportEmail);
  const [primaryColor, setPrimaryColor] = useState("#1F3A2B");
  const [accentColor, setAccentColor] = useState("#E1B534");
  const [shelterName, setShelterName] = useState("Florida Equine Rescue Alliance");
  const [shelterUrl, setShelterUrl] = useState("https://example.com");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        setLoading(true);
        const { data, error } = await supabase.from("settings").select("key, value");

        if (!error && data) {
          data.forEach((item: { key: string; value: string }) => {
            switch (item.key) {
              case "site_name":
                setSiteName(item.value);
                break;
              case "site_tagline":
                setTagline(item.value);
                break;
              case "contact_email":
                setContactEmail(item.value);
                break;
              case "support_email":
                setSupportEmail(item.value);
                break;
              case "primary_color":
                setPrimaryColor(item.value);
                break;
              case "accent_color":
                setAccentColor(item.value);
                break;
              case "shelter_name":
                setShelterName(item.value);
                break;
              case "shelter_url":
                setShelterUrl(item.value);
                break;
            }
          });
        }
      } catch (err) {
        console.error("Failed to load settings from Supabase:", err);
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, [supabase]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const updates = [
        { key: "site_name", value: siteName },
        { key: "site_tagline", value: tagline },
        { key: "contact_email", value: contactEmail },
        { key: "support_email", value: supportEmail },
        { key: "primary_color", value: primaryColor },
        { key: "accent_color", value: accentColor },
        { key: "shelter_name", value: shelterName },
        { key: "shelter_url", value: shelterUrl },
      ];

      for (const item of updates) {
        await (supabase.from("settings") as any)
          .upsert({ key: item.key, value: item.value }, { onConflict: "key" });
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3500);
    } catch (err) {
      console.error("Failed to save settings:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif font-bold text-2xl text-[#1F3A2B]">Platform &amp; Branding Settings</h1>
          <p className="text-xs text-[#6E7771] mt-0.5">
            Configure live branding, contact emails, and charitable partners stored in database settings.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium self-start">
          <span className="size-2 rounded-full bg-emerald-500" />
          Database Synced
        </div>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-xs text-emerald-800 animate-in fade-in">
          <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0" />
          <span><strong>Settings updated successfully:</strong> Changes saved to live database settings table.</span>
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
              <label className="block text-xs font-semibold text-[#1B221E] mb-1.5">Accent Equestrian Gold</label>
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

        {/* Communication Emails */}
        <div className="bg-white p-6 rounded-2xl border border-[#E5E0D6] shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E5E0D6]">
            <h2 className="font-serif font-bold text-base text-[#1B221E]">Contact &amp; Support Inboxes</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1B221E] mb-1.5">General Inquiries Email</label>
              <input
                type="email"
                required
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="input-base text-sm border-[#E5E0D6]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1B221E] mb-1.5">Help &amp; Support Email</label>
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

        {/* Equine Shelter Giving */}
        <div className="bg-white p-6 rounded-2xl border border-[#E5E0D6] shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E5E0D6]">
            <Heart size={18} className="text-red-500" />
            <h2 className="font-serif font-bold text-base text-[#1B221E]">Equine Giving / Shelter Partner</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1B221E] mb-1.5">Partner Charity Name</label>
              <input
                type="text"
                value={shelterName}
                onChange={(e) => setShelterName(e.target.value)}
                className="input-base text-sm border-[#E5E0D6]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1B221E] mb-1.5">Donation / Website URL</label>
              <input
                type="url"
                value={shelterUrl}
                onChange={(e) => setShelterUrl(e.target.value)}
                className="input-base text-sm border-[#E5E0D6]"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            variant="gold"
            size="lg"
            isLoading={saving}
            className="px-8 shadow-sm"
          >
            <Save size={16} /> Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}

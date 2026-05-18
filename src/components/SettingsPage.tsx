import React, { useState } from "react";
import {
  ArrowLeft,
  Bell,
  BookOpen,
  Code2,
  DownloadCloud,
  Globe,
  Headphones,
  HelpCircle,
  LifeBuoy,
  Lock,
  Moon,
  Shield,
  ShieldCheck,
  Sparkles,
  UserCircle,
  Zap,
  Link2,
  Settings as SettingsIcon,
} from "lucide-react";
import { Button } from "./ui/Button";

export function SettingsPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [themeColor, setThemeColor] = useState("Indigo");
  const [fontSize, setFontSize] = useState("Medium");
  const [interviewDifficulty, setInterviewDifficulty] = useState("Medium");
  const [preferredLanguage, setPreferredLanguage] = useState("JavaScript");
  const [interviewDuration, setInterviewDuration] = useState("30 min");
  const [voiceAIEnabled, setVoiceAIEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [mockInterviewReminders, setMockInterviewReminders] = useState(true);
  const [dailyPracticeAlerts, setDailyPracticeAlerts] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [aiVoiceSelection, setAiVoiceSelection] = useState("Neutral");
  const [feedbackStyle, setFeedbackStyle] = useState("Friendly");
  const [autoSaveResponses, setAutoSaveResponses] = useState(true);
  const [resumeParsing, setResumeParsing] = useState(true);
  const [performanceAnalytics, setPerformanceAnalytics] = useState(true);
  const [connectedAccounts, setConnectedAccounts] = useState(false);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.32em] text-text-secondary">Settings</p>
          <h1 className="text-4xl font-bold text-white">Personalize your interview experience</h1>
          <p className="mt-2 text-text-secondary max-w-2xl">
            Configure account settings, notifications, AI preferences, and advanced interview controls from one polished dashboard.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => window.history.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      <div className="grid gap-8 xl:grid-cols-2">
        <section className="elegant-card space-y-6">
          <SectionHeader icon={<UserCircle className="h-5 w-5 text-brand" />} title="Account Settings" />
          <div className="space-y-4">
            <SettingRow label="Change Name" description="Update the display name shown on your profile." />
            <SettingRow label="Change Email" description="Modify the email address used for your account." />
            <SettingRow label="Change Password" description="Update your password to keep your account secure." />
            <ActionRow label="Delete Account" description="Remove your account and all associated data." actionLabel="Delete" variant="destructive" />
            <ActionRow label="Logout" description="Sign out and secure your session." actionLabel="Logout" />
          </div>
        </section>

        <section className="elegant-card space-y-6">
          <SectionHeader icon={<Moon className="h-5 w-5 text-brand" />} title="Appearance" />
          <div className="space-y-4">
            <ToggleRow
              label="Dark / Light Mode"
              description="Switch the interface between dark and light themes."
              enabled={darkMode}
              onToggle={() => setDarkMode(!darkMode)}
            />
            <SelectRow
              label="Theme Color Selection"
              value={themeColor}
              options={["Indigo", "Emerald", "Rose", "Amber"]}
              onChange={setThemeColor}
            />
            <SelectRow
              label="Font Size"
              value={fontSize}
              options={["Small", "Medium", "Large"]}
              onChange={setFontSize}
            />
          </div>
        </section>

        <section className="elegant-card space-y-6">
          <SectionHeader icon={<Code2 className="h-5 w-5 text-brand" />} title="Interview Preferences" />
          <div className="space-y-4">
            <RadioGroup
              label="Preferred Interview Difficulty"
              description="Select the challenge level you want for mock interviews."
              options={["Easy", "Medium", "Hard"]}
              value={interviewDifficulty}
              onChange={setInterviewDifficulty}
            />
            <RadioGroup
              label="Preferred Language"
              description="Choose your primary coding language for interviews."
              options={["Java", "Python", "C++", "JavaScript"]}
              value={preferredLanguage}
              onChange={setPreferredLanguage}
            />
            <RadioGroup
              label="Interview Duration"
              description="Pick the typical time box for your practice rounds."
              options={["15 min", "30 min", "60 min"]}
              value={interviewDuration}
              onChange={setInterviewDuration}
            />
            <ToggleRow
              label="Voice AI Enable/Disable"
              description="Use voice-driven interview coaching during sessions."
              enabled={voiceAIEnabled}
              onToggle={() => setVoiceAIEnabled(!voiceAIEnabled)}
            />
          </div>
        </section>

        <section className="elegant-card space-y-6">
          <SectionHeader icon={<Bell className="h-5 w-5 text-brand" />} title="Notifications" />
          <div className="space-y-4">
            <ToggleRow
              label="Email Notifications"
              description="Receive updates and performance summaries by email."
              enabled={emailNotifications}
              onToggle={() => setEmailNotifications(!emailNotifications)}
            />
            <ToggleRow
              label="Mock Interview Reminders"
              description="Get reminders about scheduled practice sessions."
              enabled={mockInterviewReminders}
              onToggle={() => setMockInterviewReminders(!mockInterviewReminders)}
            />
            <ToggleRow
              label="Daily Practice Alerts"
              description="Stay on track with daily motivation and reminders."
              enabled={dailyPracticeAlerts}
              onToggle={() => setDailyPracticeAlerts(!dailyPracticeAlerts)}
            />
          </div>
        </section>

        <section className="elegant-card space-y-6">
          <SectionHeader icon={<Shield className="h-5 w-5 text-brand" />} title="Privacy & Security" />
          <div className="space-y-4">
            <ToggleRow
              label="Two-Factor Authentication"
              description="Add an extra verification layer to secure your account."
              enabled={twoFactorAuth}
              onToggle={() => setTwoFactorAuth(!twoFactorAuth)}
            />
            <ActionRow label="Manage Devices" description="Review and remove devices signed into your account." actionLabel="Manage" />
            <ActionRow label="Download User Data" description="Export a copy of your stored account information." actionLabel="Download" />
          </div>
        </section>

        <section className="elegant-card space-y-6">
          <SectionHeader icon={<Headphones className="h-5 w-5 text-brand" />} title="AI Features Settings" />
          <div className="space-y-4">
            <SelectRow
              label="AI Voice Selection"
              value={aiVoiceSelection}
              options={["Neutral", "Friendly", "Professional"]}
              onChange={setAiVoiceSelection}
            />
            <RadioGroup
              label="Feedback Style"
              description="Choose how the AI critiques your responses."
              options={["Strict", "Friendly", "HR Style"]}
              value={feedbackStyle}
              onChange={setFeedbackStyle}
            />
            <ToggleRow
              label="Auto Save Responses"
              description="Automatically save answers during mock interviews."
              enabled={autoSaveResponses}
              onToggle={() => setAutoSaveResponses(!autoSaveResponses)}
            />
          </div>
        </section>

        <section className="elegant-card space-y-6">
          <SectionHeader icon={<HelpCircle className="h-5 w-5 text-brand" />} title="Help & Support" />
          <div className="space-y-4">
            <ActionRow label="Contact Support" description="Open a ticket or connect with support." actionLabel="Contact" />
            <ActionRow label="FAQ" description="See answers to common questions and best practices." actionLabel="View" />
            <ActionRow label="Report Bug" description="Submit an issue with bugs or unexpected behavior." actionLabel="Report" />
            <ActionRow label="About Application" description="View version info and feature details." actionLabel="About" />
          </div>
        </section>

        <section className="elegant-card space-y-6">
          <SectionHeader icon={<Sparkles className="h-5 w-5 text-brand" />} title="Advanced Features" />
          <div className="space-y-4">
            <ToggleRow
              label="Resume Parsing Toggle"
              description="Enable AI parsing of uploaded resumes for deeper analysis."
              enabled={resumeParsing}
              onToggle={() => setResumeParsing(!resumeParsing)}
            />
            <ToggleRow
              label="AI Performance Analytics"
              description="Track advanced AI-driven interview performance metrics."
              enabled={performanceAnalytics}
              onToggle={() => setPerformanceAnalytics(!performanceAnalytics)}
            />
            <ActionRow label="Export Interview Reports PDF" description="Download a full interview report as a PDF." actionLabel="Export" />
            <ToggleRow
              label="Connect GitHub / LinkedIn"
              description="Sync your profile with GitHub and LinkedIn for better analysis."
              enabled={connectedAccounts}
              onToggle={() => setConnectedAccounts(!connectedAccounts)}
            />
          </div>
        </section>
      </div>
    </div>
  );
}

function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-3">
      {icon}
      <h2 className="text-xl font-semibold text-white">{title}</h2>
    </div>
  );
}

function SettingRow({ label, description }: { label: string; description: string }) {
  return (
    <div className="rounded-3xl bg-white/5 p-5 border border-white/10">
      <p className="font-semibold text-white">{label}</p>
      <p className="mt-2 text-sm text-text-secondary">{description}</p>
    </div>
  );
}

function ToggleRow({
  label,
  description,
  enabled,
  onToggle,
}: {
  label: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="rounded-3xl bg-white/5 p-5 border border-white/10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-semibold text-white">{label}</p>
        <p className="mt-2 text-sm text-text-secondary">{description}</p>
      </div>
      <button
        type="button"
        onClick={onToggle}
        className={`inline-flex h-10 items-center rounded-full px-4 text-sm font-semibold transition ${enabled ? "bg-brand text-white" : "bg-white/5 text-text-secondary hover:bg-white/10"}`}
      >
        {enabled ? "Enabled" : "Disabled"}
      </button>
    </div>
  );
}

function SelectRow({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="rounded-3xl bg-white/5 p-5 border border-white/10">
      <p className="font-semibold text-white">{label}</p>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-3 w-full rounded-2xl border border-white/10 bg-bg-main px-4 py-3 text-sm text-white outline-none focus:border-brand focus:ring-2 focus:ring-brand/10"
      >
        {options.map((option) => (
          <option key={option} value={option} className="bg-bg-main text-white">
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function RadioGroup({
  label,
  description,
  options,
  value,
  onChange,
}: {
  label: string;
  description: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="rounded-3xl bg-white/5 p-5 border border-white/10">
      <p className="font-semibold text-white">{label}</p>
      <p className="mt-2 text-sm text-text-secondary">{description}</p>
      <div className="mt-4 flex flex-wrap gap-3">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`rounded-2xl border px-4 py-2 text-sm font-semibold transition ${value === option ? "border-brand bg-brand/10 text-white" : "border-white/10 bg-white/5 text-text-secondary hover:border-brand hover:text-white"}`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

function ActionRow({
  label,
  description,
  actionLabel,
  variant = "default",
}: {
  label: string;
  description: string;
  actionLabel: string;
  variant?: "default" | "destructive";
}) {
  return (
    <div className="rounded-3xl bg-white/5 p-5 border border-white/10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-semibold text-white">{label}</p>
        <p className="mt-2 text-sm text-text-secondary">{description}</p>
      </div>
      <Button variant={variant === "destructive" ? "destructive" : "outline"} size="sm">
        {actionLabel}
      </Button>
    </div>
  );
}

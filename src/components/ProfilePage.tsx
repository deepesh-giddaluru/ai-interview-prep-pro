import React, { useState } from "react";
import { BarChart3, Briefcase, CheckCircle2, Clock3, Download, FileText, Link2, LogOut, ShieldCheck, Star, Trophy, Upload } from "lucide-react";
import { Button } from "./ui/Button";

export function ProfilePage() {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [analysisScore] = useState(88);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    fullName: "Deepesh Sharma",
    email: "deepesh@example.com",
    college: "National Institute of Technology",
    branchYear: "Computer Science, 4th Year",
    linkedin: "https://linkedin.com",
    github: "https://github.com",
    targetRole: "AI Engineer",
    experienceLevel: "Intermediate",
    skills: "React, TypeScript, Node.js, AI/ML, Data Structures",
    preferredLanguages: "JavaScript, TypeScript, Python",
  });

  const handleResumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setResumeFile(event.target.files?.[0] || null);
  };

  const handleProfileChange = (key: string, value: string) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
  };

  const handleUpload = () => {
    if (!resumeFile) return;
    alert(`Uploaded ${resumeFile.name}.`);
  };

  const handleEditToggle = () => {
    setIsEditing((value) => !value);
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
    alert("Profile saved successfully.");
  };

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    window.location.href = "/";
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.32em] text-text-secondary">Profile</p>
          <h1 className="text-4xl font-bold text-white">Your Career Dashboard</h1>
          <p className="mt-2 text-text-secondary max-w-2xl">
            Track your progress, manage your profile, and keep your interview preparation moving forward.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" size="sm" onClick={handleEditToggle}>
            {isEditing ? "Close Edit" : "Edit Profile"}
          </Button>
          <Button variant="secondary" size="sm" onClick={() => alert("Downloading report...")}> 
            <Download className="mr-2 h-4 w-4" />
            Download Report
          </Button>
          <Button variant="destructive" size="sm" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      {isEditing && (
        <section className="elegant-card space-y-6">
          <div className="flex items-center gap-3">
            <Briefcase className="h-5 w-5 text-brand" />
            <h2 className="text-xl font-semibold text-white">Edit Profile</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <InputField
              label="Full Name"
              value={profile.fullName}
              onChange={(value) => handleProfileChange("fullName", value)}
            />
            <InputField
              label="Email"
              value={profile.email}
              onChange={(value) => handleProfileChange("email", value)}
            />
            <InputField
              label="College / University"
              value={profile.college}
              onChange={(value) => handleProfileChange("college", value)}
            />
            <InputField
              label="Branch & Year"
              value={profile.branchYear}
              onChange={(value) => handleProfileChange("branchYear", value)}
            />
            <InputField
              label="LinkedIn URL"
              value={profile.linkedin}
              onChange={(value) => handleProfileChange("linkedin", value)}
            />
            <InputField
              label="GitHub URL"
              value={profile.github}
              onChange={(value) => handleProfileChange("github", value)}
            />
            <InputField
              label="Target Role"
              value={profile.targetRole}
              onChange={(value) => handleProfileChange("targetRole", value)}
            />
            <InputField
              label="Experience Level"
              value={profile.experienceLevel}
              onChange={(value) => handleProfileChange("experienceLevel", value)}
            />
          </div>
          <div className="space-y-4">
            <InputField
              label="Skills"
              value={profile.skills}
              onChange={(value) => handleProfileChange("skills", value)}
              textarea
            />
            <InputField
              label="Preferred Programming Languages"
              value={profile.preferredLanguages}
              onChange={(value) => handleProfileChange("preferredLanguages", value)}
              textarea
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleSaveProfile}>Save Changes</Button>
            <Button variant="outline" onClick={handleEditToggle}>Cancel</Button>
          </div>
        </section>
      )}

      <div className="grid gap-8 xl:grid-cols-[2fr_1fr]">
        <div className="space-y-8">
          <section className="elegant-card space-y-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-4">
                <div className="h-24 w-24 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-3xl text-brand">
                  {profile.fullName
                    .split(" ")
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-white">{profile.fullName}</h2>
                  <p className="text-text-secondary">Frontend Engineer | AI Interview Prep Enthusiast</p>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:auto-cols-fr lg:grid-flow-col">
                <div className="rounded-2xl bg-white/5 p-4 border border-white/10">
                  <p className="text-sm text-text-secondary">Daily Streak</p>
                  <p className="mt-2 text-xl font-semibold text-white">12 days</p>
                </div>
                <div className="rounded-2xl bg-white/5 p-4 border border-white/10">
                  <p className="text-sm text-text-secondary">Weekly Practice</p>
                  <p className="mt-2 text-xl font-semibold text-white">5.5 hrs</p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 rounded-2xl bg-white/5 p-5 border border-white/10">
                <p className="text-xs uppercase tracking-[0.3em] text-text-secondary">Email</p>
                <p className="text-sm text-white">{profile.email}</p>
              </div>
              <div className="space-y-2 rounded-2xl bg-white/5 p-5 border border-white/10">
                <p className="text-xs uppercase tracking-[0.3em] text-text-secondary">College</p>
                <p className="text-sm text-white">{profile.college}</p>
              </div>
              <div className="space-y-2 rounded-2xl bg-white/5 p-5 border border-white/10">
                <p className="text-xs uppercase tracking-[0.3em] text-text-secondary">Branch / Year</p>
                <p className="text-sm text-white">{profile.branchYear}</p>
              </div>
              <div className="space-y-2 rounded-2xl bg-white/5 p-5 border border-white/10">
                <p className="text-xs uppercase tracking-[0.3em] text-text-secondary">Connections</p>
                <div className="flex flex-wrap gap-2">
                  <a className="text-brand hover:underline" href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
                  <a className="text-brand hover:underline" href={profile.github} target="_blank" rel="noreferrer">GitHub</a>
                </div>
              </div>
            </div>
          </section>

          <section className="elegant-card space-y-6">
            <div className="flex items-center gap-3">
              <Briefcase className="h-5 w-5 text-brand" />
              <h2 className="text-xl font-semibold text-white">Career Details</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-white/5 p-5 border border-white/10">
                <p className="text-xs uppercase tracking-[0.3em] text-text-secondary">Target Role</p>
                <p className="mt-2 text-white">{profile.targetRole}</p>
              </div>
              <div className="rounded-2xl bg-white/5 p-5 border border-white/10">
                <p className="text-xs uppercase tracking-[0.3em] text-text-secondary">Experience Level</p>
                <p className="mt-2 text-white">{profile.experienceLevel}</p>
              </div>
              <div className="sm:col-span-2 rounded-2xl bg-white/5 p-5 border border-white/10">
                <p className="text-xs uppercase tracking-[0.3em] text-text-secondary">Skills</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {profile.skills.split(",").map((skill) => (
                    <span key={skill} className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white">{skill.trim()}</span>
                  ))}
                </div>
              </div>
              <div className="sm:col-span-2 rounded-2xl bg-white/5 p-5 border border-white/10">
                <p className="text-xs uppercase tracking-[0.3em] text-text-secondary">Preferred Languages</p>
                <p className="mt-2 text-white">{profile.preferredLanguages}</p>
              </div>
            </div>
          </section>

          <section className="elegant-card space-y-6">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-5 w-5 text-brand" />
              <h2 className="text-xl font-semibold text-white">Interview Statistics</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard label="Mock Interviews" value="18" />
              <StatCard label="Average Score" value="82%" />
              <StatCard label="Best Performance" value="95%" />
              <StatCard label="Completed Topics" value="24" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <InfoCard title="Strong Areas" description="Problem solving, system design, communication" />
              <InfoCard title="Weak Areas" description="Behavioral storytelling, time optimization" />
            </div>
          </section>
        </div>

        <aside className="space-y-8">
          <section className="elegant-card space-y-6">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-brand" />
              <h2 className="text-xl font-semibold text-white">Resume</h2>
            </div>
            <div className="space-y-4">
              <label className="block text-sm font-medium text-text-secondary">Upload Resume</label>
              <input type="file" accept="application/pdf" onChange={handleResumeChange} className="w-full rounded-xl border border-white/10 bg-bg-main px-3 py-3 text-sm text-white" />
              <Button className="w-full" disabled={!resumeFile} onClick={handleUpload}>
                <Upload className="mr-2 h-4 w-4" />
                Upload Resume
              </Button>
              <Button variant="outline" className="w-full" disabled={!resumeFile} onClick={() => alert(resumeFile ? `Viewing ${resumeFile.name}` : "No resume uploaded")}> 
                <Link2 className="mr-2 h-4 w-4" />
                View Resume
              </Button>
              <div className="rounded-3xl bg-white/5 border border-white/10 p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-text-secondary">AI Resume Analysis</p>
                <p className="mt-4 text-4xl font-semibold text-white">{analysisScore}%</p>
                <p className="mt-2 text-sm text-text-muted">Estimated fit based on resume and role alignment.</p>
              </div>
            </div>
          </section>

          <section className="elegant-card space-y-6">
            <div className="flex items-center gap-3">
              <Star className="h-5 w-5 text-brand" />
              <h2 className="text-xl font-semibold text-white">Achievements</h2>
            </div>
            <div className="space-y-3">
              <Badge label="Completed 10 Interviews" icon={<CheckCircle2 className="h-4 w-4 text-brand" />} />
              <Badge label="DSA Master" icon={<ShieldCheck className="h-4 w-4 text-brand" />} />
              <Badge label="Communication Expert" icon={<Trophy className="h-4 w-4 text-brand" />} />
            </div>
          </section>

          <section className="elegant-card space-y-6">
            <div className="flex items-center gap-3">
              <Clock3 className="h-5 w-5 text-brand" />
              <h2 className="text-xl font-semibold text-white">Progress Tracking</h2>
            </div>
            <div className="space-y-4">
              <ProgressItem label="Daily Streak" value="12 days" />
              <ProgressItem label="Weekly Practice Hours" value="5.5 hrs" />
              <ProgressItem label="Completed Topics" value="24" />
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl bg-white/5 p-5 border border-white/10">
      <p className="text-xs uppercase tracking-[0.3em] text-text-secondary">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
    </div>
  );
}

function InfoCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-3xl bg-white/5 p-5 border border-white/10">
      <p className="text-sm font-semibold text-white">{title}</p>
      <p className="mt-2 text-sm leading-relaxed text-text-secondary">{description}</p>
    </div>
  );
}

function Badge({ label, icon }: { label: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 rounded-3xl bg-white/5 p-4 border border-white/10">
      <div className="grid h-10 w-10 place-items-center rounded-2xl bg-brand/10 text-brand">{icon}</div>
      <p className="text-sm text-white">{label}</p>
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  textarea = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  textarea?: boolean;
}) {
  return (
    <label className="space-y-2 rounded-3xl bg-white/5 p-4 border border-white/10">
      <span className="text-sm font-semibold text-white">{label}</span>
      {textarea ? (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="min-h-[96px] w-full rounded-2xl border border-white/10 bg-bg-main px-3 py-3 text-sm text-white outline-none focus:border-brand focus:ring-2 focus:ring-brand/10"
        />
      ) : (
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-bg-main px-3 py-3 text-sm text-white outline-none focus:border-brand focus:ring-2 focus:ring-brand/10"
        />
      )}
    </label>
  );
}

function ProgressItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl bg-white/5 p-5 border border-white/10">
      <p className="text-sm text-text-secondary">{label}</p>
      <p className="mt-2 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}

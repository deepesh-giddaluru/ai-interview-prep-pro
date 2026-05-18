import React from "react";
import { Activity, BarChart3 } from "lucide-react";
import { Button } from "./ui/Button";

export function AnalyticsPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.32em] text-text-secondary">Analytics</p>
          <h1 className="text-4xl font-bold text-white">Performance insights</h1>
          <p className="mt-2 text-text-secondary max-w-2xl">
            Review your interview metrics, skill growth, and readiness at a glance.
          </p>
        </div>
        <Button variant="secondary" size="sm">
          <Activity className="mr-2 h-4 w-4" />
          Refresh Data
        </Button>
      </div>

      <section className="elegant-card space-y-6">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-5 w-5 text-brand" />
          <h2 className="text-xl font-semibold text-white">Summary</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <MetricCard label="Total Interviews" value="18" />
          <MetricCard label="Average Score" value="82%" />
          <MetricCard label="Time Saved" value="12 hrs" />
        </div>
      </section>

      <section className="elegant-card">
        <p className="text-sm text-text-secondary uppercase tracking-[0.3em] mb-4">Recent trends</p>
        <div className="h-72 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-text-secondary">
          Analytics charts coming soon.
        </div>
      </section>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl bg-white/5 p-5 border border-white/10">
      <p className="text-xs uppercase tracking-[0.3em] text-text-secondary">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
    </div>
  );
}

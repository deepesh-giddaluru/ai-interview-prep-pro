/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from "react-router-dom";
import { LandingPage } from "./components/LandingPage";
import { Dashboard } from "./components/Dashboard";
import { InterviewView } from "./components/InterviewView";
import { InterviewPracticeDashboard } from "./components/InterviewPracticeDashboard";
import { AIMockInterview } from "./components/AIMockInterview";
import { LoginPage } from "./components/LoginPage";
import { AnalyticsPage } from "./components/AnalyticsPage";
import { ResumeAnalyzerPage } from "./components/ResumeAnalyzerPage";
import { EnhancedResumeAnalyzer } from "./components/EnhancedResumeAnalyzer";
import { CareerRoadmapGenerator } from "./components/CareerRoadmapGenerator";
import { CodingInterviewArena } from "./components/CodingInterviewArena";
import { SkillGapAnalyzer } from "./components/SkillGapAnalyzer";
import { SettingsPage } from "./components/SettingsPage";
import { ProfilePage } from "./components/ProfilePage";
import { CompleteProfile } from "./components/CompleteProfile";
import AdminDashboard from "./components/AdminDashboard";
import { Logo } from "./components/Logo";
import { LayoutDashboard, MessageSquare, User, Settings, LogOut, Menu, LogIn, BarChart3, FileSearch, Map, Code2, Briefcase, Brain, TrendingUp, Shield } from "lucide-react";
import { cn } from "./lib/utils";
import { authAPI } from "./lib/authApi";
import { io } from "socket.io-client";

function PlatformLayout({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState("");
  const [onlineCount, setOnlineCount] = useState(0);

  useEffect(() => {
    const checkAuth = () => {
      const email = localStorage.getItem("userEmail");
      const role = localStorage.getItem("userRole");
      if (email) {
        setIsLoggedIn(true);
        setUserEmail(email);
        setUserRole(role || "user");
      }
    };
    
    checkAuth();
    
    // Listen for storage changes (when user logs in/out)
    window.addEventListener('storage', checkAuth);

    // Socket.IO connection
    // Use `VITE_API_URL` if provided; otherwise connect to same origin.
    const socket = io(import.meta.env.VITE_API_URL || undefined, {
      withCredentials: true,
    });

    socket.on("connect", () => {
      console.log("Connected to Socket.IO");
      const email = localStorage.getItem("userEmail");
      const role = localStorage.getItem("userRole");
      socket.emit("user-online", { email, role });
    });

    socket.on("online-users-count", (count: number) => {
      setOnlineCount(count);
    });

    return () => {
      window.removeEventListener('storage', checkAuth);
      socket.disconnect();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear all auth data
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userId");
      localStorage.removeItem("userRole");
      setIsLoggedIn(false);
      setUserEmail("");
      setUserRole("");
      window.location.href = "/";
    }
  };

  return (
    <div className="flex h-screen bg-bg-main overflow-hidden text-text-primary">
      {/* Sidebar */}
      <aside className="hidden w-64 border-r border-border-subtle bg-bg-sidebar md:flex flex-col">
        <div className="flex h-16 items-center px-6">
          <Logo size={32} />
          <span className="text-xl font-bold tracking-tight ml-3">
            Deepesh's<span className="text-brand">App</span>
          </span>
        </div>
        <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
          {[
            { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
            { name: "Mock Interviews", href: "/interview", icon: MessageSquare },
            { name: "AI Mock Interview", href: "/ai-mock-interview", icon: Brain },
            { name: "Analytics", href: "/analytics", icon: BarChart3 },
            { name: "Resume Analyzer", href: "/resume-analyzer", icon: FileSearch },
            { name: "Skill Gap Analyzer", href: "/skill-gap-analyzer", icon: TrendingUp },
            { name: "Career Roadmap", href: "/career-roadmap", icon: Map },
            { name: "Coding Arena", href: "/coding-arena", icon: Code2 },
            ...(userRole === "admin" ? [{ name: "Admin Panel", href: "/admin", icon: Shield }] : []),
            { name: "Profile", href: "/profile", icon: User },
            { name: "Settings", href: "/settings", icon: Settings },
          ].map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) => cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                isActive 
                  ? "bg-white/5 text-white" 
                  : "text-text-secondary hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-border-subtle">
          {isLoggedIn ? (
            <div className="flex items-center gap-3 p-2">
              <div className="w-10 h-10 rounded-full bg-white/10" />
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-semibold truncate">{userEmail}</p>
                <p className="text-xs text-text-muted">Pro Plan</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-2">
              <div className="w-10 h-10 rounded-full bg-white/10" />
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-semibold truncate">Guest User</p>
                <p className="text-xs text-text-muted">Not logged in</p>
              </div>
            </div>
          )}
          {isLoggedIn ? (
            <button 
              onClick={handleLogout}
              className="flex w-full mt-2 items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-text-secondary hover:bg-red-500/10 hover:text-red-500 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          ) : (
            <NavLink 
              to="/"
              className="flex w-full mt-2 items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-text-secondary hover:bg-white/5 hover:text-white transition-colors"
            >
              <LogIn className="h-4 w-4" />
              Login
            </NavLink>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 flex items-center justify-between px-8 border-b border-border-subtle">
          <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-widest">Mock Interview Mode</h2>
          <div className="flex items-center gap-4">
            <span className="stat-pill">Interview Ready</span>
            {onlineCount > 0 && (
              <span className="stat-pill bg-green-500/20 text-green-400">
                {onlineCount} Online
              </span>
            )}
          </div>
        </header>
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          // Verify token is still valid
          const response = await authAPI.getMe();
          const userData = response.data.data;
          setIsLoggedIn(true);
          setUserRole(userData.role);
          // Update localStorage
          localStorage.setItem("userEmail", userData.email);
          localStorage.setItem("userId", userData.id);
          localStorage.setItem("userRole", userData.role);
        } else {
          setIsLoggedIn(false);
          setUserRole("");
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        // Clear invalid auth data
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userId");
        localStorage.removeItem("userRole");
        setIsLoggedIn(false);
        setUserRole("");
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
    
    // Listen for storage changes (when user logs in/out in another tab)
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bg-main via-bg-sidebar to-bg-card flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
        <Route
          path="/complete-profile"
          element={
            isLoggedIn ? (
              <CompleteProfile />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            isLoggedIn ? (
              <PlatformLayout>
                <Dashboard />
              </PlatformLayout>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route 
          path="/interview" 
          element={
            <PlatformLayout>
              <InterviewPracticeDashboard />
            </PlatformLayout>
          } 
        />
        <Route 
          path="/interview/:type" 
          element={
            <PlatformLayout>
              <InterviewView />
            </PlatformLayout>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <PlatformLayout>
              <ProfilePage />
            </PlatformLayout>
          } 
        />
        <Route 
          path="/analytics" 
          element={
            <PlatformLayout>
              <AnalyticsPage />
            </PlatformLayout>
          } 
        />
        <Route 
          path="/resume-analyzer" 
          element={
            <PlatformLayout>
              <ResumeAnalyzerPage />
            </PlatformLayout>
          } 
        />
        <Route
          path="/settings"
          element={
            <PlatformLayout>
              <SettingsPage />
            </PlatformLayout>
          }
        />
        <Route
          path="/career-roadmap"
          element={
            <PlatformLayout>
              <CareerRoadmapGenerator />
            </PlatformLayout>
          }
        />
        <Route
          path="/coding-arena"
          element={
            <PlatformLayout>
              <CodingInterviewArena />
            </PlatformLayout>
          }
        />
        <Route
          path="/ai-mock-interview"
          element={
            <PlatformLayout>
              <AIMockInterview />
            </PlatformLayout>
          }
        />
        <Route
          path="/enhanced-resume"
          element={
            <PlatformLayout>
              <EnhancedResumeAnalyzer />
            </PlatformLayout>
          }
        />
        <Route
          path="/skill-gap-analyzer"
          element={
            <PlatformLayout>
              <SkillGapAnalyzer />
            </PlatformLayout>
          }
        />
        <Route
          path="/admin"
          element={
            userRole === "admin" ? (
              <AdminDashboard />
            ) : (
              <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
                <div className="text-center">
                  <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
                  <p className="text-gray-600 mb-4">You don't have permission to access this page.</p>
                  <button
                    onClick={() => window.location.href = '/dashboard'}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Go to Dashboard
                  </button>
                </div>
              </div>
            )
          }
        />
      </Routes>
    </Router>
  );
}

// Made with Bob

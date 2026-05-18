import { motion } from "motion/react";
import { Mail, Lock, ArrowRight, UserPlus, KeyRound, Loader2 } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/src/components/ui/Button";
import { Logo } from "@/src/components/Logo";
import { useMongoAuth } from "@/src/hooks/useMongoAuth";
import toast from "react-hot-toast";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const navigate = useNavigate();
  
  // Use MongoDB Auth hook
  const {
    user,
    login,
    register,
    loading
  } = useMongoAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      console.log('User detected, redirecting...');
      // Redirect based on role
      if (user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        // Check if profile is complete
        const profileCompletion = user.profileCompletion || 0;
        if (profileCompletion < 50) {
          // Redirect to complete profile if less than 50% complete
          navigate('/complete-profile', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
      }
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const loginSuccess = await login(email, password);
    
    if (loginSuccess) {
      console.log('Login successful, redirecting...');
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!displayName.trim()) {
      toast.error("Please enter your full name");
      return;
    }

    const signupSuccess = await register(email, password, displayName);
    
    if (signupSuccess) {
      console.log('Signup successful, redirecting to complete profile...');
      // New users should complete their profile
      navigate('/complete-profile', { replace: true });
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.error("Password reset feature coming soon! Please contact admin.");
  };

  const handleSubmit = isForgotPassword ? handleForgotPassword : isSignUp ? handleSignUp : handleLogin;

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-main via-bg-sidebar to-bg-card relative overflow-hidden">
      {/* 3D Background Elements */}
      <div className="absolute inset-0">
        {/* Floating geometric shapes */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-brand/10 rounded-full blur-xl animate-pulse" />
        <div className="absolute top-40 right-20 w-24 h-24 bg-purple-500/10 rounded-lg rotate-45 blur-lg animate-bounce" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-20 right-10 w-28 h-28 bg-green-500/10 rounded-lg rotate-12 blur-xl animate-bounce" style={{ animationDelay: '0.5s' }} />

        {/* Gradient overlays */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-brand/5 via-transparent to-purple-500/5" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-radial from-brand/10 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-6">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-block mb-6"
            >
              <Logo size={64} />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold text-white mb-2"
            >
              {isForgotPassword ? "Reset Password" : isSignUp ? "Create Account" : "Welcome Back"}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-text-secondary"
            >
              {isForgotPassword
                ? "Enter your email to receive a password reset link"
                : isSignUp
                ? "Sign up to start your interview preparation journey"
                : "Login to continue your interview preparation"}
            </motion.p>
          </div>

          {/* Login Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-bg-card/80 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                {isSignUp && (
                  <div className="relative">
                    <UserPlus className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-secondary" />
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full pl-12 pr-4 py-4 rounded-xl border border-white/20 bg-white/5 text-white placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
                      required
                    />
                  </div>
                )}
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-secondary" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full pl-12 pr-4 py-4 rounded-xl border border-white/20 bg-white/5 text-white placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
                    required
                  />
                </div>
                {!isForgotPassword && (
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-secondary" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full pl-12 pr-4 py-4 rounded-xl border border-white/20 bg-white/5 text-white placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
                      required={!isForgotPassword}
                      minLength={6}
                    />
                  </div>
                )}
              </div>

              {!isForgotPassword && !isSignUp && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsForgotPassword(true)}
                    className="text-sm text-brand hover:text-white transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <Button
                type="submit"
                className="w-full py-4 text-lg font-semibold"
                size="lg"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Processing...
                  </div>
                ) : isForgotPassword ? (
                  <>
                    <KeyRound className="mr-2 h-5 w-5" />
                    Send Reset Link
                  </>
                ) : isSignUp ? (
                  <>
                    <UserPlus className="mr-2 h-5 w-5" />
                    Create Account
                  </>
                ) : (
                  <>
                    Login & Continue
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-2">
              {isForgotPassword ? (
                <p className="text-xs text-text-secondary">
                  Remember your password?{" "}
                  <button
                    onClick={() => setIsForgotPassword(false)}
                    className="text-brand hover:text-white cursor-pointer transition-colors"
                  >
                    Back to login
                  </button>
                </p>
              ) : (
                <>
                  <p className="text-xs text-text-secondary">
                    {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                    <button
                      onClick={() => setIsSignUp(!isSignUp)}
                      className="text-brand hover:text-white cursor-pointer transition-colors"
                    >
                      {isSignUp ? "Sign in" : "Sign up"}
                    </button>
                  </p>
                  <p className="text-xs text-text-secondary">
                    Your data is secure and encrypted with MongoDB & JWT Authentication.
                  </p>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
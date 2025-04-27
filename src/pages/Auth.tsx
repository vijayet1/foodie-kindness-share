import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import UserTypeSelection from "@/components/UserTypeSelection";

// Updated UserType to match UserTypeSelection
type UserType = 'individual' | 'orgs' | 'charity_orgs';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [userType, setUserType] = useState<UserType>('individual'); // Updated initial userType to 'individual'
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isForgotPassword) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth?reset=true`,
        });
        if (error) throw error;
        toast.success("Password reset email sent! Check your inbox.");
        setIsForgotPassword(false);
      } else if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
              user_type: userType, // Ensure userType is part of the signup data
            },
          },
        });
        if (error) throw error;
        //toast.success("Verification email sent! Please check your inbox.");
        if (user) {
          toast.success("Account created successfully! Verification bypassed for development.");
        }
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sage-50 px-4 py-8">
      {/* Logo */}
      <div className="mb-8 text-center">
        <img 
          src="/lovable-uploads/679b37d8-2141-421a-aa60-c93599b3bfba.png" 
          alt="EcoEats Logo" 
          className="h-16 mx-auto mb-6"
        />
        {isForgotPassword ? (
          <>
            <h1 className="text-2xl font-semibold mb-2">Reset Password</h1>
            <p className="text-gray-600">Enter your email to receive reset instructions</p>
          </>
        ) : isLogin ? (
          <>
            <h1 className="text-2xl font-semibold mb-2">Welcome Back</h1>
            <p className="text-gray-600">Enter your credentials to access your account</p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-semibold mb-2">Create new account</h1>
            <p className="text-gray-600">Sign up to start sharing and finding food</p>
          </>
        )}
      </div>

      {/* Auth Form */}
      <div className="max-w-sm mx-auto">
        <form onSubmit={handleAuth} className="space-y-4">
          {!isLogin && !isForgotPassword && (
            <>
              <div>
                <Input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Select User Type</label>
                <UserTypeSelection
                  selectedType={userType} // Prop matches UserTypeSelection
                  onTypeSelect={setUserType} // Handles userType selection
                />
              </div>
            </>
          )}
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="pl-10"
            />
          </div>
          {!isForgotPassword && (
            <div>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          )}
          <Button
            type="submit"
            className="w-full bg-eco-green hover:bg-eco-green/90"
            disabled={loading}
          >
            {loading 
              ? "Loading..." 
              : isForgotPassword 
                ? "Send Reset Instructions"
                : isLogin 
                  ? "Login" 
                  : "Create Account"
            }
          </Button>
        </form>

        {/* Auth toggle and forgot password links */}
        <div className="mt-4 text-center space-y-2">
          {isLogin && !isForgotPassword && (
            <button
              onClick={() => setIsForgotPassword(true)}
              className="text-eco-green text-sm hover:underline"
            >
              Forgot password?
            </button>
          )}
          {isForgotPassword ? (
            <p className="text-gray-600">
              Remember your password?{" "}
              <button
                onClick={() => setIsForgotPassword(false)}
                className="text-eco-green font-medium hover:underline"
              >
                Login
              </button>
            </p>
          ) : (
            <p className="text-gray-600">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-eco-green font-medium hover:underline"
              >
                {isLogin ? "Sign up" : "Login"}
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;

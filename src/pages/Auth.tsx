
import { useState } from "react";
import { Link } from "react-router-dom";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-sage-50 px-4 py-8">
      {/* Logo */}
      <div className="mb-8 text-center">
        <img 
          src="/lovable-uploads/679b37d8-2141-421a-aa60-c93599b3bfba.png" 
          alt="EcoEats Logo" 
          className="h-16 mx-auto mb-6"
        />
        {isLogin ? (
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
        <form className="space-y-4">
          {!isLogin && (
            <div>
              <input
                type="text"
                placeholder="Name"
                className="w-full p-3 rounded-xl border border-gray-200 bg-white"
              />
            </div>
          )}
          <div>
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 rounded-xl border border-gray-200 bg-white"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 rounded-xl border border-gray-200 bg-white"
            />
          </div>
          {!isLogin && (
            <div>
              <input
                type="password"
                placeholder="Confirm Password"
                className="w-full p-3 rounded-xl border border-gray-200 bg-white"
              />
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-eco-green text-white p-3 rounded-xl font-medium"
          >
            {isLogin ? "Login" : "Create Account"}
          </button>
        </form>

        <div className="mt-4 text-center">
          {isLogin ? (
            <p className="text-gray-600">
              Don't have an account?{" "}
              <button
                onClick={() => setIsLogin(false)}
                className="text-eco-green font-medium"
              >
                Sign up
              </button>
            </p>
          ) : (
            <p className="text-gray-600">
              Already have an account?{" "}
              <button
                onClick={() => setIsLogin(true)}
                className="text-eco-green font-medium"
              >
                Login
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;

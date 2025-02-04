import React, { useState, useEffect } from "react";
import { SignedOut, useAuth, SignIn, SignUp } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();
  const [showSignUp, setShowSignUp] = useState(false);

  // Redirect based on authentication status
  useEffect(() => {
    if (isSignedIn) {
      redirectUser();
    } else {
      navigate("/"); // Redirect to login if signed out
    }
  }, [isSignedIn]);

  // Function to determine user type and redirect
  const redirectUser = () => {
    const userType = "user"; // Replace with actual logic to get user type
    if (userType === "user") {
      navigate("/user");
    } else {
      navigate("/seller");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#f5f7fa] to-[#c3cfe2]">
      {/* Login Card */}
      <div className="bg-white rounded-xl shadow-lg p-8 w-[400px]">
        <SignedOut>
          <div className="text-center">
            {showSignUp ? (
              <SignUp
                appearance={{
                  elements: {
                    card: "bg-white text-gray-800 shadow-md border-none",
                    headerTitle: "text-gray-900",
                    headerSubtitle: "text-gray-600",
                    socialButtonsBlockButtonText: "text-gray-700",
                    formFieldInput: "border-gray-300 text-gray-900",
                    formFieldLabel: "text-gray-800",
                    formButtonPrimary:
                      "bg-blue-600 hover:bg-blue-700 text-white rounded-lg",
                    footerActionText: "text-gray-600",
                    footerActionLink: "text-blue-500 hover:underline",
                  },
                }}
                
              />
            ) : (
              <SignIn
                appearance={{
                  elements: {
                    card: "bg-white text-gray-800 shadow-md border-none",
                    headerTitle: "text-gray-900",
                    headerSubtitle: "text-gray-600",
                    socialButtonsBlockButtonText: "text-gray-700",
                    formFieldInput: "border-gray-300 text-gray-900",
                    formFieldLabel: "text-gray-800",
                    formButtonPrimary:
                      "bg-blue-600 hover:bg-blue-700 text-white rounded-lg",
                    footerActionText: "text-gray-600",
                    footerActionLink: "text-blue-500 hover:underline",
                  },
                }}
               
              />
            )}

            {/* Toggle Between SignIn and SignUp */}
            <div className="text-center mt-4">
              {showSignUp ? (
                <p className="text-gray-600">
                  Already have an account?{" "}
                  <span
                    className="text-blue-500 cursor-pointer hover:underline"
                    onClick={() => setShowSignUp(false)}
                  >
                    Sign In
                  </span>
                </p>
              ) : (
                <p className="text-gray-600">
                  Don’t have an account?{" "}
                  <span
                    className="text-blue-500 cursor-pointer hover:underline"
                    onClick={() => setShowSignUp(true)}
                  >
                    Sign Up
                  </span>
                </p>
              )}
            </div>
          </div>
        </SignedOut>
      </div>
    </div>
  );
}

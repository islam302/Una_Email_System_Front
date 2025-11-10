const auth = {
  login: {
    welcome: "Welcome to Email Sender",
    login: "Login",
    forgotPassword: "Forgot Password?",
    successLogin: "Logged in successfully!",
    errors: {
      invalidCredentials: "Please check your password and email and try again.",
      networkError: "Network connection error, please try again.",
    },
    placeholders: {
      username: "Enter Username",
      password: "Enter Password",
    },
    labels: {
      username: "Username",
      password: "Password",
    },
  },
  resetPassword: {
    resetPassword: "Reset Password",
    confirmReset: "Confirm Reset",
    backToLogin: "Back to Login",
    successReset: "Password reset successfully.",
    invalidResetLink: "Invalid reset link.",
    placeholders: {
      password: "Enter New Password",
      password_confirmation: "Confirm New Password",
    },
    labels: {
      password: "New Password",
      password_confirmation: "Confirm Password",
    },
  },
  forgetPassword: {
    forgetPassword: "Forgot Password",
    send: "Send",
    rememberedPassword: "Remembered Password?",
    successSendReset:
      "Password reset email sent, please check your email within an hour!",
    accountNotFound: "Account not found, please check your email.",
    placeholders: {
      email: "Enter Email",
    },
    labels: {
      email: "Email",
    },
  },
} as const;

export default auth;

import { useState } from "react";
import API from "../api";
import { useNavigate, Link } from "react-router-dom";
import InputField from "../component/InputField";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      navigate("/profile");
    } catch (error) {
      console.error(error);
      alert("Login failed");
    }
  };

  const handleGoogleLogin = () => {
    // TODO: Implement Google OAuth
    console.log("Google login clicked");
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>EV Battery Swap System</h1>
          <h2 style={styles.subtitle}>Sign in to your account</h2>
          <p style={styles.description}>
            Manage your vehicle, battery status, and swap history.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <InputField
              name="email"
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <InputField
              name="password"
              type="password"
              placeholder="Create Password"
              value={form.password}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <div style={styles.options}>
            <label style={styles.checkboxContainer}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={styles.checkbox}
              />
              <span style={styles.checkboxLabel}>Remember me.</span>
            </label>
            <Link to="/forgot-password" style={styles.forgotPassword}>
              Forgot password?
            </Link>
          </div>

          <button type="submit" style={styles.signInButton}>
            Sign In
          </button>

          <button
            type="button"
            onClick={handleGoogleLogin}
            style={styles.googleButton}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              style={styles.googleIcon}
            >
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign in with Google
          </button>

          <div style={styles.signUpLink}>
            <span style={styles.signUpText}>Don't have an account? </span>
            <Link to="/register" style={styles.signUpButton}>
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f1f5f9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "40px",
    width: "100%",
    maxWidth: "400px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  },
  header: {
    textAlign: "center",
    marginBottom: "32px",
  },
  title: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#1f2937",
    margin: "0 0 8px 0",
    lineHeight: "1.2",
  },
  subtitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#1f2937",
    margin: "0 0 8px 0",
  },
  description: {
    fontSize: "14px",
    color: "#6b7280",
    margin: "0",
    lineHeight: "1.5",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "16px",
    backgroundColor: "white",
    transition: "border-color 0.2s, box-shadow 0.2s",
    outline: "none",
  },
  options: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px",
  },
  checkboxContainer: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
  },
  checkbox: {
    marginRight: "8px",
    accentColor: "#3b82f6",
  },
  checkboxLabel: {
    fontSize: "14px",
    color: "#374151",
  },
  forgotPassword: {
    fontSize: "14px",
    color: "#3b82f6",
    textDecoration: "none",
    fontWeight: "500",
  },
  signInButton: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  googleButton: {
    width: "100%",
    padding: "12px",
    backgroundColor: "white",
    color: "#374151",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "500",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    transition: "background-color 0.2s, border-color 0.2s",
  },
  googleIcon: {
    flexShrink: 0,
  },
  signUpLink: {
    textAlign: "center",
    marginTop: "8px",
  },
  signUpText: {
    fontSize: "14px",
    color: "#6b7280",
  },
  signUpButton: {
    fontSize: "14px",
    color: "#3b82f6",
    textDecoration: "none",
    fontWeight: "500",
  },
};

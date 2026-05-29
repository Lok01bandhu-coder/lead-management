import { Link } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import AppRoutes from "./routes/AppRoutes";

function App() {
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="container py-4">
          <div className="d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-3">
            <div>
              <h1 className="mb-1">Lead Management System</h1>
              <p className="mb-0 text-muted">
                Manage leads, update statuses, and track progress.
              </p>
            </div>

            {isAuthenticated ? (
              <div className="d-flex flex-column flex-md-row align-items-md-center gap-3">
                <div className="d-flex gap-2">
                  <Link
                    to="/leads"
                    className="btn btn-outline-dark"
                    title="View all leads"
                    aria-label="View all leads"
                  >
                    All Leads
                  </Link>
                  <Link
                    to="/leads/new"
                    className="btn btn-dark"
                    title="Create a new lead"
                    aria-label="Create a new lead"
                  >
                    Add Lead
                  </Link>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className="small text-muted">Signed in as {user?.username}</span>
                  <button
                    className="btn btn-outline-secondary"
                    onClick={logout}
                    title="Sign out of the application"
                    aria-label="Sign out of the application"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="btn btn-dark"
                title="Open the login page"
                aria-label="Open the login page"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </header>
      <main className="container py-4">
        <AppRoutes />
      </main>
    </div>
  );
}

export default App;

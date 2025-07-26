import Layout from '../layouts/InvestorLayout';
import '../../styles/InvestmentDashboard.css';
import FloatingAlert from '../../components/FloatingAlert';
import { useAuth } from '../../../contexts/AuthContext';

export default function InvestorHome() {
    const alertMessage = `Your account is still awaiting approval. Some features may be disabled for you, but will be available once an admin approves your account. Make sure your email and phone number are correct, as the admin may contact you.`;
    const { auth } = useAuth();
    const user = auth?.user;
  return (
    <Layout>
             {/* Only show floating message if user is not approved */}
            {user?.is_approved === false && (
              <FloatingAlert message={alertMessage} />
            )}
      <h1 className="page-title">Dashboard</h1>


      <div className="dashboard-grid">
        <div className="stat-card">
          <h3>Total Investments</h3>
          <p className="stat-value">$0.00</p>
        </div>

        <div className="stat-card">
          <h3>Portfolio Value</h3>
          <p className="stat-value">$0.00</p>
        </div>

        <div className="stat-card">
          <h3>Pending Requests</h3>
          <p className="stat-value">0</p>
        </div>

        <div className="stat-card">
          <h3>Latest Statement</h3>
          <p className="stat-value">June 2025</p>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Upcoming Opportunities</h2>
        <div className="placeholder-card">
        </div>
      </div>
    </Layout>
  );
}

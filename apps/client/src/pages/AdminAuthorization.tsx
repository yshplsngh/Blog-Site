import "../styles/pages/admin/adminauthorization.css";

const AdminAuthorization = () => {
  const boxShadow = `0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)`;
  const colorCollection = {
    background: "#1d1f21",
    text: "#e5e5ea",
    highlight: "#ff79c6",
  };

  return (
    <div
      className="admin-authorization-container"
      style={{ background: colorCollection.background, boxShadow }}
    >
      <div className="admin-authorization-content">
        <div
          className="admin-authorization-icon"
          style={{ background: colorCollection.highlight }}
        ></div>
        <div className="admin-authorization-text">
          <h1 style={{ color: colorCollection.text }}>
            Require Admin Authorization
          </h1>
          <p style={{ color: colorCollection.text }}>
            This page is restricted to authorized administrators only. Please
            contact the system administrator to gain access.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminAuthorization;

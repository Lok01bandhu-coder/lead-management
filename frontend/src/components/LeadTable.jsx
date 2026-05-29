import { Link } from "react-router-dom";
import { FiEdit3, FiTrash2 } from "react-icons/fi";
import StatusBadge from "./StatusBadge";

const STATUS_OPTIONS = ["New", "In Progress", "Follow-up", "Converted", "Closed"];

function LeadTable({ leads, onDelete, onStatusChange }) {
  return (
    <div className="card shadow-sm border-0">
      <div className="card-body">
        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>Name</th>
                <th>Mobile</th>
                <th>Email</th>
                <th>Source</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center text-muted py-4">
                    No leads found.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id}>
                    <td>{lead.name}</td>
                    <td>{lead.mobile_number}</td>
                    <td>{lead.email}</td>
                    <td>{lead.source}</td>
                    <td>
                      <div className="d-flex flex-column gap-2">
                        <StatusBadge status={lead.status} />
                        <select
                          className="form-select form-select-sm"
                          value={lead.status}
                          onChange={(event) => onStatusChange(lead.id, event.target.value)}
                        >
                          {STATUS_OPTIONS.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                    <td>{new Date(lead.created_at).toLocaleDateString()}</td>
                    <td>
                      <div className="d-flex gap-2 flex-wrap">
                        <Link
                          to={`/leads/${lead.id}/edit`}
                          className="btn btn-sm btn-outline-primary btn-icon-label table-action-btn"
                          title={`Edit lead ${lead.name}`}
                          aria-label={`Edit lead ${lead.name}`}
                        >
                          <FiEdit3 className="btn-icon" />
                          Edit
                        </Link>
                        <button
                          className="btn btn-sm btn-outline-danger btn-icon-label table-action-btn"
                          onClick={() => onDelete(lead.id)}
                          title={`Delete lead ${lead.name}`}
                          aria-label={`Delete lead ${lead.name}`}
                        >
                          <FiTrash2 className="btn-icon" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default LeadTable;

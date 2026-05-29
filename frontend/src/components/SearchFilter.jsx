import { FiRotateCcw } from "react-icons/fi";

const STATUS_OPTIONS = ["", "New", "In Progress", "Follow-up", "Converted", "Closed"];

function SearchFilter({ filters, onChange, onReset }) {
  return (
    <div className="card shadow-sm border-0 mb-4">
      <div className="card-body">
        <div className="row g-3">
          <div className="col-md-3">
            <label className="form-label">Search Name</label>
            <input
              className="form-control"
              name="search"
              value={filters.search}
              onChange={onChange}
              placeholder="Enter lead name"
            />
          </div>
          <div className="col-md-2">
            <label className="form-label">Mobile</label>
            <input
              className="form-control"
              name="mobile"
              value={filters.mobile}
              onChange={onChange}
              placeholder="9876543210"
            />
          </div>
          <div className="col-md-2">
            <label className="form-label">Status</label>
            <select className="form-select" name="status" value={filters.status} onChange={onChange}>
              {STATUS_OPTIONS.map((status) => (
                <option key={status || "all"} value={status}>
                  {status || "All"}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-2">
            <label className="form-label">Created From</label>
            <input
              className="form-control"
              type="date"
              name="created_from"
              value={filters.created_from}
              onChange={onChange}
            />
          </div>
          <div className="col-md-2">
            <label className="form-label">Created To</label>
            <input
              className="form-control"
              type="date"
              name="created_to"
              value={filters.created_to}
              onChange={onChange}
            />
          </div>
          <div className="col-md-1 d-flex align-items-end">
            <button
              className="btn btn-outline-dark w-100 btn-icon-label toolbar-btn"
              onClick={onReset}
              title="Clear all search and filter values"
              aria-label="Reset"
            >
              <FiRotateCcw className="btn-icon" />
             Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchFilter;

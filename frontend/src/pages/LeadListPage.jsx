import { useDeferredValue, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiPlus } from "react-icons/fi";
import { deleteLead, getLeads, updateLeadStatus } from "../api/leadApi";
import LeadTable from "../components/LeadTable";
import Pagination from "../components/Pagination";
import SearchFilter from "../components/SearchFilter";

const DEFAULT_FILTERS = {
  search: "",
  mobile: "",
  status: "",
  created_from: "",
  created_to: "",
  page: 1,
  limit: 10,
};

function LeadListPage() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const deferredFilters = useDeferredValue(filters);
  const [leadData, setLeadData] = useState({ items: [], total: 0, page: 1, limit: 10 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadLeads = async (params = filters) => {
    try {
      setLoading(true);
      setError("");
      const cleanedParams = Object.fromEntries(
        Object.entries(params).filter(([, value]) => value !== ""),
      );
      const data = await getLeads(cleanedParams);
      setLeadData(data);
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Your session is invalid. Please login again.");
      } else {
        setError("Could not load leads. Check if backend is running.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filterTimer = window.setTimeout(() => {
      loadLeads(deferredFilters);
    }, 350);

    return () => window.clearTimeout(filterTimer);
  }, [deferredFilters]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((current) => ({
      ...current,
      [name]: value,
      page: 1,
    }));
  };

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const handleDelete = async (leadId) => {
    await deleteLead(leadId);
    await loadLeads();
  };

  const handleStatusChange = async (leadId, status) => {
    await updateLeadStatus(leadId, { status });
    await loadLeads();
  };

  return (
    <section>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="h4 mb-1">All Leads</h2>
          <p className="text-muted mb-0">Create, search, and manage customer leads.</p>
        </div>
        <div className="d-flex gap-2 align-items-center">
          <Link
            to="/leads/new"
            className="btn btn-dark btn-icon-label"
            title="Open the create lead form"
            aria-label="Open the create lead form"
          >
            <FiPlus className="btn-icon" />
            Add Lead
          </Link>
        </div>
      </div>

      <SearchFilter filters={filters} onChange={handleFilterChange} onReset={handleReset} />

      {error ? <div className="alert alert-danger">{error}</div> : null}
      {loading ? <div className="alert alert-secondary">Loading leads...</div> : null}

      <LeadTable
        leads={leadData.items}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
      />
      <Pagination
        page={leadData.page}
        total={leadData.total}
        limit={leadData.limit}
        onPageChange={(nextPage) => setFilters((current) => ({ ...current, page: nextPage }))}
      />
    </section>
  );
}

export default LeadListPage;

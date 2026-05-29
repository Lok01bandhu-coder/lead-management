import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

function Pagination({ page, total, limit, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="d-flex align-items-center justify-content-between mt-3">
      <p className="mb-0 text-muted">
        Page {page} of {totalPages}
      </p>
      <div className="d-flex gap-2">
        <button
          className="btn btn-outline-secondary btn-sm btn-icon-label pagination-btn"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          title="Go to the previous page"
          aria-label="Go to the previous page"
        >
          <FiChevronLeft className="btn-icon" />
          Previous
        </button>
        <button
          className="btn btn-outline-secondary btn-sm btn-icon-label pagination-btn"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          title="Go to the next page"
          aria-label="Go to the next page"
        >
          Next
          <FiChevronRight className="btn-icon" />
        </button>
      </div>
    </div>
  );
}

export default Pagination;

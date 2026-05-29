import { useEffect, useState } from "react";

const EMPTY_FORM = {
  name: "",
  mobile_number: "",
  email: "",
  source: "",
  status: "New",
};

const STATUS_OPTIONS = ["New", "In Progress", "Follow-up", "Converted", "Closed"];

function LeadForm({
  initialValues = EMPTY_FORM,
  onSubmit,
  submitLabel,
  errorMessage = "",
  isSubmitting = false,
}) {
  const [formData, setFormData] = useState(initialValues);

  useEffect(() => {
    setFormData(initialValues);
  }, [initialValues]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form className="card shadow-sm border-0" onSubmit={handleSubmit}>
      <div className="card-body">
        {errorMessage ? <div className="alert alert-danger">{errorMessage}</div> : null}

        <fieldset disabled={isSubmitting} className="border-0 p-0 m-0">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Name</label>
              <input
                className="form-control"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Mobile Number</label>
              <input
                className="form-control"
                name="mobile_number"
                value={formData.mobile_number}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Email</label>
              <input
                className="form-control"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Source</label>
              <input
                className="form-control"
                name="source"
                value={formData.source}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Status</label>
              <select className="form-select" name="status" value={formData.status} onChange={handleChange}>
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>
      </div>
      <div className="card-footer bg-white border-0 pt-0 pb-4 px-4">
        <button
          className="btn btn-dark"
          type="submit"
          disabled={isSubmitting}
          title={submitLabel}
          aria-label={submitLabel}
        >
          {isSubmitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}

export default LeadForm;

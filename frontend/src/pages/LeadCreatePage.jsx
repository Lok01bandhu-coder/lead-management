import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createLead } from "../api/leadApi";
import LeadForm from "../components/LeadForm";
import { getApiErrorMessage } from "../utils/apiError";

function LeadCreatePage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      setError("");
      await createLead(formData);
      navigate("/leads");
    } catch (apiError) {
      setError(
        getApiErrorMessage(
          apiError,
          "Could not create the lead. Please check your data and try again.",
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section>
      <div className="mb-4">
        <h2 className="h4 mb-1">Create Lead</h2>
        <p className="text-muted mb-0">Add a new lead to the system.</p>
      </div>
      <LeadForm
        onSubmit={handleSubmit}
        submitLabel="Create Lead"
        errorMessage={error}
        isSubmitting={isSubmitting}
      />
    </section>
  );
}

export default LeadCreatePage;

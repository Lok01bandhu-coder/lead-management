import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getLeadById, updateLead } from "../api/leadApi";
import LeadForm from "../components/LeadForm";
import { getApiErrorMessage } from "../utils/apiError";

function LeadEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadLead = async () => {
      try {
        setIsLoading(true);
        setLoadError("");
        const data = await getLeadById(id);
        setLead(data);
      } catch (apiError) {
        setLoadError(
          getApiErrorMessage(
            apiError,
            "Could not load the lead details. Please refresh and try again.",
          ),
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadLead();
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      setSubmitError("");
      await updateLead(id, formData);
      navigate("/leads");
    } catch (apiError) {
      setSubmitError(
        getApiErrorMessage(
          apiError,
          "Could not update the lead. Please review the form and try again.",
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="alert alert-secondary">Loading lead details...</div>;
  }

  if (loadError) {
    return <div className="alert alert-danger">{loadError}</div>;
  }

  if (!lead) {
    return <div className="alert alert-warning">Lead details are not available.</div>;
  }

  return (
    <section>
      <div className="mb-4">
        <h2 className="h4 mb-1">Edit Lead</h2>
        <p className="text-muted mb-0">Update the lead details and current status.</p>
      </div>
      <LeadForm
        initialValues={lead}
        onSubmit={handleSubmit}
        submitLabel="Update Lead"
        errorMessage={submitError}
        isSubmitting={isSubmitting}
      />
    </section>
  );
}

export default LeadEditPage;

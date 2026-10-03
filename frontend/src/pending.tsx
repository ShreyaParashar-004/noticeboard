import { useCallback, useEffect, useState } from "react";

interface PendingRequest {
  id: number; // circle_members row id, needed by the approve endpoint
  user_id: number;
  name: string;
  email: string;
}

interface PendingRequestsProps {
  api: string;
  circleId: number;
  adminUserId: number;
  // Called after a successful approval so the parent can refresh the members list.
  onApproved: () => void;
}

// FastAPI sends `detail` as a string for our errors but as an array for
// validation (422) errors; never render the array.
const errorText = (data: unknown, fallback: string) => {
  const detail = (data as { detail?: unknown } | null)?.detail;
  return typeof detail === "string" ? detail : fallback;
};

// Render this only for an admin of `circleId`. The backend enforces the same
// rule (403 for anyone else), so this is not the access check.
function PendingRequests({
  api,
  circleId,
  adminUserId,
  onApproved,
}: PendingRequestsProps) {
  const [requests, setRequests] = useState<PendingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [approvingId, setApprovingId] = useState<number | null>(null);

  const loadRequests = useCallback(async () => {
    try {
      const response = await fetch(
        `${api}/circles/${circleId}/pending?admin_user_id=${adminUserId}`
      );
      const data = await response.json();

      if (!response.ok) {
        setRequests([]);
        setError(errorText(data, "Could not load join requests."));
        return;
      }

      setError("");
      setRequests(data);
    } catch (err) {
      console.error("Failed to fetch join requests:", err);
      setError("Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  }, [api, circleId, adminUserId]);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const handleApprove = async (requestId: number) => {
    if (approvingId !== null) {
      return;
    }

    setApprovingId(requestId);
    setError("");

    try {
      const response = await fetch(
        `${api}/circles/${circleId}/members/${requestId}/approve?admin_user_id=${adminUserId}`,
        { method: "PATCH" }
      );
      const data = await response.json();

      if (!response.ok) {
        setError(errorText(data, "Could not approve request."));
        return;
      }

      await loadRequests();
      onApproved();
    } catch (err) {
      console.error("Failed to approve request:", err);
      setError("Could not connect to the server.");
    } finally {
      setApprovingId(null);
    }
  };

  return (
    <div className="notice-section">
      <p className="small-label">PENDING REQUESTS</p>

      {loading ? (
        <p className="notice-empty">loading requests...</p>
      ) : requests.length === 0 ? (
        <p className="notice-empty">no pending requests.</p>
      ) : (
        <div className="member-list">
          {requests.map((request) => (
            <div className="member-card" key={request.id}>
              <div className="member-name">
                <span>{request.name}</span>
              </div>

              <p>{request.email}</p>

              <button
                type="button"
                onClick={() => handleApprove(request.id)}
                disabled={approvingId !== null}
              >
                {approvingId === request.id ? "approving..." : "approve"}
              </button>
            </div>
          ))}
        </div>
      )}

      {error && <p>{error}</p>}
    </div>
  );
}

export default PendingRequests;
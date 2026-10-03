import { useState, type FormEvent } from "react";

// Same shape the backend returns for POST /circles/ (and App.tsx's Circle).
export interface OnboardingCircle {
  id: number;
  name: string;
  description: string | null;
  created_by: number;
  invite_code: string;
  created_at: string;
}

interface CircleOnboardingProps {
  api: string;
  userId: number;
  // The modal can only be dismissed once the user belongs to a circle.
  hasCircles: boolean;
  onClose: () => void;
  onCreated: (circle: OnboardingCircle) => void;
  onLogout: () => void;
}

type Mode = "choose" | "create" | "join" | "created";

// FastAPI sends `detail` as a string for our errors but as an array for
// validation (422) errors; never render the array.
const errorText = (data: unknown, fallback: string) => {
  const detail = (data as { detail?: unknown } | null)?.detail;
  return typeof detail === "string" ? detail : fallback;
};

function CircleOnboarding({
  api,
  userId,
  hasCircles,
  onClose,
  onCreated,
  onLogout,
}: CircleOnboardingProps) {
  const [mode, setMode] = useState<Mode>("choose");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState<OnboardingCircle | null>(null);

  const goTo = (next: Mode) => {
    setError("");
    setMessage("");
    setMode(next);
  };

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();

    if (loading) {
      return;
    }

    if (!name.trim()) {
      setError("Enter a circle name.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${api}/circles/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || null,
          user_id: userId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(errorText(data, "Could not create circle."));
        return;
      }

      setName("");
      setDescription("");
      setCreated(data);
      setMode("created");
      onCreated(data);
    } catch (err) {
      console.error(err);
      setError("Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (e: FormEvent) => {
    e.preventDefault();

    if (loading) {
      return;
    }

    if (!code.trim()) {
      setError("Enter an invite code.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(`${api}/circles/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          invite_code: code.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(errorText(data, "Could not send join request."));
        return;
      }

      // The backend creates the membership as pending (approved = false).
      setCode("");
      setMessage(
        "Request sent. A circle admin has to approve you before you can enter."
      );
    } catch (err) {
      console.error(err);
      setError("Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal">
      <div className="modal-box">
        {hasCircles && <button onClick={onClose}>×</button>}

        <p className="small-label">CIRCLES</p>

        {mode === "choose" && (
          <>
            <h2>{hasCircles ? "add a circle" : "get started"}</h2>

            {!hasCircles && (
              <p>you&apos;re not in a circle yet. create one, or join with an invite code.</p>
            )}

            <button type="button" onClick={() => goTo("create")}>
              create a circle
            </button>

            <button type="button" onClick={() => goTo("join")}>
              join a circle
            </button>

            {!hasCircles && (
              <button type="button" onClick={onLogout}>
                log out
              </button>
            )}
          </>
        )}

        {mode === "create" && (
          <>
            <h2>create a circle</h2>

            <form onSubmit={handleCreate}>
              <input
                placeholder="circle name"
                value={name}
                maxLength={100}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <textarea
                placeholder="description (optional)"
                value={description}
                maxLength={500}
                onChange={(e) => setDescription(e.target.value)}
              />

              {error && <p>{error}</p>}

              <button type="submit" disabled={loading}>
                {loading ? "creating..." : "create circle"}
              </button>

              <button type="button" onClick={() => goTo("choose")}>
                back
              </button>
            </form>
          </>
        )}

        {mode === "join" && (
          <>
            <h2>join a circle</h2>

            <form onSubmit={handleJoin}>
              <input
                placeholder="invite code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />

              {error && <p>{error}</p>}
              {message && <p>{message}</p>}

              <button type="submit" disabled={loading}>
                {loading ? "sending..." : "send request"}
              </button>

              <button type="button" onClick={() => goTo("choose")}>
                back
              </button>
            </form>
          </>
        )}

        {mode === "created" && created && (
          <>
            <h2>{created.name}</h2>
            <p>circle created. share this invite code with people you want in it:</p>
            <p>{created.invite_code}</p>

            <button type="button" onClick={onClose}>
              done
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default CircleOnboarding;
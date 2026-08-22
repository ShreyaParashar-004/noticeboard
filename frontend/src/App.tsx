import { useEffect, useState, type FormEvent } from "react";
import "./App.css";

interface Post {
  id: number;
  title: string;
  content: string;
  post_type: string;
  created_at: string;
}

interface LoggedInUser {
  user_id: number;
  name: string;
  role: string;
}

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const [posts, setPosts] = useState<Post[]>([]);

  // Login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Signup
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupError, setSignupError] = useState("");
  const [signupMessage, setSignupMessage] = useState("");
  const [signupLoading, setSignupLoading] = useState(false);

  // Logged-in user
  const [loggedInUser, setLoggedInUser] =
    useState<LoggedInUser | null>(null);

  // ---------------- LOGIN ----------------

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    setLoginError("");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: loginEmail,
            password: loginPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setLoginError(data.detail || "Login failed.");
        return;
      }

      // Login successful
      setLoggedInUser({
        user_id: data.user_id,
        name: data.name,
        role: data.role,
      });

      // Clear form
      setLoginEmail("");
      setLoginPassword("");

      // Close popup
      setShowLogin(false);

      console.log("Logged in:", data);
    } catch (error) {
      console.error(error);
      setLoginError("Could not connect to the server.");
    }
  };

  // ---------------- SIGNUP ----------------


  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();

    if (signupLoading) {
      return;
    }

    setSignupLoading(true);
    setSignupError("");
    setSignupMessage("");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/users/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: signupName,
            email: signupEmail,
            password: signupPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setSignupError(data.detail || "Signup failed.");
        return;
      }

      setSignupMessage(
        "Signup successful. Your account is waiting for approval."
      );

      setSignupName("");
      setSignupEmail("");
      setSignupPassword("");

      console.log("Signup successful:", data);

    } catch (error) {
      console.error(error);
      setSignupError("Could not connect to the server.");

    } finally {
      setSignupLoading(false);
    }
  };

  // ---------------- LOGOUT ----------------

  const handleLogout = () => {
    setLoggedInUser(null);
  };

  // ---------------- GET POSTS ----------------

  useEffect(() => {
    fetch("http://127.0.0.1:8000/posts/")
      .then((response) => response.json())
      .then((data) => setPosts(data))
      .catch((error) =>
        console.error("Failed to fetch posts:", error)
      );
  }, []);

  return (
    <div className="page">

      {/* HEADER */}

      <header className="topbar">
        <div>
          <p className="eyebrow">THE COMMUNITY BULLETIN</p>
          <h1>noticeboard</h1>
        </div>

        <div className="account">

          {!loggedInUser ? (
            <>
              <button
                className="login"
                onClick={() => {
                  setLoginError("");
                  setShowLogin(true);
                }}
              >
                log in
              </button>

              <button
                className="signup"
                onClick={() => {
                  setSignupError("");
                  setSignupMessage("");
                  setShowSignup(true);
                }}
              >
                sign up
              </button>
            </>
          ) : (
            <>
              <span>
                hi, {loggedInUser.name}
              </span>

              <button
                className="login"
                onClick={handleLogout}
              >
                log out
              </button>
            </>
          )}

        </div>
      </header>


      {/* BOARD */}

      <main className="board">

        <div className="board-header">

          <div>
            <p className="small-label">COMMUNITY BOARD</p>
            <h2>what's happening?</h2>
          </div>

          <div className="board-note">
            <span>REMINDER</span>
            <p>if you missed it, scroll back.</p>
          </div>

        </div>

        <div className="tape tape-one" />
        <div className="tape tape-two" />


        {/* POSTS */}

        <section className="posts">

          {posts.map((post, index) => (

            <article
              key={post.id}
              className={`post ${
                index % 4 === 0
                  ? "pink-paper"
                  : index % 4 === 1
                  ? "yellow-paper"
                  : index % 4 === 2
                  ? "green-paper"
                  : "notebook"
              }`}
            >

              <p className="post-type">
                {post.post_type.toUpperCase()}
              </p>

              <h3>{post.title}</h3>

              <p>{post.content}</p>

              <div className="scribble">
                {new Date(
                  post.created_at
                ).toLocaleDateString()}
              </div>

            </article>

          ))}

        </section>

      </main>


      {/* FOOTER */}

      <footer>
        <p>nothing fancy. just a place to put things.</p>
      </footer>


      {/* LOGIN POPUP */}

      {showLogin && (

        <div className="auth-overlay">

          <div className="auth-box">

            <button
              className="close"
              onClick={() => setShowLogin(false)}
            >
              ×
            </button>

            <p className="small-label">WELCOME BACK</p>

            <h2>log in</h2>

            <form onSubmit={handleLogin}>

              <input
                type="email"
                placeholder="email"
                value={loginEmail}
                onChange={(e) =>
                  setLoginEmail(e.target.value)
                }
                required
              />

              <input
                type="password"
                placeholder="password"
                value={loginPassword}
                onChange={(e) =>
                  setLoginPassword(e.target.value)
                }
                required
              />

              {loginError && (
                <p>{loginError}</p>
              )}

              <button
                className="auth-submit"
                type="submit"
              >
                enter
              </button>

            </form>

          </div>

        </div>

      )}


      {/* SIGNUP POPUP */}

      {showSignup && (

        <div className="modal">

          <div className="modal-box">

            <button
              onClick={() => setShowSignup(false)}
            >
              ×
            </button>

            <h2>sign up</h2>

            <form onSubmit={handleSignup}>

              <input
                placeholder="name"
                value={signupName}
                onChange={(e) =>
                  setSignupName(e.target.value)
                }
                required
              />

              <input
                type="email"
                placeholder="email"
                value={signupEmail}
                onChange={(e) =>
                  setSignupEmail(e.target.value)
                }
                required
              />

              <input
                type="password"
                placeholder="password"
                value={signupPassword}
                onChange={(e) =>
                  setSignupPassword(e.target.value)
                }
                required
              />

              {signupError && (
                <p>{signupError}</p>
              )}

              {signupMessage && (
                <p>{signupMessage}</p>
              )}

              <button type="submit" disabled={signupLoading}>
                {signupLoading ? "joining..." : "join"}
              </button>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default App;
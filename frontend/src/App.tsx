import { useEffect, useState, type FormEvent } from "react";

import "./App.css";

interface Post {
  id: number;
  title: string;
  content: string;
  post_type: string;
  created_at: string;
}

interface Comment {
  id: number;
  post_id: number;
  user_id: number;
  content: string;
  created_at: string;
}

interface LoggedInUser {
  user_id: number;
  name: string;
  role: string;
}

// admin interface
interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
  approved: boolean;
  created_at: string;
}

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const [posts, setPosts] = useState<Post[]>([]);
  // Create post
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postType, setPostType] = useState("announcement");
  const [postError, setPostError] = useState("");
  const [postLoading, setPostLoading] = useState(false);

  // comments
  const [comments, setComments] = useState<Record<number, Comment[]>>({});
  const [commentText, setCommentText] = useState<Record<number, string>>({});
  const [commentError, setCommentError] = useState<Record<number, string>>({});
  const [commentLoading, setCommentLoading] = useState<Record<number, boolean>>({});

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

  // admin
  const [showAdmin, setShowAdmin] = useState(false);
  const [users, setUsers] = useState<AdminUser[]>([]);

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

      console.log("Logged in:", data);

      setLoggedInUser({
        user_id: data.user_id,
        name: data.name,
        role: data.role,
      });

      // Close popup
      setShowLogin(false);
      setLoginEmail("");
      setLoginPassword("");

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


  //  -----------------POSTS-----------------

  const handleCreatePost = async (e: FormEvent) => {
    e.preventDefault();

    if (postLoading) {
      return;
    }

    if (!loggedInUser) {
      setPostError("You must be logged in to create a post.");
      return;
    }

    setPostLoading(true);
    setPostError("");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/posts/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: postTitle,
            content: postContent,
            post_type: postType,
            user_id: loggedInUser.user_id,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setPostError(data.detail || "Could not create post.");
        return;
      }

      console.log("Post created:", data);

      setPostTitle("");
      setPostContent("");
      setPostType("announcement");
      setShowCreatePost(false);

      // Refresh posts
      const postsResponse = await fetch(
        "http://127.0.0.1:8000/posts/"
      );

      const postsData = await postsResponse.json();
      setPosts(postsData);

    } catch (error) {
      console.error(error);
      setPostError("Could not connect to the server.");
    } finally {
      setPostLoading(false);
    }
  };

  // -----------------COMMENTS-----------------
  const fetchComments = async (postId: number) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/comments/${postId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch comments.");
      }

      const data = await response.json();

      setComments((previous) => ({
        ...previous,
        [postId]: data,
      }));
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    }
  };

  const handleCreateComment = async (postId: number) => {
    if (!loggedInUser) {
      setCommentError((previous) => ({
        ...previous,
        [postId]: "Please log in to comment.",
      }));
      return;
    }

    if (!commentText[postId]?.trim()) {
      setCommentError((previous) => ({
        ...previous,
        [postId]: "Comment cannot be empty.",
      }));
      return;
    }

    setCommentLoading((previous) => ({
      ...previous,
      [postId]: true,
    }));

    setCommentError((previous) => ({
      ...previous,
      [postId]: "",
    }));

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/comments/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            post_id: postId,
            user_id: loggedInUser.user_id,
            content: commentText[postId].trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setCommentError((previous) => ({
          ...previous,
          [postId]: data.detail || "Could not add comment.",
        }));
        return;
      }

      setCommentText((previous) => ({
        ...previous,
        [postId]: "",
      }));

      await fetchComments(postId);
    } catch (error) {
      console.error("Failed to create comment:", error);

      setCommentError((previous) => ({
        ...previous,
        [postId]: "Could not connect to the server.",
      }));
    } finally {
      setCommentLoading((previous) => ({
        ...previous,
        [postId]: false,
      }));
    }
  };


  // ---------------- LOGOUT ----------------

  const handleLogout = () => {
    setLoggedInUser(null);
  };

  const openAdminPanel = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/users/"
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Failed to fetch users:", data);
        return;
      }

      setUsers(data);
      setShowAdmin(true);

    } catch (error) {
      console.error("Could not fetch users:", error);
    }
  };

  const approveUser = async (userId: number) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/users/${userId}/approve`,
        {
          method: "PATCH",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Failed to approve user:", data);
        return;
      }

      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user.id === userId
            ? { ...user, approved: true }
            : user
        )
      );

    } catch (error) {
      console.error("Could not approve user:", error);
    }
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

  // for comments
  useEffect(() => {
    posts.forEach((post) => {
      fetchComments(post.id);
    });
  }, [posts]);

  return (
    <div className="page">

      {/* HEADER */}

      <header className="topbar">
        <div>
          <p className="eyebrow"></p>
          <h1>Season 22 : Pilot</h1>
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

              {loggedInUser.role === "admin" && (
                <button
                  className="login"
                  onClick={openAdminPanel}
                >
                  admin
                </button>
              )}

              {loggedInUser && loggedInUser.role === "admin" && (
                <button
                  className="signup"
                  onClick={() => {
                    setPostError("");
                    setShowCreatePost(true);
                  }}
                >
                  new post
                </button>
              )}

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
            <p className="small-label"></p>
            <h2>what's happening?</h2>
          </div>

          <div className="board-note">
            <span>Tip:</span>
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
                post.post_type === "announcement"
                  ? "green-paper"
                  : post.post_type === "event"
                  ? "yellow-paper"
                  : post.post_type === "reminder"
                  ? "notebook"
                  : "pink-paper"
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

              <div className="comments">
                <p className="small-label">COMMENTS</p>

                {comments[post.id]?.length > 0 ? (
                  comments[post.id].map((comment) => (
                    <div className="comment" key={comment.id}>
                      <p>{comment.content}</p>
                      <span>
                        {new Date(comment.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="no-comments">
                    no comments yet.
                  </p>
                )}
              </div>

            </article>

          ))}
        </section>
      </main>

      {/* FOOTER */}

      <footer>
        <p> just a place for my favorite people.</p>
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

      {/* CREATE POST POPUP */}

      {showCreatePost && (
        <div className="modal">
          <div className="modal-box">
            <button
              onClick={() => setShowCreatePost(false)}
            >
              ×
            </button>

            <p className="small-label">COMMUNITY BOARD</p>
            <h2>new post</h2>

            <form onSubmit={handleCreatePost}>
              <input
                placeholder="title"
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                required
              />

              <textarea
                placeholder="what's happening?"
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                required
              />

              <select
                value={postType}
                onChange={(e) => setPostType(e.target.value)}
              >
                <option value="announcement">announcement</option>
                <option value="event">event</option>
                <option value="reminder">reminder</option>
              </select>

              {postError && (
                <p>{postError}</p>
              )}

              <button
                type="submit"
                disabled={postLoading}
              >
                {postLoading ? "posting..." : "post"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ADMIN POPUP */}

      {showAdmin && (
        <div className="modal">
          <div className="modal-box admin-box">
            <button
              onClick={() => setShowAdmin(false)}
            >
              ×
            </button>

            <h2>admin</h2>

            <div className="admin-users">
              {users.map((user) => (
                <div className="admin-user" key={user.id}>

                  <p className="admin-name">
                    {user.name}
                  </p>

                  <p>
                    {user.email}
                  </p>

                  <p>
                    {user.role}
                  </p>

                  <p>
                    {user.approved
                      ? "approved"
                      : "waiting for approval"}
                  </p>

                  {!user.approved && (
                    <button
                      type="button"
                      onClick={() => approveUser(user.id)}
                    >
                      approve
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
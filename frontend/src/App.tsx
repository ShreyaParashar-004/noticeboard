// import { useEffect, useState, type FormEvent } from "react";
// import "./App.css";

// const API = "http://127.0.0.1:8000";

// type Tab = "board" | "album" | "moodboard" | "notice";

// interface Post {
//   id: number;
//   title: string;
//   content: string;
//   circle_id: number;
//   created_at: string;
// }

// interface Comment {
//   id: number;
//   post_id: number;
//   user_id: number;
//   content: string;
//   created_at: string;
// }

// interface LoggedInUser {
//   user_id: number;
//   name: string;
// }

// interface Circle {
//   id: number;
//   name: string;
//   description: string | null;
//   created_by: number;
//   invite_code: string;
//   created_at: string;
// }

// interface CircleMember {
//   user_id: number;
//   name: string;
//   role: string;
//   email?: string;
//   approved?: boolean;
// }

// interface AlbumItem {
//   id: number;
//   circle_id: number;
//   user_id: number;
//   item_type: string;
//   content_url: string;
//   caption: string | null;
//   created_at: string;
// }

// interface PollItem {
//   id: number;
//   circle_id: number;
//   user_id: number;
//   question: string;
//   options: string[];
//   votes: Record<string, string>;
//   created_at: string;
// }

// interface MoodboardItem {
//   id: number;
//   circle_id: number;
//   user_id: number;
//   title: string;
//   images: string[];
//   created_at: string;
// }

// interface LinkItem {
//   id: number;
//   circle_id: number;
//   user_id: number;
//   title: string;
//   url: string;
//   platform: string | null;
//   created_at: string;
// }

// interface PdfItem {
//   id: number;
//   circle_id: number;
//   user_id: number;
//   title: string;
//   pdf_url: string;
//   created_at: string;
// }

// function App() {
//   const [showLogin, setShowLogin] = useState(false);
//   const [showSignup, setShowSignup] = useState(false);

//   const [posts, setPosts] = useState<Post[]>([]);
//   const [circles, setCircles] = useState<Circle[]>([]);
//   const [selectedCircle, setSelectedCircle] = useState<Circle | null>(null);
//   const [circleMembers, setCircleMembers] = useState<CircleMember[]>([]);
//   const [activeTab, setActiveTab] = useState<Tab>("board");
//   const [showMembers, setShowMembers] = useState(false);

//   const [showCreatePost, setShowCreatePost] = useState(false);
//   const [postTitle, setPostTitle] = useState("");
//   const [postContent, setPostContent] = useState("");
//   const [postError, setPostError] = useState("");
//   const [postLoading, setPostLoading] = useState(false);

//   const [albumItems, setAlbumItems] = useState<AlbumItem[]>([]);
//   const [polls, setPolls] = useState<PollItem[]>([]);
//   const [moodboard, setMoodboard] = useState<MoodboardItem[]>([]);
//   const [links, setLinks] = useState<LinkItem[]>([]);
//   const [pdfs, setPdfs] = useState<PdfItem[]>([]);

//   const [showAlbumForm, setShowAlbumForm] = useState(false);
//   const [albumUrl, setAlbumUrl] = useState("");
//   const [albumCaption, setAlbumCaption] = useState("");
//   const [albumError, setAlbumError] = useState("");
//   const [albumLoading, setAlbumLoading] = useState(false);

//   const [showPollForm, setShowPollForm] = useState(false);
//   const [pollQuestion, setPollQuestion] = useState("");
//   const [pollOptions, setPollOptions] = useState(["", ""]);
//   const [pollError, setPollError] = useState("");
//   const [pollLoading, setPollLoading] = useState(false);

//   const [showMoodboardForm, setShowMoodboardForm] = useState(false);
//   const [moodboardTitle, setMoodboardTitle] = useState("");
//   const [moodboardImages, setMoodboardImages] = useState(["", ""]);
//   const [moodboardError, setMoodboardError] = useState("");
//   const [moodboardLoading, setMoodboardLoading] = useState(false);

//   const [showLinkForm, setShowLinkForm] = useState(false);
//   const [linkTitle, setLinkTitle] = useState("");
//   const [linkUrl, setLinkUrl] = useState("");
//   const [linkPlatform, setLinkPlatform] = useState("");
//   const [linkError, setLinkError] = useState("");
//   const [linkLoading, setLinkLoading] = useState(false);

//   const [comments, setComments] = useState<Record<number, Comment[]>>({});
//   const [commentText, setCommentText] = useState<Record<number, string>>({});
//   const [commentError, setCommentError] = useState<Record<number, string>>({});
//   const [commentLoading, setCommentLoading] = useState<Record<number, boolean>>({});

//   const [loginEmail, setLoginEmail] = useState("");
//   const [loginPassword, setLoginPassword] = useState("");
//   const [loginError, setLoginError] = useState("");

//   const [signupName, setSignupName] = useState("");
//   const [signupEmail, setSignupEmail] = useState("");
//   const [signupPassword, setSignupPassword] = useState("");
//   const [signupError, setSignupError] = useState("");
//   const [signupMessage, setSignupMessage] = useState("");
//   const [signupLoading, setSignupLoading] = useState(false);

//   const [loggedInUser, setLoggedInUser] = useState<LoggedInUser | null>(null);

//   const currentMembership = circleMembers.find(
//     (member) => member.user_id === loggedInUser?.user_id
//   );

//   const isSelectedCircleAdmin = currentMembership?.role === "admin";

//   const fetchCircles = async () => {
//     try {
//       const response = await fetch(`${API}/circles/`);
//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.detail || "Failed to fetch circles.");
//       }

//       setCircles(data);

//       if (data.length > 0) {
//         setSelectedCircle((current) => current ?? data[0]);
//       }
//     } catch (error) {
//       console.error("Failed to fetch circles:", error);
//     }
//   };

//   const fetchPosts = async (circleId: number) => {
//     try {
//       const response = await fetch(`${API}/posts/circle/${circleId}`);
//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.detail || "Failed to fetch posts.");
//       }

//       setPosts(data);
//     } catch (error) {
//       console.error("Failed to fetch posts:", error);
//       setPosts([]);
//     }
//   };

//   const fetchComments = async (postId: number) => {
//     try {
//       const response = await fetch(`${API}/comments/post/${postId}`);
//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.detail || "Failed to fetch comments.");
//       }

//       setComments((previous) => ({
//         ...previous,
//         [postId]: data,
//       }));
//     } catch (error) {
//       console.error("Failed to fetch comments:", error);
//     }
//   };

//   const fetchCircleMembers = async (circleId: number, userId: number) => {
//     try {
//       const response = await fetch(
//         `${API}/circles/${circleId}/members?user_id=${userId}`
//       );
//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.detail || "Failed to fetch members.");
//       }

//       setCircleMembers(data);
//     } catch (error) {
//       console.error("Failed to fetch circle members:", error);
//       setCircleMembers([]);
//     }
//   };

//   const fetchAlbum = async (circleId: number, userId: number) => {
//     try {
//       const response = await fetch(
//         `${API}/scrapbook/${circleId}?user_id=${userId}`
//       );
//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.detail || "Failed to fetch album.");
//       }

//       setAlbumItems(data);
//     } catch (error) {
//       console.error("Failed to fetch album:", error);
//       setAlbumItems([]);
//     }
//   };

//   const fetchPolls = async (circleId: number, userId: number) => {
//     try {
//       const response = await fetch(
//         `${API}/polls/${circleId}?user_id=${userId}`
//       );
//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.detail || "Failed to fetch polls.");
//       }

//       setPolls(data);
//     } catch (error) {
//       console.error("Failed to fetch polls:", error);
//       setPolls([]);
//     }
//   };

//   const fetchMoodboard = async (circleId: number, userId: number) => {
//     try {
//       const response = await fetch(
//         `${API}/moodboards/${circleId}?user_id=${userId}`
//       );
//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.detail || "Failed to fetch moodboards.");
//       }

//       setMoodboard(data);
//     } catch (error) {
//       console.error("Failed to fetch moodboards:", error);
//       setMoodboard([]);
//     }
//   };

//   const fetchLinks = async (circleId: number, userId: number) => {
//     try {
//       const response = await fetch(
//         `${API}/links/${circleId}?user_id=${userId}`
//       );
//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.detail || "Failed to fetch links.");
//       }

//       setLinks(data);
//     } catch (error) {
//       console.error("Failed to fetch links:", error);
//       setLinks([]);
//     }
//   };

//   const fetchPdfs = async (circleId: number, userId: number) => {
//     try {
//       const response = await fetch(
//         `${API}/pdfs/${circleId}?user_id=${userId}`
//       );
//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.detail || "Failed to fetch documents.");
//       }

//       setPdfs(data);
//     } catch (error) {
//       console.error("Failed to fetch documents:", error);
//       setPdfs([]);
//     }
//   };

//   const handleLogin = async (e: FormEvent) => {
//     e.preventDefault();
//     setLoginError("");

//     try {
//       const response = await fetch(`${API}/users/login`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           email: loginEmail,
//           password: loginPassword,
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         setLoginError(data.detail || "Login failed.");
//         return;
//       }

//       setLoggedInUser({
//         user_id: data.user_id,
//         name: data.name,
//       });

//       await fetchCircles();

//       setShowLogin(false);
//       setLoginEmail("");
//       setLoginPassword("");
//     } catch (error) {
//       console.error(error);
//       setLoginError("Could not connect to the server.");
//     }
//   };

//   const handleSignup = async (e: FormEvent) => {
//     e.preventDefault();

//     if (signupLoading) {
//       return;
//     }

//     setSignupLoading(true);
//     setSignupError("");
//     setSignupMessage("");

//     try {
//       const response = await fetch(`${API}/users/`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           name: signupName,
//           email: signupEmail,
//           password: signupPassword,
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         setSignupError(data.detail || "Signup failed.");
//         return;
//       }

//       setSignupMessage("Signup successful. You can log in now.");

//       setSignupName("");
//       setSignupEmail("");
//       setSignupPassword("");
//     } catch (error) {
//       console.error(error);
//       setSignupError("Could not connect to the server.");
//     } finally {
//       setSignupLoading(false);
//     }
//   };

//   const handleCreatePost = async (e: FormEvent) => {
//     e.preventDefault();

//     if (postLoading || !loggedInUser || !selectedCircle) {
//       return;
//     }

//     if (!isSelectedCircleAdmin) {
//       setPostError("Only the circle admin can create posts.");
//       return;
//     }

//     setPostLoading(true);
//     setPostError("");

//     try {
//       const response = await fetch(`${API}/posts/`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           title: postTitle,
//           content: postContent,
//           user_id: loggedInUser.user_id,
//           circle_id: selectedCircle.id,
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         setPostError(data.detail || "Could not create post.");
//         return;
//       }

//       setPostTitle("");
//       setPostContent("");
//       setShowCreatePost(false);

//       await fetchPosts(selectedCircle.id);
//     } catch (error) {
//       console.error(error);
//       setPostError("Could not connect to the server.");
//     } finally {
//       setPostLoading(false);
//     }
//   };

//   const handleCreateComment = async (postId: number) => {
//     if (!loggedInUser) {
//       setCommentError((previous) => ({
//         ...previous,
//         [postId]: "Please log in to comment.",
//       }));
//       return;
//     }

//     if (!commentText[postId]?.trim()) {
//       setCommentError((previous) => ({
//         ...previous,
//         [postId]: "Comment cannot be empty.",
//       }));
//       return;
//     }

//     setCommentLoading((previous) => ({ ...previous, [postId]: true }));
//     setCommentError((previous) => ({ ...previous, [postId]: "" }));

//     try {
//       const response = await fetch(`${API}/comments/`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           post_id: postId,
//           user_id: loggedInUser.user_id,
//           content: commentText[postId].trim(),
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         setCommentError((previous) => ({
//           ...previous,
//           [postId]: data.detail || "Could not add comment.",
//         }));
//         return;
//       }

//       setCommentText((previous) => ({ ...previous, [postId]: "" }));
//       await fetchComments(postId);
//     } catch (error) {
//       console.error("Failed to create comment:", error);
//       setCommentError((previous) => ({
//         ...previous,
//         [postId]: "Could not connect to the server.",
//       }));
//     } finally {
//       setCommentLoading((previous) => ({ ...previous, [postId]: false }));
//     }
//   };

//   const handleCreateAlbumItem = async (e: FormEvent) => {
//     e.preventDefault();

//     if (albumLoading || !loggedInUser || !selectedCircle) {
//       return;
//     }

//     if (!albumUrl.trim()) {
//       setAlbumError("Please enter an image URL.");
//       return;
//     }

//     setAlbumLoading(true);
//     setAlbumError("");

//     try {
//       const response = await fetch(`${API}/scrapbook/`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           circle_id: selectedCircle.id,
//           user_id: loggedInUser.user_id,
//           item_type: "photo",
//           content_url: albumUrl.trim(),
//           caption: albumCaption.trim() || null,
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         setAlbumError(data.detail || "Could not add album item.");
//         return;
//       }

//       setAlbumItems((current) => [data, ...current]);
//       setAlbumUrl("");
//       setAlbumCaption("");
//       setShowAlbumForm(false);
//     } catch (error) {
//       console.error(error);
//       setAlbumError("Could not connect to the server.");
//     } finally {
//       setAlbumLoading(false);
//     }
//   };

//   const handleDeleteAlbumItem = async (itemId: number) => {
//     if (!loggedInUser) {
//       return;
//     }

//     try {
//       const response = await fetch(
//         `${API}/scrapbook/${itemId}?user_id=${loggedInUser.user_id}`,
//         { method: "DELETE" }
//       );

//       if (!response.ok) {
//         const data = await response.json();
//         console.error("Failed to delete album item:", data);
//         return;
//       }

//       setAlbumItems((current) => current.filter((item) => item.id !== itemId));
//     } catch (error) {
//       console.error("Could not delete album item:", error);
//     }
//   };

//   const handleCreateMoodboard = async (e: FormEvent) => {
//     e.preventDefault();

//     if (moodboardLoading || !loggedInUser || !selectedCircle) {
//       return;
//     }

//     const images = moodboardImages.map((url) => url.trim()).filter(Boolean);

//     if (!moodboardTitle.trim()) {
//       setMoodboardError("Enter a title.");
//       return;
//     }

//     if (images.length < 2) {
//       setMoodboardError("Add at least two image URLs.");
//       return;
//     }

//     setMoodboardLoading(true);
//     setMoodboardError("");

//     try {
//       const response = await fetch(`${API}/moodboards/`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           circle_id: selectedCircle.id,
//           user_id: loggedInUser.user_id,
//           title: moodboardTitle.trim(),
//           images,
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         setMoodboardError(data.detail || "Could not create moodboard.");
//         return;
//       }

//       setMoodboard((current) => [data, ...current]);
//       setMoodboardTitle("");
//       setMoodboardImages(["", ""]);
//       setShowMoodboardForm(false);
//     } catch (error) {
//       console.error(error);
//       setMoodboardError("Could not connect to the server.");
//     } finally {
//       setMoodboardLoading(false);
//     }
//   };

//   const handleDeleteMoodboard = async (moodboardId: number) => {
//     if (!loggedInUser) {
//       return;
//     }

//     try {
//       const response = await fetch(
//         `${API}/moodboards/${moodboardId}?user_id=${loggedInUser.user_id}`,
//         { method: "DELETE" }
//       );

//       if (!response.ok) {
//         const data = await response.json();
//         console.error("Failed to delete moodboard:", data);
//         return;
//       }

//       setMoodboard((current) =>
//         current.filter((board) => board.id !== moodboardId)
//       );
//     } catch (error) {
//       console.error("Could not delete moodboard:", error);
//     }
//   };

//   const handleCreatePoll = async (e: FormEvent) => {
//     e.preventDefault();

//     if (!loggedInUser || !selectedCircle) {
//       return;
//     }

//     const validOptions = pollOptions.map((option) => option.trim()).filter(Boolean);

//     if (!pollQuestion.trim()) {
//       setPollError("Enter a question.");
//       return;
//     }

//     if (validOptions.length < 2) {
//       setPollError("Add at least two options.");
//       return;
//     }

//     setPollLoading(true);
//     setPollError("");

//     try {
//       const response = await fetch(`${API}/polls/`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           circle_id: selectedCircle.id,
//           user_id: loggedInUser.user_id,
//           question: pollQuestion.trim(),
//           options: validOptions,
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         setPollError(data.detail || "Could not create poll.");
//         return;
//       }

//       setPolls((current) => [data, ...current]);
//       setPollQuestion("");
//       setPollOptions(["", ""]);
//       setShowPollForm(false);
//     } catch {
//       setPollError("Could not connect to the server.");
//     } finally {
//       setPollLoading(false);
//     }
//   };

//   const handleVote = async (pollId: number, option: string) => {
//     if (!loggedInUser) {
//       return;
//     }

//     try {
//       const response = await fetch(`${API}/polls/${pollId}/vote`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           user_id: loggedInUser.user_id,
//           option,
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         console.error("Failed to vote:", data);
//         return;
//       }

//       setPolls((current) =>
//         current.map((poll) => (poll.id === pollId ? data : poll))
//       );
//     } catch (error) {
//       console.error("Could not vote:", error);
//     }
//   };

//   const handleDeletePoll = async (pollId: number) => {
//     if (!loggedInUser) {
//       return;
//     }

//     try {
//       const response = await fetch(
//         `${API}/polls/${pollId}?user_id=${loggedInUser.user_id}`,
//         { method: "DELETE" }
//       );

//       if (!response.ok) {
//         const data = await response.json();
//         console.error("Failed to delete poll:", data);
//         return;
//       }

//       setPolls((current) => current.filter((poll) => poll.id !== pollId));
//     } catch (error) {
//       console.error("Could not delete poll:", error);
//     }
//   };

//   const handleCreateLink = async (e: FormEvent) => {
//     e.preventDefault();

//     if (linkLoading || !loggedInUser || !selectedCircle) {
//       return;
//     }

//     setLinkLoading(true);
//     setLinkError("");

//     try {
//       const response = await fetch(`${API}/links/`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           circle_id: selectedCircle.id,
//           user_id: loggedInUser.user_id,
//           title: linkTitle.trim(),
//           url: linkUrl.trim(),
//           platform: linkPlatform.trim() || null,
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         setLinkError(data.detail || "Could not add link.");
//         return;
//       }

//       setLinks((current) => [data, ...current]);
//       setLinkTitle("");
//       setLinkUrl("");
//       setLinkPlatform("");
//       setShowLinkForm(false);
//     } catch (error) {
//       console.error(error);
//       setLinkError("Could not connect to the server.");
//     } finally {
//       setLinkLoading(false);
//     }
//   };

//   const handleDeleteLink = async (linkId: number) => {
//     if (!loggedInUser) {
//       return;
//     }

//     try {
//       const response = await fetch(
//         `${API}/links/${linkId}?user_id=${loggedInUser.user_id}`,
//         { method: "DELETE" }
//       );

//       if (!response.ok) {
//         const data = await response.json();
//         console.error("Failed to delete link:", data);
//         return;
//       }

//       setLinks((current) => current.filter((link) => link.id !== linkId));
//     } catch (error) {
//       console.error("Could not delete link:", error);
//     }
//   };

//   const handleDeletePdf = async (pdfId: number) => {
//     if (!loggedInUser) {
//       return;
//     }

//     try {
//       const response = await fetch(
//         `${API}/pdfs/${pdfId}?user_id=${loggedInUser.user_id}`,
//         { method: "DELETE" }
//       );

//       if (!response.ok) {
//         const data = await response.json();
//         console.error("Failed to delete document:", data);
//         return;
//       }

//       setPdfs((current) => current.filter((pdf) => pdf.id !== pdfId));
//     } catch (error) {
//       console.error("Could not delete document:", error);
//     }
//   };

//   const handleLogout = () => {
//     setLoggedInUser(null);
//     setCircles([]);
//     setSelectedCircle(null);
//     setCircleMembers([]);
//     setPosts([]);
//     setComments({});
//     setAlbumItems([]);
//     setPolls([]);
//     setMoodboard([]);
//     setLinks([]);
//     setPdfs([]);
//     setShowMembers(false);
//   };

//   const countVotes = (poll: PollItem, option: string) =>
//     Object.values(poll.votes || {}).filter((vote) => vote === option).length;

//   useEffect(() => {
//     if (loggedInUser) {
//       fetchCircles();
//     }
//   }, [loggedInUser]);

//   useEffect(() => {
//     if (!selectedCircle) {
//       return;
//     }

//     fetchPosts(selectedCircle.id);

//     if (loggedInUser) {
//       const { user_id } = loggedInUser;
//       fetchAlbum(selectedCircle.id, user_id);
//       fetchPolls(selectedCircle.id, user_id);
//       fetchMoodboard(selectedCircle.id, user_id);
//       fetchLinks(selectedCircle.id, user_id);
//       fetchPdfs(selectedCircle.id, user_id);
//       fetchCircleMembers(selectedCircle.id, user_id);
//     } else {
//       setAlbumItems([]);
//       setPolls([]);
//       setMoodboard([]);
//       setLinks([]);
//       setPdfs([]);
//       setCircleMembers([]);
//     }

//     setActiveTab("board");
//   }, [selectedCircle, loggedInUser]);

//   useEffect(() => {
//     posts.forEach((post) => {
//       fetchComments(post.id);
//     });
//   }, [posts]);

//   return (
//     <div className="page">
//       <header className="topbar">
//         <div>
//           <p className="eyebrow"></p>
//           <h1>Season 22 : Pilot</h1>
//         </div>

//         <div className="account">
//           {!loggedInUser ? (
//             <>
//               <button
//                 className="login"
//                 onClick={() => {
//                   setLoginError("");
//                   setShowLogin(true);
//                 }}
//               >
//                 log in
//               </button>

//               <button
//                 className="signup"
//                 onClick={() => {
//                   setSignupError("");
//                   setSignupMessage("");
//                   setShowSignup(true);
//                 }}
//               >
//                 sign up
//               </button>
//             </>
//           ) : (
//             <>
//               <span>hi, {loggedInUser.name}</span>

//               {isSelectedCircleAdmin && (
//                 <button
//                   className="signup"
//                   onClick={() => {
//                     setPostError("");
//                     setShowCreatePost(true);
//                   }}
//                 >
//                   new post
//                 </button>
//               )}

//               <button className="login" onClick={handleLogout}>
//                 log out
//               </button>
//             </>
//           )}
//         </div>
//       </header>

//       <main className="board">
//         <div className="circle-bar">
//           <div className="circle-selector">
//             {circles.map((circle) => (
//               <button
//                 key={circle.id}
//                 className={
//                   selectedCircle?.id === circle.id
//                     ? "circle-button active"
//                     : "circle-button"
//                 }
//                 onClick={() => setSelectedCircle(circle)}
//               >
//                 {circle.name}
//               </button>
//             ))}
//           </div>

//           {selectedCircle && (
//             <div className="tabs">
//               <button
//                 className={activeTab === "board" ? "tab active" : "tab"}
//                 onClick={() => setActiveTab("board")}
//               >
//                 board
//               </button>

//               <button
//                 className={activeTab === "album" ? "tab active" : "tab"}
//                 onClick={() => setActiveTab("album")}
//               >
//                 album
//               </button>

//               <button
//                 className={activeTab === "moodboard" ? "tab active" : "tab"}
//                 onClick={() => setActiveTab("moodboard")}
//               >
//                 moodboard
//               </button>

//               <button
//                 className={activeTab === "notice" ? "tab active" : "tab"}
//                 onClick={() => setActiveTab("notice")}
//               >
//                 notice
//               </button>

//               <button className="tab" onClick={() => setShowMembers(true)}>
//                 members
//               </button>
//             </div>
//           )}
//         </div>

//         {activeTab === "board" && (
//           <>
//             <div className="board-header">
//               <div>
//                 <p className="small-label"></p>
//                 <h2>what&apos;s happening?</h2>
//                 {selectedCircle && <p>{selectedCircle.name}</p>}
//               </div>

//               <div className="board-note">
//                 <span>Tip:</span>
//                 <p>if you missed it, scroll back.</p>
//               </div>
//             </div>

//             <div className="tape tape-one" />
//             <div className="tape tape-two" />

//             <section className="posts">
//               {posts.length === 0 ? (
//                 <p className="no-comments">nothing here yet.</p>
//               ) : (
//                 posts.map((post, index) => (
//                   <article
//                     key={post.id}
//                     className={`post ${
//                       index % 3 === 0
//                         ? "green-paper"
//                         : index % 3 === 1
//                           ? "yellow-paper"
//                           : "pink-paper"
//                     }`}
//                   >
//                     <h3>{post.title}</h3>
//                     <p>{post.content}</p>

//                     <div className="scribble">
//                       {new Date(post.created_at).toLocaleDateString()}
//                     </div>

//                     <div className="comments">
//                       <p className="small-label">COMMENTS</p>

//                       {comments[post.id]?.length > 0 ? (
//                         comments[post.id].map((comment) => (
//                           <div className="comment" key={comment.id}>
//                             <p>{comment.content}</p>
//                             <span>
//                               {new Date(comment.created_at).toLocaleDateString()}
//                             </span>
//                           </div>
//                         ))
//                       ) : (
//                         <p className="no-comments">no comments yet.</p>
//                       )}

//                       {loggedInUser && (
//                         <div className="comment-form">
//                           <input
//                             type="text"
//                             placeholder="write a comment..."
//                             value={commentText[post.id] || ""}
//                             onChange={(e) =>
//                               setCommentText((previous) => ({
//                                 ...previous,
//                                 [post.id]: e.target.value,
//                               }))
//                             }
//                           />

//                           <button
//                             type="button"
//                             onClick={() => handleCreateComment(post.id)}
//                             disabled={commentLoading[post.id]}
//                           >
//                             {commentLoading[post.id] ? "..." : "send"}
//                           </button>
//                         </div>
//                       )}

//                       {commentError[post.id] && <p>{commentError[post.id]}</p>}
//                     </div>
//                   </article>
//                 ))
//               )}
//             </section>
//           </>
//         )}

//         {activeTab === "album" && (
//           <section className="scrapbook">
//             <div className="scrapbook-header">
//               <div>
//                 <p className="small-label">MEMORY LANE</p>
//                 <h2>{selectedCircle?.name}</h2>
//                 <p>little memories worth keeping.</p>
//               </div>

//               {loggedInUser && (
//                 <button
//                   className="signup"
//                   onClick={() => {
//                     setAlbumError("");
//                     setShowAlbumForm(true);
//                   }}
//                 >
//                   add memory
//                 </button>
//               )}
//             </div>

//             {albumItems.length === 0 ? (
//               <div className="scrapbook-empty">
//                 <p>no memories here yet.</p>
//                 {loggedInUser && <p>add the first one :)</p>}
//               </div>
//             ) : (
//               <div className="scrapbook-grid">
//                 {albumItems.map((item) => (
//                   <article className="scrapbook-card" key={item.id}>
//                     <img
//                       src={item.content_url}
//                       alt={item.caption || "Album memory"}
//                       className="scrapbook-image"
//                     />

//                     {item.caption && (
//                       <p className="scrapbook-caption">{item.caption}</p>
//                     )}

//                     <div className="scrapbook-meta">
//                       <span>
//                         {new Date(item.created_at).toLocaleDateString()}
//                       </span>

//                       {isSelectedCircleAdmin && (
//                         <button
//                           type="button"
//                           onClick={() => handleDeleteAlbumItem(item.id)}
//                         >
//                           delete
//                         </button>
//                       )}
//                     </div>
//                   </article>
//                 ))}
//               </div>
//             )}
//           </section>
//         )}

//         {activeTab === "moodboard" && (
//           <section className="moodboard-section">
//             <div className="scrapbook-header">
//               <div>
//                 <p className="small-label">MOODBOARDS</p>
//                 <h2>{selectedCircle?.name}</h2>
//                 <p>collections of images, ideas, and inspiration.</p>
//               </div>

//               {loggedInUser && (
//                 <button
//                   className="signup"
//                   onClick={() => {
//                     setMoodboardError("");
//                     setShowMoodboardForm(true);
//                   }}
//                 >
//                   create moodboard
//                 </button>
//               )}
//             </div>

//             {moodboard.length === 0 ? (
//               <div className="scrapbook-empty">
//                 <p>no moodboards here yet.</p>
//                 {loggedInUser && <p>create the first one :)</p>}
//               </div>
//             ) : (
//               <div className="moodboard-grid">
//                 {moodboard.map((board) => (
//                   <article className="moodboard-card" key={board.id}>
//                     <div className="moodboard-images">
//                       {board.images.map((image, index) => (
//                         <img
//                           key={index}
//                           src={image}
//                           alt={board.title || `Moodboard image ${index + 1}`}
//                           className="moodboard-image"
//                         />
//                       ))}
//                     </div>

//                     <div className="moodboard-info">
//                       <h3>{board.title}</h3>

//                       <div className="scrapbook-meta">
//                         <span>
//                           {new Date(board.created_at).toLocaleDateString()}
//                         </span>

//                         {isSelectedCircleAdmin && (
//                           <button
//                             type="button"
//                             onClick={() => handleDeleteMoodboard(board.id)}
//                           >
//                             delete
//                           </button>
//                         )}
//                       </div>
//                     </div>
//                   </article>
//                 ))}
//               </div>
//             )}
//           </section>
//         )}

//         {activeTab === "notice" && (
//           <section className="notice-board">
//             <div className="notice-header">
//               <div>
//                 <p className="small-label">NOTICE BOARD</p>
//                 <h2>{selectedCircle?.name}</h2>
//                 <p>important things, polls, documents, and links.</p>
//               </div>

//               {loggedInUser && (
//                 <div className="notice-actions">
//                   <button
//                     className="signup"
//                     onClick={() => {
//                       setPollError("");
//                       setShowPollForm(true);
//                     }}
//                   >
//                     new poll
//                   </button>

//                   <button
//                     className="signup"
//                     onClick={() => setShowLinkForm(true)}
//                   >
//                     add link
//                   </button>
//                 </div>
//               )}
//             </div>

//             <div className="notice-section">
//               <p className="small-label">POLLS</p>

//               {polls.length === 0 ? (
//                 <p className="notice-empty">no polls yet.</p>
//               ) : (
//                 <div className="poll-list">
//                   {polls.map((poll) => {
//                     const userVote =
//                       loggedInUser &&
//                       poll.votes?.[String(loggedInUser.user_id)];

//                     return (
//                       <article className="poll-card" key={poll.id}>
//                         <h3>{poll.question}</h3>

//                         <div className="poll-options">
//                           {poll.options.map((option) => (
//                             <button
//                               type="button"
//                               key={option}
//                               className={
//                                 userVote === option ? "poll-option voted" : "poll-option"
//                               }
//                               onClick={() => handleVote(poll.id, option)}
//                             >
//                               {option} ({countVotes(poll, option)})
//                             </button>
//                           ))}
//                         </div>

//                         <div className="scrapbook-meta">
//                           <span>
//                             {new Date(poll.created_at).toLocaleDateString()}
//                           </span>

//                           {isSelectedCircleAdmin && (
//                             <button
//                               type="button"
//                               onClick={() => handleDeletePoll(poll.id)}
//                             >
//                               delete
//                             </button>
//                           )}
//                         </div>
//                       </article>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>

//             <div className="notice-section">
//               <p className="small-label">DOCUMENTS</p>

//               {pdfs.length === 0 ? (
//                 <p className="notice-empty">no documents yet.</p>
//               ) : (
//                 <div className="notice-links">
//                   {pdfs.map((pdf) => (
//                     <article className="notice-link-card" key={pdf.id}>
//                       <div>
//                         <h3>{pdf.title}</h3>
//                       </div>

//                       <a
//                         href={pdf.pdf_url}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                       >
//                         view pdf
//                       </a>

//                       {isSelectedCircleAdmin && (
//                         <button
//                           type="button"
//                           onClick={() => handleDeletePdf(pdf.id)}
//                         >
//                           delete
//                         </button>
//                       )}
//                     </article>
//                   ))}
//                 </div>
//               )}
//             </div>

//             <div className="notice-section">
//               <p className="small-label">LINKS</p>

//               {links.length === 0 ? (
//                 <p className="notice-empty">no links yet.</p>
//               ) : (
//                 <div className="notice-links">
//                   {links.map((link) => (
//                     <article className="notice-link-card" key={link.id}>
//                       <div>
//                         {link.platform && (
//                           <p className="small-label">{link.platform}</p>
//                         )}
//                         <h3>{link.title}</h3>
//                       </div>

//                       <a
//                         href={link.url}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                       >
//                         open link
//                       </a>

//                       {isSelectedCircleAdmin && (
//                         <button
//                           type="button"
//                           onClick={() => handleDeleteLink(link.id)}
//                         >
//                           delete
//                         </button>
//                       )}
//                     </article>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </section>
//         )}
//       </main>

//       <footer>
//         <p>just a place for my favorite people.</p>
//       </footer>

//       {showLogin && (
//         <div className="auth-overlay">
//           <div className="auth-box">
//             <button className="close" onClick={() => setShowLogin(false)}>
//               ×
//             </button>

//             <p className="small-label">WELCOME BACK</p>
//             <h2>log in</h2>

//             <form onSubmit={handleLogin}>
//               <input
//                 type="email"
//                 placeholder="email"
//                 value={loginEmail}
//                 onChange={(e) => setLoginEmail(e.target.value)}
//                 required
//               />

//               <input
//                 type="password"
//                 placeholder="password"
//                 value={loginPassword}
//                 onChange={(e) => setLoginPassword(e.target.value)}
//                 required
//               />

//               {loginError && <p>{loginError}</p>}

//               <button className="auth-submit" type="submit">
//                 enter
//               </button>
//             </form>
//           </div>
//         </div>
//       )}

//       {showSignup && (
//         <div className="modal">
//           <div className="modal-box">
//             <button onClick={() => setShowSignup(false)}>×</button>
//             <h2>sign up</h2>

//             <form onSubmit={handleSignup}>
//               <input
//                 placeholder="name"
//                 value={signupName}
//                 onChange={(e) => setSignupName(e.target.value)}
//                 required
//               />

//               <input
//                 type="email"
//                 placeholder="email"
//                 value={signupEmail}
//                 onChange={(e) => setSignupEmail(e.target.value)}
//                 required
//               />

//               <input
//                 type="password"
//                 placeholder="password"
//                 value={signupPassword}
//                 onChange={(e) => setSignupPassword(e.target.value)}
//                 required
//               />

//               {signupError && <p>{signupError}</p>}
//               {signupMessage && <p>{signupMessage}</p>}

//               <button type="submit" disabled={signupLoading}>
//                 {signupLoading ? "joining..." : "join"}
//               </button>
//             </form>
//           </div>
//         </div>
//       )}

//       {showCreatePost && (
//         <div className="modal">
//           <div className="modal-box">
//             <button onClick={() => setShowCreatePost(false)}>×</button>

//             <p className="small-label">COMMUNITY BOARD</p>
//             <h2>new post</h2>
//             <p className="selected-circle-label">{selectedCircle?.name}</p>

//             <form onSubmit={handleCreatePost}>
//               <input
//                 placeholder="title"
//                 value={postTitle}
//                 onChange={(e) => setPostTitle(e.target.value)}
//                 required
//               />

//               <textarea
//                 placeholder="what's happening?"
//                 value={postContent}
//                 onChange={(e) => setPostContent(e.target.value)}
//                 required
//               />

//               {postError && <p>{postError}</p>}

//               <button type="submit" disabled={postLoading}>
//                 {postLoading ? "posting..." : "post"}
//               </button>
//             </form>
//           </div>
//         </div>
//       )}

//       {showAlbumForm && (
//         <div className="modal">
//           <div className="modal-box">
//             <button onClick={() => setShowAlbumForm(false)}>×</button>

//             <p className="small-label">MEMORY LANE</p>
//             <h2>add a memory</h2>

//             <form onSubmit={handleCreateAlbumItem}>
//               <input
//                 type="url"
//                 placeholder="image URL"
//                 value={albumUrl}
//                 onChange={(e) => setAlbumUrl(e.target.value)}
//                 required
//               />

//               <input
//                 type="text"
//                 placeholder="caption (optional)"
//                 value={albumCaption}
//                 onChange={(e) => setAlbumCaption(e.target.value)}
//               />

//               {albumError && <p>{albumError}</p>}

//               <button type="submit" disabled={albumLoading}>
//                 {albumLoading ? "adding..." : "save memory"}
//               </button>
//             </form>
//           </div>
//         </div>
//       )}

//       {showMoodboardForm && (
//         <div className="modal">
//           <div className="modal-box">
//             <button onClick={() => setShowMoodboardForm(false)}>×</button>

//             <p className="small-label">MOODBOARDS</p>
//             <h2>create moodboard</h2>

//             <form onSubmit={handleCreateMoodboard}>
//               <input
//                 type="text"
//                 placeholder="title"
//                 value={moodboardTitle}
//                 onChange={(e) => setMoodboardTitle(e.target.value)}
//                 required
//               />

//               {moodboardImages.map((image, index) => (
//                 <input
//                   key={index}
//                   type="url"
//                   placeholder={`image URL ${index + 1}`}
//                   value={image}
//                   onChange={(e) =>
//                     setMoodboardImages((current) =>
//                       current.map((item, i) =>
//                         i === index ? e.target.value : item
//                       )
//                     )
//                   }
//                   required={index < 2}
//                 />
//               ))}

//               {moodboardImages.length < 8 && (
//                 <button
//                   type="button"
//                   onClick={() =>
//                     setMoodboardImages((current) => [...current, ""])
//                   }
//                 >
//                   add image
//                 </button>
//               )}

//               {moodboardImages.length > 2 && (
//                 <button
//                   type="button"
//                   onClick={() =>
//                     setMoodboardImages((current) => current.slice(0, -1))
//                   }
//                 >
//                   remove image
//                 </button>
//               )}

//               {moodboardError && <p>{moodboardError}</p>}

//               <button type="submit" disabled={moodboardLoading}>
//                 {moodboardLoading ? "creating..." : "create moodboard"}
//               </button>
//             </form>
//           </div>
//         </div>
//       )}

//       {showLinkForm && (
//         <div className="modal">
//           <div className="modal-box">
//             <button onClick={() => setShowLinkForm(false)}>×</button>

//             <p className="small-label">NOTICE BOARD</p>
//             <h2>add link</h2>

//             <form onSubmit={handleCreateLink}>
//               <input
//                 placeholder="title"
//                 value={linkTitle}
//                 onChange={(e) => setLinkTitle(e.target.value)}
//                 required
//               />

//               <input
//                 type="url"
//                 placeholder="URL"
//                 value={linkUrl}
//                 onChange={(e) => setLinkUrl(e.target.value)}
//                 required
//               />

//               <input
//                 placeholder="platform (Pinterest, YouTube, Google Forms, etc.)"
//                 value={linkPlatform}
//                 onChange={(e) => setLinkPlatform(e.target.value)}
//               />

//               {linkError && <p>{linkError}</p>}

//               <button type="submit" disabled={linkLoading}>
//                 {linkLoading ? "adding..." : "add link"}
//               </button>
//             </form>
//           </div>
//         </div>
//       )}

//       {showMembers && (
//         <div className="modal">
//           <div className="modal-box">
//             <button onClick={() => setShowMembers(false)}>×</button>

//             <p className="small-label">CIRCLE</p>
//             <h2>{selectedCircle?.name}</h2>

//             <div className="member-list">
//               {circleMembers.length === 0 ? (
//                 <p>no members found.</p>
//               ) : (
//                 circleMembers.map((member) => (
//                   <div className="member-card" key={member.user_id}>
//                     <div className="member-name">
//                       {member.role === "admin" && (
//                         <span className="admin-dot" title="Admin" />
//                       )}
//                       <span>{member.name}</span>
//                     </div>

//                     {isSelectedCircleAdmin && member.email && (
//                       <p>{member.email}</p>
//                     )}
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {showPollForm && (
//         <div className="modal">
//           <div className="modal-box">
//             <button onClick={() => setShowPollForm(false)}>×</button>

//             <p className="small-label">NOTICE BOARD</p>
//             <h2>new poll</h2>

//             <form onSubmit={handleCreatePoll}>
//               <input
//                 placeholder="question"
//                 value={pollQuestion}
//                 onChange={(e) => setPollQuestion(e.target.value)}
//                 required
//               />

//               {pollOptions.map((option, index) => (
//                 <input
//                   key={index}
//                   placeholder={`option ${index + 1}`}
//                   value={option}
//                   onChange={(e) =>
//                     setPollOptions((current) =>
//                       current.map((item, i) =>
//                         i === index ? e.target.value : item
//                       )
//                     )
//                   }
//                   required
//                 />
//               ))}

//               {pollOptions.length < 8 && (
//                 <button
//                   type="button"
//                   onClick={() =>
//                     setPollOptions((current) => [...current, ""])
//                   }
//                 >
//                   add option
//                 </button>
//               )}

//               {pollOptions.length > 2 && (
//                 <button
//                   type="button"
//                   onClick={() =>
//                     setPollOptions((current) => current.slice(0, -1))
//                   }
//                 >
//                   remove option
//                 </button>
//               )}

//               {pollError && <p>{pollError}</p>}

//               <button type="submit" disabled={pollLoading}>
//                 {pollLoading ? "creating..." : "create poll"}
//               </button>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;










import { useEffect, useRef, useState, type ChangeEvent, type DragEvent, type FormEvent } from "react";
import "./App.css";

const API = "http://127.0.0.1:8000";

type Tab = "board" | "album" | "members";
type LinkCategory = "notice" | "song";

interface Post {
  id: number;
  title: string;
  content: string;
  circle_id: number;
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
}

interface Circle {
  id: number;
  name: string;
  description: string | null;
  created_by: number;
  invite_code: string;
  created_at: string;
}

interface CircleMember {
  user_id: number;
  name: string;
  role: string;
  email?: string;
  approved?: boolean;
}

interface AlbumItem {
  id: number;
  circle_id: number;
  user_id: number;
  item_type: string;
  content_url: string;
  caption: string | null;
  created_at: string;
}

interface PollItem {
  id: number;
  circle_id: number;
  user_id: number;
  question: string;
  options: string[];
  votes: Record<string, string>;
  created_at: string;
}

interface MoodboardItem {
  id: number;
  circle_id: number;
  user_id: number;
  title: string;
  images: string[];
  created_at: string;
}

interface LinkItem {
  id: number;
  circle_id: number;
  user_id: number;
  title: string;
  url: string;
  platform: string | null;
  category: LinkCategory;
  created_at: string;
}

interface PdfItem {
  id: number;
  circle_id: number;
  user_id: number;
  title: string;
  pdf_url: string;
  created_at: string;
}

// Resolves a stored image path (relative "/static/..." from uploads, or a
// legacy absolute URL) into something an <img> can load.
const resolveImageUrl = (url: string) =>
  url.startsWith("/") ? `${API}${url}` : url;

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const [posts, setPosts] = useState<Post[]>([]);
  const [circles, setCircles] = useState<Circle[]>([]);
  const [selectedCircle, setSelectedCircle] = useState<Circle | null>(null);
  const [circleMembers, setCircleMembers] = useState<CircleMember[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>("board");

  const [showCreatePost, setShowCreatePost] = useState(false);
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postError, setPostError] = useState("");
  const [postLoading, setPostLoading] = useState(false);

  const [albumItems, setAlbumItems] = useState<AlbumItem[]>([]);
  const [polls, setPolls] = useState<PollItem[]>([]);
  const [moodboard, setMoodboard] = useState<MoodboardItem[]>([]);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [pdfs, setPdfs] = useState<PdfItem[]>([]);

  // Album photo upload (device file, not URL)
  const [showAlbumForm, setShowAlbumForm] = useState(false);
  const [albumFile, setAlbumFile] = useState<File | null>(null);
  const [albumPreview, setAlbumPreview] = useState<string | null>(null);
  const [albumCaption, setAlbumCaption] = useState("");
  const [albumError, setAlbumError] = useState("");
  const [albumLoading, setAlbumLoading] = useState(false);
  const [albumDragOver, setAlbumDragOver] = useState(false);
  const albumFileInputRef = useRef<HTMLInputElement>(null);

  const [showPollForm, setShowPollForm] = useState(false);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const [pollError, setPollError] = useState("");
  const [pollLoading, setPollLoading] = useState(false);

  // Moodboard: device files (2-8), not URLs
  const [showMoodboardForm, setShowMoodboardForm] = useState(false);
  const [moodboardTitle, setMoodboardTitle] = useState("");
  const [moodboardFiles, setMoodboardFiles] = useState<File[]>([]);
  const [moodboardPreviews, setMoodboardPreviews] = useState<string[]>([]);
  const [moodboardError, setMoodboardError] = useState("");
  const [moodboardLoading, setMoodboardLoading] = useState(false);
  const [moodboardDragOver, setMoodboardDragOver] = useState(false);
  const moodboardFileInputRef = useRef<HTMLInputElement>(null);

  // Shared link form, used for both Notice links (Board) and Songs (Album)
  const [showLinkForm, setShowLinkForm] = useState(false);
  const [linkCategory, setLinkCategory] = useState<LinkCategory>("notice");
  const [linkTitle, setLinkTitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkPlatform, setLinkPlatform] = useState("");
  const [linkError, setLinkError] = useState("");
  const [linkLoading, setLinkLoading] = useState(false);

  const [comments, setComments] = useState<Record<number, Comment[]>>({});
  const [commentText, setCommentText] = useState<Record<number, string>>({});
  const [commentError, setCommentError] = useState<Record<number, string>>({});
  const [commentLoading, setCommentLoading] = useState<Record<number, boolean>>({});

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupError, setSignupError] = useState("");
  const [signupMessage, setSignupMessage] = useState("");
  const [signupLoading, setSignupLoading] = useState(false);

  const [loggedInUser, setLoggedInUser] = useState<LoggedInUser | null>(null);

  const currentMembership = circleMembers.find(
    (member) => member.user_id === loggedInUser?.user_id
  );

  const isSelectedCircleAdmin = currentMembership?.role === "admin";

  const albumPhotos = albumItems.filter((item) => item.item_type === "photo");
  const songLinks = links.filter((link) => link.category === "song");
  const noticeLinks = links.filter((link) => link.category === "notice");

  const fetchCircles = async () => {
    try {
      const response = await fetch(`${API}/circles/`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to fetch circles.");
      }

      setCircles(data);

      if (data.length > 0) {
        setSelectedCircle((current) => current ?? data[0]);
      }
    } catch (error) {
      console.error("Failed to fetch circles:", error);
    }
  };

  const fetchPosts = async (circleId: number) => {
    try {
      const response = await fetch(`${API}/posts/circle/${circleId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to fetch posts.");
      }

      setPosts(data);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      setPosts([]);
    }
  };

  const fetchComments = async (postId: number) => {
    try {
      const response = await fetch(`${API}/comments/post/${postId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to fetch comments.");
      }

      setComments((previous) => ({
        ...previous,
        [postId]: data,
      }));
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    }
  };

  const fetchCircleMembers = async (circleId: number, userId: number) => {
    try {
      const response = await fetch(
        `${API}/circles/${circleId}/members?user_id=${userId}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to fetch members.");
      }

      setCircleMembers(data);
    } catch (error) {
      console.error("Failed to fetch circle members:", error);
      setCircleMembers([]);
    }
  };

  const fetchAlbum = async (circleId: number, userId: number) => {
    try {
      const response = await fetch(
        `${API}/scrapbook/${circleId}?user_id=${userId}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to fetch album.");
      }

      setAlbumItems(data);
    } catch (error) {
      console.error("Failed to fetch album:", error);
      setAlbumItems([]);
    }
  };

  const fetchPolls = async (circleId: number, userId: number) => {
    try {
      const response = await fetch(
        `${API}/polls/${circleId}?user_id=${userId}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to fetch polls.");
      }

      setPolls(data);
    } catch (error) {
      console.error("Failed to fetch polls:", error);
      setPolls([]);
    }
  };

  const fetchMoodboard = async (circleId: number, userId: number) => {
    try {
      const response = await fetch(
        `${API}/moodboards/${circleId}?user_id=${userId}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to fetch moodboards.");
      }

      setMoodboard(data);
    } catch (error) {
      console.error("Failed to fetch moodboards:", error);
      setMoodboard([]);
    }
  };

  const fetchLinks = async (circleId: number, userId: number) => {
    try {
      const response = await fetch(
        `${API}/links/${circleId}?user_id=${userId}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to fetch links.");
      }

      setLinks(data);
    } catch (error) {
      console.error("Failed to fetch links:", error);
      setLinks([]);
    }
  };

  const fetchPdfs = async (circleId: number, userId: number) => {
    try {
      const response = await fetch(
        `${API}/pdfs/${circleId}?user_id=${userId}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to fetch documents.");
      }

      setPdfs(data);
    } catch (error) {
      console.error("Failed to fetch documents:", error);
      setPdfs([]);
    }
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoginError("");

    try {
      const response = await fetch(`${API}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setLoginError(data.detail || "Login failed.");
        return;
      }

      setLoggedInUser({
        user_id: data.user_id,
        name: data.name,
      });

      await fetchCircles();

      setShowLogin(false);
      setLoginEmail("");
      setLoginPassword("");
    } catch (error) {
      console.error(error);
      setLoginError("Could not connect to the server.");
    }
  };

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();

    if (signupLoading) {
      return;
    }

    setSignupLoading(true);
    setSignupError("");
    setSignupMessage("");

    try {
      const response = await fetch(`${API}/users/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: signupName,
          email: signupEmail,
          password: signupPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setSignupError(data.detail || "Signup failed.");
        return;
      }

      setSignupMessage("Signup successful. You can log in now.");

      setSignupName("");
      setSignupEmail("");
      setSignupPassword("");
    } catch (error) {
      console.error(error);
      setSignupError("Could not connect to the server.");
    } finally {
      setSignupLoading(false);
    }
  };

  const handleCreatePost = async (e: FormEvent) => {
    e.preventDefault();

    if (postLoading || !loggedInUser || !selectedCircle) {
      return;
    }

    if (!isSelectedCircleAdmin) {
      setPostError("Only the circle admin can create posts.");
      return;
    }

    setPostLoading(true);
    setPostError("");

    try {
      const response = await fetch(`${API}/posts/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: postTitle,
          content: postContent,
          user_id: loggedInUser.user_id,
          circle_id: selectedCircle.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setPostError(data.detail || "Could not create post.");
        return;
      }

      setPostTitle("");
      setPostContent("");
      setShowCreatePost(false);

      await fetchPosts(selectedCircle.id);
    } catch (error) {
      console.error(error);
      setPostError("Could not connect to the server.");
    } finally {
      setPostLoading(false);
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

    setCommentLoading((previous) => ({ ...previous, [postId]: true }));
    setCommentError((previous) => ({ ...previous, [postId]: "" }));

    try {
      const response = await fetch(`${API}/comments/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          post_id: postId,
          user_id: loggedInUser.user_id,
          content: commentText[postId].trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setCommentError((previous) => ({
          ...previous,
          [postId]: data.detail || "Could not add comment.",
        }));
        return;
      }

      setCommentText((previous) => ({ ...previous, [postId]: "" }));
      await fetchComments(postId);
    } catch (error) {
      console.error("Failed to create comment:", error);
      setCommentError((previous) => ({
        ...previous,
        [postId]: "Could not connect to the server.",
      }));
    } finally {
      setCommentLoading((previous) => ({ ...previous, [postId]: false }));
    }
  };

  // Uploads a single device file to the backend's static upload storage
  // and returns the relative URL to store in Album/Moodboard records.
  const uploadImageFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API}/uploads/`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "Could not upload image.");
    }

    return data.url as string;
  };

  const resetAlbumForm = () => {
    setAlbumFile(null);
    setAlbumPreview((current) => {
      if (current) URL.revokeObjectURL(current);
      return null;
    });
    setAlbumCaption("");
    setAlbumDragOver(false);
  };

  const setAlbumSelectedFile = (file: File) => {
    setAlbumFile(file);
    setAlbumPreview((current) => {
      if (current) URL.revokeObjectURL(current);
      return URL.createObjectURL(file);
    });
    setAlbumError("");
  };

  const handleAlbumFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAlbumSelectedFile(file);
    }
  };

  const handleAlbumDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setAlbumDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setAlbumSelectedFile(file);
    }
  };

  const handleCreateAlbumItem = async (e: FormEvent) => {
    e.preventDefault();

    if (albumLoading || !loggedInUser || !selectedCircle) {
      return;
    }

    if (!albumFile) {
      setAlbumError("Please select an image from your device.");
      return;
    }

    setAlbumLoading(true);
    setAlbumError("");

    try {
      const contentUrl = await uploadImageFile(albumFile);

      const response = await fetch(`${API}/scrapbook/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          circle_id: selectedCircle.id,
          user_id: loggedInUser.user_id,
          item_type: "photo",
          content_url: contentUrl,
          caption: albumCaption.trim() || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setAlbumError(data.detail || "Could not add album item.");
        return;
      }

      setAlbumItems((current) => [data, ...current]);
      resetAlbumForm();
      setShowAlbumForm(false);
    } catch (error) {
      console.error(error);
      setAlbumError(
        error instanceof Error ? error.message : "Could not connect to the server."
      );
    } finally {
      setAlbumLoading(false);
    }
  };

  const handleDeleteAlbumItem = async (itemId: number) => {
    if (!loggedInUser) {
      return;
    }

    try {
      const response = await fetch(
        `${API}/scrapbook/${itemId}?user_id=${loggedInUser.user_id}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        const data = await response.json();
        console.error("Failed to delete album item:", data);
        return;
      }

      setAlbumItems((current) => current.filter((item) => item.id !== itemId));
    } catch (error) {
      console.error("Could not delete album item:", error);
    }
  };

  const resetMoodboardForm = () => {
    setMoodboardTitle("");
    setMoodboardFiles([]);
    setMoodboardPreviews((current) => {
      current.forEach((url) => URL.revokeObjectURL(url));
      return [];
    });
    setMoodboardDragOver(false);
  };

  const addMoodboardFiles = (files: FileList | File[]) => {
    const incoming = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    );

    if (incoming.length === 0) {
      return;
    }

    setMoodboardFiles((current) => {
      const combined = [...current, ...incoming].slice(0, 8);
      return combined;
    });
    setMoodboardError("");
  };

  useEffect(() => {
    setMoodboardPreviews((current) => {
      current.forEach((url) => URL.revokeObjectURL(url));
      return moodboardFiles.map((file) => URL.createObjectURL(file));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moodboardFiles]);

  const removeMoodboardFile = (index: number) => {
    setMoodboardFiles((current) => current.filter((_, i) => i !== index));
  };

  const handleMoodboardFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addMoodboardFiles(e.target.files);
      e.target.value = "";
    }
  };

  const handleMoodboardDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setMoodboardDragOver(false);
    if (e.dataTransfer.files) {
      addMoodboardFiles(e.dataTransfer.files);
    }
  };

  const handleCreateMoodboard = async (e: FormEvent) => {
    e.preventDefault();

    if (moodboardLoading || !loggedInUser || !selectedCircle) {
      return;
    }

    if (!moodboardTitle.trim()) {
      setMoodboardError("Enter a title.");
      return;
    }

    if (moodboardFiles.length < 2) {
      setMoodboardError("Select at least two images.");
      return;
    }

    if (moodboardFiles.length > 8) {
      setMoodboardError("You can add at most eight images.");
      return;
    }

    setMoodboardLoading(true);
    setMoodboardError("");

    try {
      const images = await Promise.all(moodboardFiles.map(uploadImageFile));

      const response = await fetch(`${API}/moodboards/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          circle_id: selectedCircle.id,
          user_id: loggedInUser.user_id,
          title: moodboardTitle.trim(),
          images,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMoodboardError(data.detail || "Could not create moodboard.");
        return;
      }

      setMoodboard((current) => [data, ...current]);
      resetMoodboardForm();
      setShowMoodboardForm(false);
    } catch (error) {
      console.error(error);
      setMoodboardError(
        error instanceof Error ? error.message : "Could not connect to the server."
      );
    } finally {
      setMoodboardLoading(false);
    }
  };

  const handleDeleteMoodboard = async (moodboardId: number) => {
    if (!loggedInUser) {
      return;
    }

    try {
      const response = await fetch(
        `${API}/moodboards/${moodboardId}?user_id=${loggedInUser.user_id}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        const data = await response.json();
        console.error("Failed to delete moodboard:", data);
        return;
      }

      setMoodboard((current) =>
        current.filter((board) => board.id !== moodboardId)
      );
    } catch (error) {
      console.error("Could not delete moodboard:", error);
    }
  };

  const handleCreatePoll = async (e: FormEvent) => {
    e.preventDefault();

    if (!loggedInUser || !selectedCircle) {
      return;
    }

    const validOptions = pollOptions.map((option) => option.trim()).filter(Boolean);

    if (!pollQuestion.trim()) {
      setPollError("Enter a question.");
      return;
    }

    if (validOptions.length < 2) {
      setPollError("Add at least two options.");
      return;
    }

    setPollLoading(true);
    setPollError("");

    try {
      const response = await fetch(`${API}/polls/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          circle_id: selectedCircle.id,
          user_id: loggedInUser.user_id,
          question: pollQuestion.trim(),
          options: validOptions,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setPollError(data.detail || "Could not create poll.");
        return;
      }

      setPolls((current) => [data, ...current]);
      setPollQuestion("");
      setPollOptions(["", ""]);
      setShowPollForm(false);
    } catch {
      setPollError("Could not connect to the server.");
    } finally {
      setPollLoading(false);
    }
  };

  const handleVote = async (pollId: number, option: string) => {
    if (!loggedInUser) {
      return;
    }

    try {
      const response = await fetch(`${API}/polls/${pollId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: loggedInUser.user_id,
          option,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Failed to vote:", data);
        return;
      }

      setPolls((current) =>
        current.map((poll) => (poll.id === pollId ? data : poll))
      );
    } catch (error) {
      console.error("Could not vote:", error);
    }
  };

  const handleDeletePoll = async (pollId: number) => {
    if (!loggedInUser) {
      return;
    }

    try {
      const response = await fetch(
        `${API}/polls/${pollId}?user_id=${loggedInUser.user_id}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        const data = await response.json();
        console.error("Failed to delete poll:", data);
        return;
      }

      setPolls((current) => current.filter((poll) => poll.id !== pollId));
    } catch (error) {
      console.error("Could not delete poll:", error);
    }
  };

  const openLinkForm = (category: LinkCategory) => {
    setLinkCategory(category);
    setLinkTitle("");
    setLinkUrl("");
    setLinkPlatform("");
    setLinkError("");
    setShowLinkForm(true);
  };

  const handleCreateLink = async (e: FormEvent) => {
    e.preventDefault();

    if (linkLoading || !loggedInUser || !selectedCircle) {
      return;
    }

    setLinkLoading(true);
    setLinkError("");

    try {
      const response = await fetch(`${API}/links/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          circle_id: selectedCircle.id,
          user_id: loggedInUser.user_id,
          title: linkTitle.trim(),
          url: linkUrl.trim(),
          platform: linkPlatform.trim() || null,
          category: linkCategory,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setLinkError(data.detail || "Could not add link.");
        return;
      }

      setLinks((current) => [data, ...current]);
      setLinkTitle("");
      setLinkUrl("");
      setLinkPlatform("");
      setShowLinkForm(false);
    } catch (error) {
      console.error(error);
      setLinkError("Could not connect to the server.");
    } finally {
      setLinkLoading(false);
    }
  };

  const handleDeleteLink = async (linkId: number) => {
    if (!loggedInUser) {
      return;
    }

    try {
      const response = await fetch(
        `${API}/links/${linkId}?user_id=${loggedInUser.user_id}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        const data = await response.json();
        console.error("Failed to delete link:", data);
        return;
      }

      setLinks((current) => current.filter((link) => link.id !== linkId));
    } catch (error) {
      console.error("Could not delete link:", error);
    }
  };

  const handleDeletePdf = async (pdfId: number) => {
    if (!loggedInUser) {
      return;
    }

    try {
      const response = await fetch(
        `${API}/pdfs/${pdfId}?user_id=${loggedInUser.user_id}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        const data = await response.json();
        console.error("Failed to delete document:", data);
        return;
      }

      setPdfs((current) => current.filter((pdf) => pdf.id !== pdfId));
    } catch (error) {
      console.error("Could not delete document:", error);
    }
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    setCircles([]);
    setSelectedCircle(null);
    setCircleMembers([]);
    setPosts([]);
    setComments({});
    setAlbumItems([]);
    setPolls([]);
    setMoodboard([]);
    setLinks([]);
    setPdfs([]);
  };

  const countVotes = (poll: PollItem, option: string) =>
    Object.values(poll.votes || {}).filter((vote) => vote === option).length;

  useEffect(() => {
    if (loggedInUser) {
      fetchCircles();
    }
  }, [loggedInUser]);

  useEffect(() => {
    if (!selectedCircle) {
      return;
    }

    fetchPosts(selectedCircle.id);

    if (loggedInUser) {
      const { user_id } = loggedInUser;
      fetchAlbum(selectedCircle.id, user_id);
      fetchPolls(selectedCircle.id, user_id);
      fetchMoodboard(selectedCircle.id, user_id);
      fetchLinks(selectedCircle.id, user_id);
      fetchPdfs(selectedCircle.id, user_id);
      fetchCircleMembers(selectedCircle.id, user_id);
    } else {
      setAlbumItems([]);
      setPolls([]);
      setMoodboard([]);
      setLinks([]);
      setPdfs([]);
      setCircleMembers([]);
    }

    setActiveTab("board");
  }, [selectedCircle, loggedInUser]);

  useEffect(() => {
    posts.forEach((post) => {
      fetchComments(post.id);
    });
  }, [posts]);

  return (
    <div className="page">
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
              <span>hi, {loggedInUser.name}</span>

              {isSelectedCircleAdmin && (
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

              <button className="login" onClick={handleLogout}>
                log out
              </button>
            </>
          )}
        </div>
      </header>

      <main className="board">
        <div className="circle-bar">
          <div className="circle-selector">
            {circles.map((circle) => (
              <button
                key={circle.id}
                className={
                  selectedCircle?.id === circle.id
                    ? "circle-button active"
                    : "circle-button"
                }
                onClick={() => setSelectedCircle(circle)}
              >
                {circle.name}
              </button>
            ))}
          </div>

          {selectedCircle && (
            <div className="tabs">
              <button
                className={activeTab === "board" ? "tab active" : "tab"}
                onClick={() => setActiveTab("board")}
              >
                board
              </button>

              <button
                className={activeTab === "album" ? "tab active" : "tab"}
                onClick={() => setActiveTab("album")}
              >
                album
              </button>

              <button
                className={activeTab === "members" ? "tab active" : "tab"}
                onClick={() => setActiveTab("members")}
              >
                members
              </button>
            </div>
          )}
        </div>

        {activeTab === "board" && (
          <>
            <div className="board-header">
              <div>
                <p className="small-label"></p>
                <h2>what&apos;s happening?</h2>
                {selectedCircle && <p>{selectedCircle.name}</p>}
              </div>

              <div className="board-note">
                <span>Tip:</span>
                <p>if you missed it, scroll back.</p>
              </div>
            </div>

            <div className="tape tape-one" />
            <div className="tape tape-two" />

            <section className="posts">
              {posts.length === 0 ? (
                <p className="no-comments">nothing here yet.</p>
              ) : (
                posts.map((post, index) => (
                  <article
                    key={post.id}
                    className={`post ${
                      index % 3 === 0
                        ? "green-paper"
                        : index % 3 === 1
                          ? "yellow-paper"
                          : "pink-paper"
                    }`}
                  >
                    <h3>{post.title}</h3>
                    <p>{post.content}</p>

                    <div className="scribble">
                      {new Date(post.created_at).toLocaleDateString()}
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
                        <p className="no-comments">no comments yet.</p>
                      )}

                      {loggedInUser && (
                        <div className="comment-form">
                          <input
                            type="text"
                            placeholder="write a comment..."
                            value={commentText[post.id] || ""}
                            onChange={(e) =>
                              setCommentText((previous) => ({
                                ...previous,
                                [post.id]: e.target.value,
                              }))
                            }
                          />

                          <button
                            type="button"
                            onClick={() => handleCreateComment(post.id)}
                            disabled={commentLoading[post.id]}
                          >
                            {commentLoading[post.id] ? "..." : "send"}
                          </button>
                        </div>
                      )}

                      {commentError[post.id] && <p>{commentError[post.id]}</p>}
                    </div>
                  </article>
                ))
              )}
            </section>

            <section className="moodboard-section">
              <div className="scrapbook-header">
                <div>
                  <p className="small-label">MOODBOARDS</p>
                  <h2>collections of images, ideas, and inspiration.</h2>
                </div>

                {loggedInUser && (
                  <button
                    className="signup"
                    onClick={() => {
                      setMoodboardError("");
                      setShowMoodboardForm(true);
                    }}
                  >
                    create moodboard
                  </button>
                )}
              </div>

              {moodboard.length === 0 ? (
                <div className="scrapbook-empty">
                  <p>no moodboards here yet.</p>
                  {loggedInUser && <p>create the first one :)</p>}
                </div>
              ) : (
                <div className="moodboard-grid">
                  {moodboard.map((mb) => (
                    <article className="moodboard-card" key={mb.id}>
                      <div className="moodboard-images">
                        {mb.images.map((image, index) => (
                          <img
                            key={index}
                            src={resolveImageUrl(image)}
                            alt={mb.title || `Moodboard image ${index + 1}`}
                            className="moodboard-image"
                            style={{
                              width: "100%",
                              height: "220px",
                              maxWidth: "100%",
                              objectFit: "contain",
                              display: "block",
                            }}
                          />
                        ))}
                      </div>

                      <div className="moodboard-info">
                        <h3>{mb.title}</h3>

                        <div className="scrapbook-meta">
                          <span>
                            {new Date(mb.created_at).toLocaleDateString()}
                          </span>

                          {isSelectedCircleAdmin && (
                            <button
                              type="button"
                              onClick={() => handleDeleteMoodboard(mb.id)}
                            >
                              delete
                            </button>
                          )}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>

            <section className="notice-board">
              <div className="notice-header">
                <div>
                  <p className="small-label">NOTICE BOARD</p>
                  <p>important things, polls, documents, and links.</p>
                </div>

                {loggedInUser && (
                  <div className="notice-actions">
                    <button
                      className="signup"
                      onClick={() => {
                        setPollError("");
                        setShowPollForm(true);
                      }}
                    >
                      new poll
                    </button>

                    <button
                      className="signup"
                      onClick={() => openLinkForm("notice")}
                    >
                      add link
                    </button>
                  </div>
                )}
              </div>

              <div className="notice-section">
                <p className="small-label">POLLS</p>

                {polls.length === 0 ? (
                  <p className="notice-empty">no polls yet.</p>
                ) : (
                  <div className="poll-list">
                    {polls.map((poll) => {
                      const userVote =
                        loggedInUser &&
                        poll.votes?.[String(loggedInUser.user_id)];

                      return (
                        <article className="poll-card" key={poll.id}>
                          <h3>{poll.question}</h3>

                          <div className="poll-options">
                            {poll.options.map((option) => (
                              <button
                                type="button"
                                key={option}
                                className={
                                  userVote === option ? "poll-option voted" : "poll-option"
                                }
                                onClick={() => handleVote(poll.id, option)}
                              >
                                {option} ({countVotes(poll, option)})
                              </button>
                            ))}
                          </div>

                          <div className="scrapbook-meta">
                            <span>
                              {new Date(poll.created_at).toLocaleDateString()}
                            </span>

                            {isSelectedCircleAdmin && (
                              <button
                                type="button"
                                onClick={() => handleDeletePoll(poll.id)}
                              >
                                delete
                              </button>
                            )}
                          </div>
                        </article>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="notice-section">
                <p className="small-label">DOCUMENTS</p>

                {pdfs.length === 0 ? (
                  <p className="notice-empty">no documents yet.</p>
                ) : (
                  <div className="notice-links">
                    {pdfs.map((pdf) => (
                      <article className="notice-link-card" key={pdf.id}>
                        <div>
                          <h3>{pdf.title}</h3>
                        </div>

                        <a
                          href={pdf.pdf_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          view pdf
                        </a>

                        {isSelectedCircleAdmin && (
                          <button
                            type="button"
                            onClick={() => handleDeletePdf(pdf.id)}
                          >
                            delete
                          </button>
                        )}
                      </article>
                    ))}
                  </div>
                )}
              </div>

              <div className="notice-section">
                <p className="small-label">LINKS</p>

                {noticeLinks.length === 0 ? (
                  <p className="notice-empty">no links yet.</p>
                ) : (
                  <div className="notice-links">
                    {noticeLinks.map((link) => (
                      <article className="notice-link-card" key={link.id}>
                        <div>
                          {link.platform && (
                            <p className="small-label">{link.platform}</p>
                          )}
                          <h3>{link.title}</h3>
                        </div>

                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          open link
                        </a>

                        {isSelectedCircleAdmin && (
                          <button
                            type="button"
                            onClick={() => handleDeleteLink(link.id)}
                          >
                            delete
                          </button>
                        )}
                      </article>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </>
        )}

        {activeTab === "album" && (
          <>
            <section className="scrapbook">
              <div className="scrapbook-header">
                <div>
                  <p className="small-label">MEMORY LANE</p>
                  <h2>{selectedCircle?.name}</h2>
                  <p>little memories worth keeping.</p>
                </div>

                {loggedInUser && (
                  <button
                    className="signup"
                    onClick={() => {
                      setAlbumError("");
                      setShowAlbumForm(true);
                    }}
                  >
                    add memory
                  </button>
                )}
              </div>

              {albumPhotos.length === 0 ? (
                <div className="scrapbook-empty">
                  <p>no memories here yet.</p>
                  {loggedInUser && <p>add the first one :)</p>}
                </div>
              ) : (
                <div className="scrapbook-grid">
                  {albumPhotos.map((item) => (
                    <article className="scrapbook-card" key={item.id}>
                      <img
                        src={resolveImageUrl(item.content_url)}
                        alt={item.caption || "Album memory"}
                        className="scrapbook-image"
                      />

                      {item.caption && (
                        <p className="scrapbook-caption">{item.caption}</p>
                      )}

                      <div className="scrapbook-meta">
                        <span>
                          {new Date(item.created_at).toLocaleDateString()}
                        </span>

                        {isSelectedCircleAdmin && (
                          <button
                            type="button"
                            onClick={() => handleDeleteAlbumItem(item.id)}
                          >
                            delete
                          </button>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>

            <section className="notice-board">
              <div className="notice-header">
                <div>
                  <p className="small-label">SONGS</p>
                  <p>the soundtrack for this circle.</p>
                </div>

                {loggedInUser && (
                  <div className="notice-actions">
                    <button
                      className="signup"
                      onClick={() => openLinkForm("song")}
                    >
                      add song
                    </button>
                  </div>
                )}
              </div>

              <div className="notice-section">
                {songLinks.length === 0 ? (
                  <p className="notice-empty">no songs yet.</p>
                ) : (
                  <div className="notice-links">
                    {songLinks.map((link) => (
                      <article className="notice-link-card" key={link.id}>
                        <div>
                          {link.platform && (
                            <p className="small-label">{link.platform}</p>
                          )}
                          <h3>{link.title}</h3>
                        </div>

                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          play song
                        </a>

                        {isSelectedCircleAdmin && (
                          <button
                            type="button"
                            onClick={() => handleDeleteLink(link.id)}
                          >
                            delete
                          </button>
                        )}
                      </article>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </>
        )}

        {activeTab === "members" && (
          <section className="scrapbook">
            <div className="scrapbook-header">
              <div>
                <p className="small-label">CIRCLE</p>
                <h2>{selectedCircle?.name}</h2>
              </div>
            </div>

            <div className="member-list">
              {circleMembers.length === 0 ? (
                <p>no members found.</p>
              ) : (
                circleMembers.map((member) => (
                  <div className="member-card" key={member.user_id}>
                    <div className="member-name">
                      {member.role === "admin" && (
                        <span className="admin-dot" title="Admin" />
                      )}
                      <span>{member.name}</span>
                    </div>

                    {isSelectedCircleAdmin && member.email && (
                      <p>{member.email}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </section>
        )}
      </main>

      <footer>
        <p>just a place for my favorite people.</p>
      </footer>

      {showLogin && (
        <div className="auth-overlay">
          <div className="auth-box">
            <button className="close" onClick={() => setShowLogin(false)}>
              ×
            </button>

            <p className="small-label">WELCOME BACK</p>
            <h2>log in</h2>

            <form onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
              />

              <input
                type="password"
                placeholder="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />

              {loginError && <p>{loginError}</p>}

              <button className="auth-submit" type="submit">
                enter
              </button>
            </form>
          </div>
        </div>
      )}

      {showSignup && (
        <div className="modal">
          <div className="modal-box">
            <button onClick={() => setShowSignup(false)}>×</button>
            <h2>sign up</h2>

            <form onSubmit={handleSignup}>
              <input
                placeholder="name"
                value={signupName}
                onChange={(e) => setSignupName(e.target.value)}
                required
              />

              <input
                type="email"
                placeholder="email"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                required
              />

              <input
                type="password"
                placeholder="password"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                required
              />

              {signupError && <p>{signupError}</p>}
              {signupMessage && <p>{signupMessage}</p>}

              <button type="submit" disabled={signupLoading}>
                {signupLoading ? "joining..." : "join"}
              </button>
            </form>
          </div>
        </div>
      )}

      {showCreatePost && (
        <div className="modal">
          <div className="modal-box">
            <button onClick={() => setShowCreatePost(false)}>×</button>

            <p className="small-label">COMMUNITY BOARD</p>
            <h2>new post</h2>
            <p className="selected-circle-label">{selectedCircle?.name}</p>

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

              {postError && <p>{postError}</p>}

              <button type="submit" disabled={postLoading}>
                {postLoading ? "posting..." : "post"}
              </button>
            </form>
          </div>
        </div>
      )}

      {showAlbumForm && (
        <div className="modal">
          <div className="modal-box">
            <button
              onClick={() => {
                resetAlbumForm();
                setShowAlbumForm(false);
              }}
            >
              ×
            </button>

            <p className="small-label">MEMORY LANE</p>
            <h2>add a memory</h2>

            <form onSubmit={handleCreateAlbumItem}>
              <input
                ref={albumFileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAlbumFileInputChange}
                style={{ display: "none" }}
              />

              <div
                className={
                  albumDragOver ? "upload-dropzone dragover" : "upload-dropzone"
                }
                onClick={() => albumFileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setAlbumDragOver(true);
                }}
                onDragLeave={() => setAlbumDragOver(false)}
                onDrop={handleAlbumDrop}
              >
                {albumPreview ? (
                  <img
                    src={albumPreview}
                    alt="Selected preview"
                    className="upload-preview-image"
                  />
                ) : (
                  <p>click to choose an image, or drag and drop it here</p>
                )}
              </div>

              {albumFile && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    resetAlbumForm();
                  }}
                >
                  remove image
                </button>
              )}

              <input
                type="text"
                placeholder="caption (optional)"
                value={albumCaption}
                onChange={(e) => setAlbumCaption(e.target.value)}
              />

              {albumError && <p>{albumError}</p>}

              <button type="submit" disabled={albumLoading}>
                {albumLoading ? "adding..." : "save memory"}
              </button>
            </form>
          </div>
        </div>
      )}

      {showMoodboardForm && (
        <div className="modal">
          <div className="modal-box">
            <button
              onClick={() => {
                resetMoodboardForm();
                setShowMoodboardForm(false);
              }}
            >
              ×
            </button>

            <p className="small-label">MOODBOARDS</p>
            <h2>create moodboard</h2>

            <form onSubmit={handleCreateMoodboard}>
              <input
                type="text"
                placeholder="title"
                value={moodboardTitle}
                onChange={(e) => setMoodboardTitle(e.target.value)}
                required
              />

              <input
                ref={moodboardFileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleMoodboardFileInputChange}
                style={{ display: "none" }}
              />

              <div
                className={
                  moodboardDragOver
                    ? "upload-dropzone dragover"
                    : "upload-dropzone"
                }
                onClick={() => moodboardFileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setMoodboardDragOver(true);
                }}
                onDragLeave={() => setMoodboardDragOver(false)}
                onDrop={handleMoodboardDrop}
              >
                <p>
                  click to choose images, or drag and drop them here (2-8
                  images)
                </p>
              </div>

              {moodboardPreviews.length > 0 && (
                <div className="upload-preview-grid">
                  {moodboardPreviews.map((preview, index) => (
                    <div className="upload-preview-item" key={index}>
                      <img src={preview} alt={`Selected image ${index + 1}`} />
                      <button
                        type="button"
                        onClick={() => removeMoodboardFile(index)}
                      >
                        remove
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <p className="small-label">
                {moodboardFiles.length} / 8 images selected
              </p>

              {moodboardError && <p>{moodboardError}</p>}

              <button type="submit" disabled={moodboardLoading}>
                {moodboardLoading ? "creating..." : "create moodboard"}
              </button>
            </form>
          </div>
        </div>
      )}

      {showLinkForm && (
        <div className="modal">
          <div className="modal-box">
            <button onClick={() => setShowLinkForm(false)}>×</button>

            <p className="small-label">
              {linkCategory === "song" ? "ALBUM" : "NOTICE BOARD"}
            </p>
            <h2>{linkCategory === "song" ? "add song" : "add link"}</h2>

            <form onSubmit={handleCreateLink}>
              <input
                placeholder="title"
                value={linkTitle}
                onChange={(e) => setLinkTitle(e.target.value)}
                required
              />

              <input
                type="url"
                placeholder="URL"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                required
              />

              <input
                placeholder={
                  linkCategory === "song"
                    ? "platform (Spotify, YouTube, Apple Music, etc.)"
                    : "platform (Pinterest, YouTube, Google Forms, etc.)"
                }
                value={linkPlatform}
                onChange={(e) => setLinkPlatform(e.target.value)}
              />

              {linkError && <p>{linkError}</p>}

              <button type="submit" disabled={linkLoading}>
                {linkLoading
                  ? "adding..."
                  : linkCategory === "song"
                    ? "add song"
                    : "add link"}
              </button>
            </form>
          </div>
        </div>
      )}

      {showPollForm && (
        <div className="modal">
          <div className="modal-box">
            <button onClick={() => setShowPollForm(false)}>×</button>

            <p className="small-label">NOTICE BOARD</p>
            <h2>new poll</h2>

            <form onSubmit={handleCreatePoll}>
              <input
                placeholder="question"
                value={pollQuestion}
                onChange={(e) => setPollQuestion(e.target.value)}
                required
              />

              {pollOptions.map((option, index) => (
                <input
                  key={index}
                  placeholder={`option ${index + 1}`}
                  value={option}
                  onChange={(e) =>
                    setPollOptions((current) =>
                      current.map((item, i) =>
                        i === index ? e.target.value : item
                      )
                    )
                  }
                  required
                />
              ))}

              {pollOptions.length < 8 && (
                <button
                  type="button"
                  onClick={() =>
                    setPollOptions((current) => [...current, ""])
                  }
                >
                  add option
                </button>
              )}

              {pollOptions.length > 2 && (
                <button
                  type="button"
                  onClick={() =>
                    setPollOptions((current) => current.slice(0, -1))
                  }
                >
                  remove option
                </button>
              )}

              {pollError && <p>{pollError}</p>}

              <button type="submit" disabled={pollLoading}>
                {pollLoading ? "creating..." : "create poll"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
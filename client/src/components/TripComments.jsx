import axios from "axios";
import { useEffect, useState } from "react";
import jwt from 'jsonwebtoken';


const TripComments = ({ tripId }) => {
    // console.log("TripComments component is rendering");
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get(`https://discoverbuddy.onrender.com/api/trips/${tripId}/comments`);
                // console.log("Fetched comments:", response.data); // Log fetched comments
                setComments(response.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchComments();
    }, [tripId]);

    useEffect(() => {
        // console.log("Updated Comments:", comments);  // This will log after the state updates
    }, [comments]);

    const handleAddComment = async () => {
        try {
            const token = localStorage.getItem("token");
            const decoded = jwt.decode(token); 
            // console.log("Decoded token:", decoded); 
            const userId = decoded?.userId;
            const username = decoded?.username;
            // console.log(userId);
            // console.log(username);
            if (!userId || !username) {
                setError("User authentication failed.");
                return;
            }

            const newCommentObject = {
                _id: Date.now(),  // Temporary ID (replace with actual after post)
                userId: { _id: userId, username },
                comment: newComment
            };
            // console.log("Adding new comment to state", newCommentObject);
            
            setComments((prev) => {
                // console.log("Updated comments in state:", [...prev, newCommentObject]);
                return [...prev, newCommentObject];
            });
            const response = await axios.post(`https://discoverbuddy.onrender.com/api/trips/${tripId}/comments`, {
                userId: userId, 
                username,
                comment: newComment,
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            
            // console.log("Backend response:", response.data);


            
            setComments((prev) =>
                prev.map((c) =>
                    c._id === newCommentObject._id
                        ? { ...c, _id: response.data.comment._id }
                        : c
                )
            );
            setNewComment("");
            setSuccess("Comment added successfully!");
            setTimeout(() => {
                setSuccess("");
            }, 4000);
        } catch (err) {
            setError("Failed to add comment.");
            console.error(err);
            setTimeout(() => {
                setError("");
            }, 4000);
        }
    };

    // console.log("Rendering comments:", comments); // Log comments while rendering

    return (
        <div>
            <h3>Comments</h3>
            {comments.map((c) => (
                <div key={c._id}>
                    <p><strong>{c.userId.username}:</strong> {c.comment}</p>
                </div>
            ))}
            <div>
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment"
                />
                <button onClick={handleAddComment}>Post Comment</button>
                {error && <p style={{ color: "red" }}>{error}</p>}
                {success && <p style={{ color: "green" }}>{success}</p>}
            </div>
        </div>
    );
};

export default TripComments;

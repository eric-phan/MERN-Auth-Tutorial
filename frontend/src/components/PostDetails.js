import { useState } from "react";
import { usePostsContext } from "../hooks/usePostsContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { Link } from "react-router-dom";

const PostDetails = ({ post }) => {
  const { dispatch } = usePostsContext();
  const { user } = useAuthContext();
  const [editMode, setEditMode] = useState(false);
  const [editedPost, setEditedPost] = useState({
    title: post.title,

    reps: post.reps,
    caption: post.caption,
  });

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedPost((prevEditedPost) => ({
      ...prevEditedPost,
      [name]: value,
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      return;
    }

    const { title, reps, caption } = editedPost;

    const updatedFields = {
      title,
      reps,
      caption,
    };

    try {
      const response = await fetch("/api/posts/" + post._id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(updatedFields),
      });

      const json = await response.json();
      console.log(json); // Log the response

      if (response.ok) {
        dispatch({ type: "UPDATE_POST", payload: json });
        setEditMode(false);
        setEditedPost(updatedFields);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteClick = async () => {
    if (!user) {
      return;
    }

    const response = await fetch("/api/posts/" + post._id, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });

    const json = await response.json();

    if (response.ok) {
      dispatch({ type: "DELETE_POST", payload: json });
    }
  };

  return (
    <div className="post-details">
      {editMode ? (
        <form onSubmit={handleEditSubmit}>
          <input
            type="text"
            name="title"
            value={editedPost.title}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="image"
            value={editedPost.image}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="reps"
            value={editedPost.reps}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="caption"
            value={editedPost.caption}
            onChange={handleInputChange}
          />
          <button type="submit">Save</button>
        </form>
      ) : (
        <>
          <Link to={`/post/:${post._id}`}>
            <h4>{post.title}</h4>
            <div>{<img src={post.image} alt="Post Image" />}</div>
            <p>
              <strong>Reps: </strong>
              {post.reps}
            </p>
            <p>
              <strong>Caption: </strong>
              {post.caption}
            </p>
            <p>{post.createdAt}</p>
          </Link>
          <span
            className="material-symbols-outlined"
            onClick={handleDeleteClick}
          >
            Delete
          </span>
          <button onClick={handleEditClick}>Edit</button>
        </>
      )}
    </div>
  );
};

export default PostDetails;

import { usePostsContext } from "../hooks/usePostsContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { Link } from "react-router-dom";
// allows you to be authorized when you delete, make a post, and at homepage

// date fns
import formatDistanceToNow from "date-fns/formatDistanceToNow";

const FeedDetails = ({ post }) => {
  const { dispatch } = usePostsContext();
  const { user } = useAuthContext();

  const handleClick = async () => {
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
      <Link to={`/post/:${post._id}`}>
        {/* link to get individual post */}
        <h4>{post.title}</h4>
        <p>
          <strong>Load (kg): </strong>
          {post.load}
        </p>
        <p>
          <strong>Reps: </strong>
          {post.reps}
        </p>
        <p>
          <strong>Caption: </strong>
          {post.caption}
        </p>
        <p>
          {formatDistanceToNow(new Date(post.createdAt), {
            addSuffix: true,
          })}
        </p>
      </Link>
      <span className="material-symbols-outlined" onClick={handleClick}>
        delete
      </span>
      {/* leave open the delete button to delete and not link to post */}
    </div>
  );
};

export default FeedDetails;

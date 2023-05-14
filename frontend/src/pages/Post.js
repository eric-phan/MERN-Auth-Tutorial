import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { usePostsContext } from "../hooks/usePostsContext";
import { useAuthContext } from "../hooks/useAuthContext";

// components
import PostDetails from "../components/PostDetails";
import PostForm from "../components/PostForm";

const Post = () => {
  const { id } = useParams();
  const { posts, dispatch } = usePostsContext();
  const { user } = useAuthContext();
console.log(id)
  useEffect(() => {
    const fetchPost = async () => {
      const response = await fetch(`/api/posts/${id.substring(1)}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const json = await response.json();

      if (response.ok) {
        dispatch({ type: "SET_POST", payload: json });
      }
    };

    if (user) {
      fetchPost();
    }
  }, [dispatch, id, user]);

  return (
    <div className="Post">
      <div className="posts">
        <PostDetails post={posts[0]} />
      </div>
    </div>
  );
};

export default Post;

import { useEffect } from "react";
import { usePostsContext } from "../hooks/usePostsContext";
import { useAuthContext } from "../hooks/useAuthContext";

// components
import PostDetails from "../components/PostDetails";
import PostForm from "../components/PostForm";
import PostFormOG from "../components/PostFormOG";

const Home = () => {
  const { posts, dispatch } = usePostsContext();
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch("/api/posts", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const json = await response.json();

      if (response.ok) {
        dispatch({ type: "SET_POSTS", payload: json });
      }
    };

    if (user) {
      fetchPosts();
    }
  }, [dispatch, user]);

  return (
    <div className="home">
      <div className="posts">
        {posts &&
          posts.map((post) =>
            post ? <PostDetails key={post._id} post={post} /> : null
          )}
      </div>
      <PostForm />
    </div>
  );
};

export default Home;

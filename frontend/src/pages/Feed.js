import { useEffect } from "react";
import { usePostsContext } from "../hooks/usePostsContext";
import { useAuthContext } from "../hooks/useAuthContext";

// components
import FeedDetailsTest from "../components/FeedDetailsTest";
import PostForm from "../components/PostForm";

const Feed = () => {
  const { posts, dispatch } = usePostsContext();
  // const { user } = useAuthContext();

  useEffect(() => {
    const fetchPostsFeed = async () => {
      const response = await fetch("/api/posts/feed", {
        // headers: {'Authorization': `Bearer ${user.token}`},
      });
      const json = await response.json();

      if (response.ok) {
        dispatch({ type: "SET_POSTS", payload: json });
      }
    };

    // if (user) {
    fetchPostsFeed();
    // }
  }, [dispatch]);

  return (
    <div className="feed">
      <div className="posts">
        {posts &&
          posts.map((post) => <FeedDetailsTest key={post} post={post} />)}
      </div>
      <PostForm />
    </div>
  );
};

export default Feed;

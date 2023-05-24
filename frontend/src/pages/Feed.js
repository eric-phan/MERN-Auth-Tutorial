import { useEffect } from "react";
import { usePostsContext } from "../hooks/usePostsContext";
import { useAuthContext } from "../hooks/useAuthContext";

// components
import FeedDetails from "../components/FeedDetails";
import PostForm from "../components/PostForm";

const Feed = () => {
  const { posts, dispatch } = usePostsContext();
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchPostsFeed = async () => {
      const response = await fetch("/api/posts/feed", {
        headers: { Authorization: `Bearer ${user.token}` },
        // sends request with token
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
  // console.log(posts); // Log the posts array to see its contents

  return (
    <div className="feed">
      <div className="posts">
        {posts &&
          posts.map((post) => <FeedDetails key={post._id} post={post} />)}
        {/* give it a unique key */}
      </div>
      <PostForm />
    </div>
  );
};

export default Feed;

import { useState } from "react";
import { usePostsContext } from "../hooks/usePostsContext";
import { useAuthContext } from "../hooks/useAuthContext";
import addImage from "./AddImage";
import axios from "axios";

const PostForm = () => {
  const { dispatch } = usePostsContext();
  const { user } = useAuthContext();

  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [caption, setCaption] = useState("");
  const [reps, setReps] = useState("");
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);
  // the form will update the STATE of these input fields

  // handle image submission
  // const handleProductImageUpload = (e) => {
  //   const file = e.target.files[0];

  //   TransformFileData(file);
  // };

  // const TransformFileData = (file) => {
  //   const reader = new FileReader();

  //   if (file) {
  //     reader.readAsDataURL(file);
  //     reader.onloadend = () => {
  //       setImage(reader.result);
  //     };
  //   } else {
  //     setImage("");
  //   }
  // };
  async function handleSubmit2(e) {
    e.preventDefault();
    try {
      let imageUrl = "";
      if (image) {
        const formData = new FormData();
        formData.append("file", image);
        formData.append("upload_preset", "postsMERN");
        const dataRes = await axios.post("yourUrl", formData);
        imageUrl = dataRes.data.url;
      }

      const submitPost = {
        image: imageUrl,
      };
      console.log("success");
      await axios.post("http://localhost:4000/store-image", submitPost);
    } catch (err) {
      err.response.data.msg && setError(err.response.data.msg);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    // prevent refresh on render

    if (!user) {
      setError("You must be logged in");
      // have to be logged in to make the post request
      return;
    }

    const post = { title, image, reps, caption };
    console.log(post);

    const response = await fetch("https://api.cloudinary.com/v1_1/dwm8b7nkp", {
      method: "POST",
      body: JSON.stringify(post),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });

    const json = await response.json();
    console.log(json);
    if (!response.ok) {
      setError(json.error);
      setEmptyFields(json.emptyFields);
    }
    if (response.ok) {
      setTitle("");
      setImage("");
      setReps("");
      setCaption("");
      setError(null);
      setEmptyFields([]);
      dispatch({ type: "CREATE_POST", payload: json });
    }
  };

  return (
    <form className="create" onSubmit={handleSubmit}>
      <h3>Add a New Post</h3>

      <label>Excersize Title:</label>
      <input
        type="text"
        onChange={(e) => setTitle(e.target.value)}
        value={title}
        className={emptyFields.includes("title") ? "error" : ""}
      />

      <label>Upload Image:</label>
      <input
        id="validationFormik107"
        accept="image/*"
        type="file"
        onChange={(e) => setImage(e.target.files[0])}
        required
      />

      {/* <input
        type="number"
        onChange={(e) => setImage(e.target.value)}
        value={image}
        className={emptyFields.includes("image") ? "error" : ""}
      /> */}

      <label>Reps:</label>
      <input
        type="number"
        onChange={(e) => setReps(e.target.value)}
        value={reps}
        className={emptyFields.includes("reps") ? "error" : ""}
      />
      <label>Caption:</label>
      <input
        type="text"
        onChange={(e) => setCaption(e.target.value)}
        value={caption}
        className={emptyFields.includes("caption") ? "error" : ""}
      />

      <button>Add post</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default PostForm;

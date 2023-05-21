import React, { useState } from "react";
import { usePostsContext } from "../hooks/usePostsContext";
import { useAuthContext } from "../hooks/useAuthContext";
import Alert from "./Alert";
import { useNavigate } from "react-router-dom";

const PostForm = () => {
  // this state tracks the base64 encoded Image
  const [base64Image, setBase64Image] = useState("");
  const { dispatch } = usePostsContext();
  const { user } = useAuthContext();
  const [title, setTitle] = useState("");
  // const [image, setImage] = useState("");
  const [caption, setCaption] = useState("");
  const [reps, setReps] = useState("");
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);
  // upload portion
  const [fileInputState, setFileInputState] = useState("");
  const [previewSource, setPreviewSource] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errMsg, setErrMsg] = useState("");
  let navigate = useNavigate();
  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    setPreviewSource(URL.createObjectURL(file));
    // converts the selected file to base64
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setBase64Image(reader.result);
      // update the base64 image state
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("You must be logged in");
      return;
    }

    const post = { title, reps, caption, image: base64Image };
    // includes the base64Image in the post data

    try {
      const response = await fetch("/api/posts", {
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
      } else {
        setTitle("");
        setReps("");
        setCaption("");
        setError(null);
        setEmptyFields([]);
        setSuccessMsg("Post created successfully");
        dispatch({ type: "CREATE_POST", payload: json });
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      setErrMsg("Something went wrong!");
    }
  };

  return (
    <form className="create" onSubmit={handleSubmit}>
      <h3>Add a New Post</h3>

      <label>Exercise Title:</label>
      <input
        type="text"
        onChange={(e) => setTitle(e.target.value)}
        value={title}
        className={emptyFields.includes("title") ? "error" : ""}
      />

      <label>Upload Image:</label>
      <Alert msg={errMsg} type="danger" />
      <Alert msg={successMsg} type="success" />
      <input
        id="fileInput"
        type="file"
        name="image"
        onChange={handleFileInputChange}
        // change to base64
        value={fileInputState}
        // The reason you don't need to call setFileInputState explicitly is that the value prop of the file input field
        // is already bound to fileInputState. So when the value of fileInputState changes indirectly through the handleFileInputChange function,
        // it automatically updates the value of the file input field in the UI.
        className="form-input"
      />
      {previewSource && (
        <img src={previewSource} alt="chosen" style={{ height: "300px" }} />
      )}

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
        //  Need to call state update function because there is no automatic binding like with the file input field.
        value={caption}
        className={emptyFields.includes("caption") ? "error" : ""}
      />

      <button>Add post</button>

      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default PostForm;

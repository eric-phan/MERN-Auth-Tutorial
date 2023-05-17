import { useState } from "react";
import { usePostsContext } from "../hooks/usePostsContext";
import { useAuthContext } from "../hooks/useAuthContext";
import Upload from "./Upload";
import Alert from "./Alert";

const PostForm = () => {
  const { dispatch } = usePostsContext();
  const { user } = useAuthContext();
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [caption, setCaption] = useState("");
  const [reps, setReps] = useState("");
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);
  // upload portion
  const [fileInputState, setFileInputState] = useState("");
  const [previewSource, setPreviewSource] = useState("");
  const [selectedFile, setSelectedFile] = useState();
  const [successMsg, setSuccessMsg] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    previewFile(file);
    setSelectedFile(file);
    setFileInputState(e.target.value);
  };
  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  };

  const handleSubmitFile = (e) => {
    e.preventDefault();
    if (!selectedFile) return;
    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onloadend = () => {
      uploadImage(reader.result);
    };
    reader.onerror = () => {
      console.error("AHHHHHHHH!!");
      setErrMsg("something went wrong!");
    };
  };
  const uploadImage = async (base64EncodedImage) => {
    try {
      await fetch("/api/posts", {
        method: "POST",
        body: JSON.stringify({ data: base64EncodedImage }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });
      setFileInputState("");
      setPreviewSource("");
      setSuccessMsg("Image uploaded successfully");
    } catch (err) {
      console.error(err);
      setErrMsg("Something went wrong!");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // prevent refresh on render

    if (!user) {
      setError("You must be logged in");
      // have to be logged in to make the post request
      return;
    }

    const post = { title, reps, caption };
    console.log(post);

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
    }
    if (response.ok) {
      setTitle("");
      // setImage("");
      setReps("");
      setCaption("");
      setError(null);
      setEmptyFields([]);
      dispatch({ type: "CREATE_POST", payload: json });
    }
  };

  return (
    <form className="create" onSubmit={handleSubmit}>
      {/* incorporate handlsesubmitfile */}
      <h3>Add a New Post</h3>

      <label>Excersize Title:</label>
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
        value={fileInputState}
        className="form-input"
      />
      {previewSource && (
        <img src={previewSource} alt="chosen" style={{ height: "300px" }} />
      )}
      {/* <input
        type="string"
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

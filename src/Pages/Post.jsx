import axios from "axios";
import { useEffect, useState } from "react";
import { Form, Button, Spinner } from "react-bootstrap";
import { FaThumbsDown, FaThumbsUp, FaX, FaArrowLeft } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
// import useFetch from "../Hooks/useFetch";
import {
  deleteComment,
  deletePost,
  likePost,
  setPosts,
  unlikePost,
  updateComments,
} from "../Store/Slices/post";

const Post = () => {
  const { postId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [comment, setComment] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const posts = useSelector((store) => store.post.posts);
  const user = useSelector((store) => store.user);

  const post = posts.find((p) => p._id === postId);

  useEffect(() => {
    if (!post) {
      setIsLoading(true);
      axios
        .get(`/posts/${postId}`)
        .then(({ data }) => {
          dispatch(setPosts([data]));
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [post, postId, dispatch]);

  async function handleLike() {
    const { data } = await axios.put(`/posts/like/${post._id}`);
    dispatch(likePost({ postId: post._id, likes: data }));
  }

  async function handleUnlike() {
    const { data } = await axios.put(`/posts/unlike/${post._id}`);
    dispatch(unlikePost({ postId: post._id, likes: data }));
  }

  async function handleDelete() {
    await axios.delete(`/posts/${post._id}`);
    dispatch(deletePost(postId));
    navigate("/posts");
  }

  async function handleAddComment(e) {
    e.preventDefault();

    if (!comment) return toast("Comment is required", { type: "error" });

    const { data } = await axios.post(`/posts/comment/${postId}`, {
      text: comment,
    });

    dispatch(updateComments({ postId, comments: data }));

    setComment("");
  }

  async function handleDeleteComment(commentId) {
    await axios.delete(`/posts/comment/${postId}/${commentId}`);

    dispatch(deleteComment({ commentId, postId }));
  }

  if (!postId) return <Navigate to="/posts" />;

  return isLoading ? (
    <Spinner />
  ) : (
    post && (
      <div className="container">
        <button
          className=" btn btn-secondary my-4"
          onClick={() => navigate("/posts")}
        >
          <FaArrowLeft /> Back To Posts
        </button>
        <div className="border p-3 d-flex gap-5 color-1">
          <div className=" mx-5 d-grid gap-3 text-center display-color">
            <img className="post-img" src={post.avatar} alt="" />
            <h5>{post.name}</h5>
          </div>
          <div className="d-grid align-items-center">
            <p className="fs-4">{post.text}</p>
            <small>
              {`${post.date.slice(5, 7)}/${post.date.slice(
                8,
                10
              )}/${post.date.slice(0, 4)}`}
            </small>
            <div className=" d-flex gap-3 mt-3">
              <Button
                variant="success"
                disabled={post.likes.find((like) => like.user === user?._id)}
                onClick={handleLike}
              >
                <FaThumbsUp /> {post.likes.length}
              </Button>
              <Button
                variant="warning"
                disabled={!post.likes.find((like) => like.user === user?._id)}
                onClick={handleUnlike}
              >
                <FaThumbsDown />
              </Button>
              {post.user === user?._id && (
                <button className=" btn btn-danger" onClick={handleDelete}>
                  <FaX />
                </button>
              )}
            </div>
          </div>
        </div>

        <p className="text-light py-2 px-4 bg mt-3">Leave a Comment</p>

        <div>
          <Form className="d-grid gap-3 my-3" onSubmit={handleAddComment}>
            <Form.Control
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              as="textarea"
              rows="4"
              placeholder="Comment on Post"
            />
            <Button type="submit" variant="dark">
              Submit
            </Button>
          </Form>
        </div>
        <ul className="list-group">
          {post.comments.map((comment) => (
            // <li key={comment._id} className="list-group-item">
            //   <strong>{comment.name}</strong> {comment.text}{" "}
            //   {comment.user === user?._id && (
            //     <Button
            //       variant="danger"
            //       onClick={() => handleDeleteComment(comment._id)}
            //     >
            //       <FaX />
            //     </Button>
            //   )}
            // </li>
            <li key={comment._id} className=" border p-3 list-group-item">
              {/* <div className=" d-flex justify-content-around color-1">
                <div className=" d-grid gap-3 text-center display-color">
                  <img className="post-img" src={comment.avatar} alt="" />
                  <h5>{comment.name}</h5>
                </div>
                <div className="mt-3">
                  <p className="fs-5">{comment.text}</p>
                  <small>
                    {`${comment.date.slice(5, 7)}/${comment.date.slice(
                      8,
                      10
                    )}/${comment.date.slice(0, 4)}`}
                  </small>
                  <div className="d-flex gap-3 mt-4">
                    <button
                      className=" whiteBtn border rounded-1 "
                    >
                      <FaThumbsUp /> {comment.likes.length}{" "}
                      {comment.likes.length > 1 ? "likes" : "like"}
                    </button>
                    <button
                      className=" whiteBtn border rounded-1"
                    >
                      <FaThumbsDown /> Unlike
                    </button>
                    <Link to={`/posts/${post._id}`}>
                      <button className=" rounded-1">
                        Discussion{" "}
                        <span className=" bg-light display-color px-2 rounded-5">
                          {" "}
                        </span>
                      </button>
                    </Link>
                  </div>
                </div>
              </div> */}
              
            </li>
          ))}
        </ul>
      </div>
    )
  );
};

export default Post;

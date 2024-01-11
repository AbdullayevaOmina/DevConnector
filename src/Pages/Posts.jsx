import { Button, Container, Form, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import useFetch from "../Hooks/useFetch";
import { Profiler, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../Store/Slices/post";
import { FaUser, FaThumbsDown, FaThumbsUp, FaX } from "react-icons/fa6";

const Posts = () => {
  const { data, isLoading } = useFetch("/posts");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPosts(data));
  }, [data, dispatch]);

  const posts = useSelector((store) => store.post.posts);
  

  async function handleCreatePost(e) {
    e.preventDefault();

    if (!text) return toast("Text is required", { type: "error" });

    setLoading(true);
    try {
      const { data } = await axios.post("/posts", { text });
      dispatch(setPosts([data, ...posts]));
    } catch (error) {
      console.log(error);
      const errors = error?.response?.data?.errors;
      if (errors?.length > 0) {
        errors.forEach((err) => {
          toast(err.msg, { type: "error" });
        });
      }
    } finally {
      setLoading(false);
      setText("");
    }
  }

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

  return (
    <section className="my-5">
      <Container>
        <h1 className="mb-3 display-4 fw-bold display-color">Posts</h1>
        <p className="text-dark fs-4">
          <FaUser /> Welcome to the community
        </p>
        <p className="text-light py-2 px-4 bg">Say Something...</p>
        <Form className="d-grid gap-3 my-3" onSubmit={handleCreatePost}>
          <Form.Control
            value={text}
            onChange={(e) => setText(e.target.value)}
            as="textarea"
            rows="6"
            placeholder="Create a Post"
          />
          <Button type="submit" variant="dark" disabled={loading} className="">
            {loading ? <Spinner /> : "Submit"}
          </Button>
        </Form>
        {isLoading ? (
          <Spinner />
        ) : (
          posts && (
            <div>
              <ul className=" list-group d-grid gap-3">
                {posts.map((post) => {
                  console.log(post);
                  return (
                    <li key={post._id} className=" border p-3 list-group-item">
                      <div className=" d-flex justify-content-around color-1">
                        <div className=" d-grid gap-3 text-center display-color">
                          <img className="post-img" src={post.avatar} alt="" />
                          <h5>{post.name}</h5>
                        </div>
                        <div className="mt-3">
                          <p className="fs-5">{post.text}</p>
                          <small>
                            {`${post.date.slice(5, 7)}/${post.date.slice(
                              8,
                              10
                            )}/${post.date.slice(0, 4)}`}
                          </small>
                          <div className="d-flex gap-3 mt-4">
                            <button
                              className=" whiteBtn border rounded-1 "
                              onClick={handleLike}
                            >
                              <FaThumbsUp /> {post.likes.length}{" "}
                              {post.likes.length > 1 ? "likes" : "like"}
                            </button>
                            <button
                              className=" whiteBtn border rounded-1"
                              onClick={handleUnlike}
                            >
                              <FaThumbsDown /> Unlike
                            </button>
                            <Link to={`/posts/${post._id}`}>
                              <button className=" rounded-1">
                                Discussion{" "}
                                <span className=" bg-light display-color px-2 rounded-5">
                                  {" "}
                                  {post.comments.length}
                                </span>
                              </button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )
        )}
      </Container>
    </section>
  );
};

export default Posts;

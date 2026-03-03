import { useState } from "react";

const ManageBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [title, setTitle] = useState("");

  const addBlog = () => {
    if (!title) return;
    setBlogs([...blogs, { id: Date.now(), title }]);
    setTitle("");
  };

  return (
    <div>
      <h2>Manage Blogs</h2>

      <input
        placeholder="Blog Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button onClick={addBlog}>Add Blog</button>

      <ul>
        {blogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default ManageBlogs;
import express from "express";
import { v4 as uuidv4 } from "uuid";

import { users, posts } from "./data.js";
const app = express();
app.use(express.json());
app.get("/users/:id", (req, res) => {
  const { id } = req.params;
  const user = users.find((item) => item.id === id);
  if (!user) {
    res.status(500).send({
      message: "Không tìm thấy user",
      success: false,
      data: null,
    });
  } else {
    res.status(200).send({
      data: user,
      message: "Tìm user thành công",
      success: true,
    });
  }
});
//Câu 2 :Viết API tạo user với các thông tin như trên users, với id là random (uuid), email là duy nhất, phải kiểm tra được trùng email khi tạo user.
app.post("/users", (req, res) => {
  const { userName, email, age } = req.body || {};

  // Kiểm tra trùng email
  const existingUser = users.find((user) => user.email === email);
  if (existingUser) {
    return res.status(400).json({ message: "Email already exists" });
  }

  const newUser = {
    id: uuidv4(),
    userName,
    email,
    age,
  };
  users.push(newUser);
  res.status(201).json(newUser);
});
//câu 3:Viết API lấy ra các bài post của user được truyền userId trên params.
app.get("/users/:userId/posts", (req, res) => {
  const userId = req.params.userId;
  const userPosts = posts.filter((post) => post.userId === userId);
  res.json(userPosts);
});
//câu 4:Viết API thực hiện tạo bài post với id của user được truyền trên params.
app.post("/posts/:userId", (req, res) => {
  const userId = req.params.userId;
  const { content } = req.body;

  const newPost = {
    userId,
    postId: uuidv4(),
    content,
  };
  posts.push(newPost);
  res.status(201).json(newPost);
});
//Câu 5: Viết API cập nhật thông tin bài post với postId được truyền trên params, chỉ có user tạo bài mới được phép.
app.put("/posts/:postId", (req, res) => {
  const { postId } = req.params;
  const { userId, content } = req.body;

  const updatePosts = posts.find((post) => post.postId === postId);

  if (!updatePosts) {
    return res.status(404).json({ error: "Bài post không tồn tại" });
  }

  if (updatePosts.userId !== userId) {
    return res
      .status(401)
      .json({ error: "Bạn không được phép cập nhật bài viết này" });
  } else {
    updatePosts.content = content;
    return res
      .status(201)
      .json({ updatePosts, message: "Đã update thành công" });
  }
});
//câu 6: Viết API xoá bài post với postId được truyền trên params, chỉ có user tạo bài mới được phép.
app.delete("/posts/:postId", (req, res) => {
  const { postId } = req.params;
  const { userId } = req.body;

  const deletePost = posts.findIndex((post) => post.postId === postId);

  if (deletePost === -1) {
    return res.status(404).json({ error: "Bài post không tồn tại" });
  }

  if (posts[deletePost].userId !== userId) {
    return res
      .status(401)
      .json({ error: "Bạn không được phép xóa bài viết này" });
  }

  posts.splice(deletePost, 1);

  return res.json({ message: "Bài post đã được xóa thành công" });
});
//câu 7:Viết API tìm kiếm các bài post với content tương ứng được gửi lên từ query params
app.get("/posts", (req, res) => {
  const { content } = req.query;

  const matchedPosts = posts.filter((post) =>
    post.content.toLowerCase().includes(content.toLowerCase())
  );
  res.json(matchedPosts);
});
//câu8:Viết API lấy tất cả các bài post với isPublic là true, false thì sẽ không trả về.
app.get("/posts/public", (req, res) => {
  const publicPosts = posts.filter((post) => post.isPublic);
  res.json(publicPosts);
});
app.listen(4000, () => {
  console.log("Server is running!");
});

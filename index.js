const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const { v4: uuidv4 } = require('uuid');
const methodOverride = require("method-override");

// ===== 1. CONFIG / SETTINGS =====
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

// ===== 2. MIDDLEWARE =====
app.use(express.urlencoded({ extended: true }));

// ===== 3. DUMMY DATA =====
let posts = [
    { id: uuidv4(), username: "mangesh", content: "This is my first Quora post." },
    { id: uuidv4(), username: "ganesh", content: "Another dummy post here." },
    { id: uuidv4(), username: "mahesh", content: "Another dummy post here." },
];

// ===== 4. ROUTES =====
app.get("/", (req, res) => {
    res.send("server works well");
});

app.get("/posts", (req, res) => {
    res.render("index.ejs", { posts });
});

app.get("/posts/new", (req, res) => {
    res.render("new.ejs");
});

app.post("/posts", (req, res) => {
    let { username, content } = req.body;
    if (!username || !content) {
        return res.status(400).send("Username and content are required");
    }
    let id = uuidv4();
    posts.push({ id, username, content });
    res.redirect("/posts");
});

app.get("/posts/:id", (req, res) => {
    let { id } = req.params;
    let post = posts.find((p) => id === p.id);
    if (!post) {
        return res.status(404).send("Post not found");
    }
    res.render("show.ejs", { post });
});

app.patch("/posts/:id", (req, res) => {
    let { id } = req.params;
    let post = posts.find((p) => id === p.id);
    if (!post) {
        return res.status(404).send("Post not found");
    }
    post.content = req.body.content;
    res.redirect(`/posts/${id}`);
});

app.get("/posts/:id/edit", (req, res) => {
    let { id } = req.params;
    let post = posts.find((p) => id === p.id);
    if (!post) {
        return res.status(404).send("Post not found");
    }
    res.render("edit.ejs", { post });
});

app.delete("/posts/:id", (req, res) => {
    let { id } = req.params;
    posts = posts.filter((p) => id !== p.id);
    res.redirect("/posts");
});

// ===== 5. ERROR HANDLERS =====
app.use((req, res) => {
    res.status(404).send("Page not found");
});

// ===== 6. SERVER START =====
app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});
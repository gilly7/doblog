"use client";

import * as React from "react";
import {
  Typography,
  Paper,
  Box,
  Divider,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

const blogPost = {
  id: 1,
  title: "First Blog Post",
  content: "This is the full content of the first blog post...",
  comments: [
    { id: 1, author: "John Doe", content: "Great post!" },
    {
      id: 2,
      author: "Jane Smith",
      content: "Thanks for sharing this information.",
    },
  ],
};

export default function Article({ params }: { params: { id: string } }) {
  const [comment, setComment] = React.useState("");

  const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setComment(event.target.value);
  };

  const handleSubmitComment = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Submitting comment:", comment, params.id);
    setComment("");
  };

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          {blogPost.title}
        </Typography>
        <Typography variant="body1" paragraph>
          {blogPost.content}
        </Typography>
      </Paper>

      <Typography variant="h4" component="h2" gutterBottom>
        Comments
      </Typography>
      <List>
        {blogPost.comments.map((comment) => (
          <ListItem key={comment.id}>
            <ListItemText
              primary={comment.author}
              secondary={comment.content}
            />
          </ListItem>
        ))}
      </List>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h5" component="h3" gutterBottom>
        Add a Comment
      </Typography>
      <form onSubmit={handleSubmitComment}>
        <TextField
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          placeholder="Write your comment here..."
          value={comment}
          onChange={handleCommentChange}
          sx={{ mb: 2 }}
        />
        <Button type="submit" variant="contained" color="primary">
          Submit Comment
        </Button>
      </form>
    </Box>
  );
}

"use client";

import { useEffect, useState } from "react";
import {
  Alert,
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
import { createComment, getArticle } from "../../lib/api";
import { Article } from "@/types";
import { useSession } from "next-auth/react";
import { z } from "zod";

const commentSchema = z.object({
  content: z.string().min(1, "Content is required"),
});

type CommentFormData = z.infer<typeof commentSchema>;

export default function ArticlePage({ params }: { params: { id: string } }) {
  const [article, setArticle] = useState<Article | null>(null);
  const [errors, setErrors] = useState<Partial<CommentFormData>>({});
  const [generalError, setGeneralError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CommentFormData>({
    content: "",
  });

  const { data: session } = useSession();
  const { id } = params;

  useEffect(() => {
    if (id) {
      getArticle(id as string).then(setArticle);
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setGeneralError("");
    setIsLoading(true);

    try {
      commentSchema.parse(formData);

      await createComment(id as string, formData.content);
      const updatedArticle = await getArticle(id as string);
      setArticle(updatedArticle);
      //  toast.success("Comment added successfully");
    } catch (err) {
      // toast.error("Failed to create article");
      if (err instanceof z.ZodError) {
        setErrors(err.flatten().fieldErrors as Partial<CommentFormData>);
      } else {
        setGeneralError("An unexpected error occurred");
        console.error("Unexpected error:", err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!article) return <div>Loading...</div>;

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          {article.title}
        </Typography>
        <Typography variant="body1" paragraph>
          {article.content}
        </Typography>
      </Paper>

      <Typography variant="h4" component="h2" gutterBottom>
        Comments
      </Typography>
      <List>
        {article.comments?.map((comment) => (
          <ListItem key={comment.id}>
            <ListItemText
              primary={comment.author?.name}
              secondary={comment.content}
            />
          </ListItem>
        ))}
      </List>

      {session && (
        <>
          <Divider sx={{ my: 3 }} />

          <Typography variant="h5" component="h3" gutterBottom>
            Add a Comment
          </Typography>
          {generalError && (
            <Alert severity="error" sx={{ mt: 2, width: "100%" }}>
              {generalError}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmitComment}>
            <TextField
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              placeholder="Write your comment here..."
              sx={{ mb: 2 }}
              value={formData.content}
              onChange={handleChange}
              error={!!errors.content}
              helperText={errors.content}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : "Submit Comment"}
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
}

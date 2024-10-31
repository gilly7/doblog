"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Alert,
  Typography,
  Paper,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  MenuItem,
} from "@mui/material";
import { z } from "zod";
import { getArticle, getCategories, updateArticle } from "@/lib/api";
import { Category } from "@/types";

const articleSchema = z.object({
  categoryId: z.string().min(1, "Category is required"),
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
});

type ArticleFormData = z.infer<typeof articleSchema>;

const useArticleForm = (articleId?: string) => {
  const [formData, setFormData] = useState<ArticleFormData>({
    categoryId: "",
    title: "",
    content: "",
  });
  const [errors, setErrors] = useState<Partial<ArticleFormData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);

  const router = useRouter();

  useEffect(() => {
    getCategories().then(setCategories);

    if (articleId) {
      getArticle(articleId).then((article) => {
        setFormData({
          ...article,
        });
      });
    }
  }, [articleId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleCategoryChange = useCallback(
    (event: SelectChangeEvent<string>) => {
      setFormData((prevState) => ({
        ...prevState,
        categoryId: event.target.value,
      }));
      setErrors((prevErrors) => ({ ...prevErrors, categoryId: undefined }));
    },
    []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setGeneralError("");
    setIsLoading(true);

    try {
      articleSchema.parse(formData);

      await updateArticle(articleId as string, {
        ...formData,
        published: true,
      });
      // toast.success("Article updated successfully");
      router.push(`/articles/${articleId}`);
    } catch (err) {
      // toast.error("Failed to create article");
      if (err instanceof z.ZodError) {
        setErrors(err.flatten().fieldErrors as Partial<ArticleFormData>);
      } else {
        setGeneralError("An unexpected error occurred");
        console.error("Unexpected error:", err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    categories,
    errors,
    isLoading,
    generalError,
    handleChange,
    handleCategoryChange,
    handleSubmit,
  };
};

export default function UpdateArticle({ params }: { params: { id: string } }) {
  const {
    formData,
    categories,
    errors,
    isLoading,
    generalError,
    handleChange,
    handleCategoryChange,
    handleSubmit,
  } = useArticleForm(params.id);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "calc(100vh - 200px)",
      }}
    >
      <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: 900 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Update Article
        </Typography>
        {generalError && (
          <Alert severity="error" sx={{ mt: 2, width: "100%" }}>
            {generalError}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            fullWidth
            label="Title"
            variant="outlined"
            margin="normal"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            error={!!errors.title}
            helperText={errors.title}
          />
          <FormControl fullWidth margin="normal" error={!!errors.categoryId}>
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              id="category"
              value={formData.categoryId}
              label="Category"
              onChange={handleCategoryChange}
              error={!!errors.categoryId}
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
            {errors.categoryId && (
              <Typography variant="caption" color="error">
                {errors.categoryId}
              </Typography>
            )}
          </FormControl>
          <TextField
            fullWidth
            label="Content"
            name="content"
            variant="outlined"
            margin="normal"
            multiline
            rows={7}
            value={formData.content}
            onChange={handleChange}
            error={!!errors.content}
            helperText={errors.content}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Update Article"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Alert,
  Typography,
  Paper,
  TextField,
  Button,
  Box,
} from "@mui/material";
import { z } from "zod";
import { createCategory } from "../../lib/api";

const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
});

type CategoryFormData = z.infer<typeof categorySchema>;

const useArticleForm = () => {
  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    description: "",
  });
  const [errors, setErrors] = useState<Partial<CategoryFormData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setGeneralError("");
    setIsLoading(true);

    try {
      categorySchema.parse(formData);

      const category = await createCategory({
        ...formData,
      });

      //  toast.success("category created successfully");
      router.push(`/categories/${category.id}`);
    } catch (err) {
      // toast.error("Failed to create category");
      if (err instanceof z.ZodError) {
        setErrors(err.flatten().fieldErrors as Partial<CategoryFormData>);
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
    errors,
    isLoading,
    generalError,
    handleChange,
    handleSubmit,
  };
};

export default function NewCategory() {
  const {
    formData,
    errors,
    isLoading,
    generalError,
    handleChange,
    handleSubmit,
  } = useArticleForm();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "calc(100vh - 200px)",
      }}
    >
      <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: 700 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Add Category
        </Typography>
        {generalError && (
          <Alert severity="error" sx={{ mt: 2, width: "100%" }}>
            {generalError}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            fullWidth
            label="Name"
            variant="outlined"
            margin="normal"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
          />
          <TextField
            fullWidth
            label="Description"
            name="description"
            variant="outlined"
            margin="normal"
            multiline
            rows={5}
            value={formData.description}
            onChange={handleChange}
            error={!!errors.description}
            helperText={errors.description}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : "Create Category"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

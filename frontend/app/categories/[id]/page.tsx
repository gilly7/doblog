"use client";

import { useEffect, useState } from "react";
import { Typography, Paper, Box } from "@mui/material";
import { getCategory } from "@/lib/api";
import { Category } from "@/types";

export default function CategoryPage({ params }: { params: { id: string } }) {
  const [category, setCategory] = useState<Category | null>(null);

  const { id } = params;

  useEffect(() => {
    if (id) {
      getCategory(id as string).then(setCategory);
    }
  }, [id]);

  if (!category) return <div>Loading...</div>;

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          {category.name}
        </Typography>
        <Typography variant="body1" component="p">
          {category.description}
        </Typography>
      </Paper>
    </Box>
  );
}

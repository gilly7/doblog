"use client";

import { useEffect, useState } from "react";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Pagination,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Link from "next/link";
import { Category } from "@/types";
import { getCategories } from "@/lib/api";

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const categoriesPerPage = 5;

  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayedCategories = filteredCategories.slice(
    (page - 1) * categoriesPerPage,
    page * categoriesPerPage
  );

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search articles..."
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="primary" />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "primary.main",
              },
              "&:hover fieldset": {
                borderColor: "primary.light",
              },
              "&.Mui-focused fieldset": {
                borderColor: "primary.main",
              },
            },
          }}
        />
      </Grid>
      <Grid item xs={12} md={8}>
        <Typography variant="h4" component="h1" gutterBottom color="primary">
          Categories
        </Typography>
        {displayedCategories.map((category) => (
          <Card key={category.id} sx={{ mb: 4, borderColor: "primary.main" }}>
            <CardContent>
              <Typography
                variant="h5"
                component="div"
                gutterBottom
                color="primary"
              >
                {category.name}
              </Typography>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                {category.createdAt}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {category.description}
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                component={Link}
                href={`/categories/${category.id}`}
                variant="outlined"
                color="primary"
              >
                Details
              </Button>
            </CardActions>
          </Card>
        ))}
        <Pagination
          count={Math.ceil(filteredCategories.length / categoriesPerPage)}
          page={page}
          onChange={handleChangePage}
          sx={{ mt: 4, display: "flex", justifyContent: "center" }}
          color="primary"
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <Card sx={{ borderColor: "primary.main" }}>
          <CardContent></CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

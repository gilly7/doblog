"use client";

import * as React from "react";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  List,
  ListItem,
  ListItemText,
  Pagination,
  Divider,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Link from "next/link";

// Mock data for blog posts
const blogPosts = [
  {
    id: 1,
    title: "First Blog Post",
    excerpt: "This is a short excerpt of the first blog post...",
    date: "2023-05-01",
  },
  {
    id: 2,
    title: "Second Blog Post",
    excerpt: "This is a short excerpt of the second blog post...",
    date: "2023-05-05",
  },
  {
    id: 3,
    title: "Third Blog Post",
    excerpt: "This is a short excerpt of the third blog post...",
    date: "2023-05-10",
  },
  {
    id: 4,
    title: "Fourth Blog Post",
    excerpt: "This is a short excerpt of the fourth blog post...",
    date: "2023-05-15",
  },
  {
    id: 5,
    title: "Fifth Blog Post",
    excerpt: "This is a short excerpt of the fifth blog post...",
    date: "2023-05-20",
  },
];

// Mock data for categories
const categories = [
  { id: 1, name: "Technology" },
  { id: 2, name: "Travel" },
  { id: 3, name: "Food" },
  { id: 4, name: "Lifestyle" },
  { id: 5, name: "Health" },
];

export default function BlogList() {
  const [page, setPage] = React.useState(1);
  const [searchTerm, setSearchTerm] = React.useState("");
  const postsPerPage = 3;

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

  const filteredPosts = blogPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayedPosts = filteredPosts.slice(
    (page - 1) * postsPerPage,
    page * postsPerPage
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
          Latest Blog Posts
        </Typography>
        {displayedPosts.map((post) => (
          <Card key={post.id} sx={{ mb: 4, borderColor: "primary.main" }}>
            <CardContent>
              <Typography
                variant="h5"
                component="div"
                gutterBottom
                color="primary"
              >
                {post.title}
              </Typography>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                {post.date}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {post.excerpt}
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                component={Link}
                href={`/post/${post.id}`}
                variant="outlined"
                color="primary"
              >
                Read More
              </Button>
            </CardActions>
          </Card>
        ))}
        <Pagination
          count={Math.ceil(filteredPosts.length / postsPerPage)}
          page={page}
          onChange={handleChangePage}
          sx={{ mt: 4, display: "flex", justifyContent: "center" }}
          color="primary"
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <Card sx={{ borderColor: "primary.main" }}>
          <CardContent>
            <Typography variant="h6" gutterBottom color="primary">
              Categories
            </Typography>
            <List>
              {categories.map((category, index) => (
                <React.Fragment key={category.id}>
                  <ListItem
                    button
                    component={Link}
                    href={`/category/${category.id}`}
                  >
                    <ListItemText
                      primary={category.name}
                      sx={{ color: "text.primary" }}
                    />
                  </ListItem>
                  {index !== categories.length - 1 && (
                    <Divider sx={{ borderColor: "primary.main" }} />
                  )}
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

"use client";

import { useEffect, useState, Fragment } from "react";
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
import { Article, Category } from "@/types";
import { getArticles, getCategories } from "@/lib/api";

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const response = await getArticles({
        page,
        limit: 5,
        search: searchTerm,
      });
      setArticles(response.articles);
      setTotalPages(response.pagination.totalPages);
    } catch (error) {
      console.error("Failed to fetch articles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
    getCategories().then(setCategories);
  }, []);

  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(`searching ${event.target.value}`);
    setSearchTerm(event.target.value);
    setPage(1);
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substr(0, content.lastIndexOf(" ", maxLength)) + "...";
  };

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
        {loading ? (
          <Typography>Loading...</Typography>
        ) : (
          articles.map((article) => (
            <Card key={article.id} sx={{ mb: 4, borderColor: "primary.main" }}>
              <CardContent>
                <Typography
                  variant="h5"
                  component="div"
                  gutterBottom
                  color="primary"
                >
                  {article.title}
                </Typography>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  {new Date(article.createdAt).toLocaleDateString()} | Author:{" "}
                  {article.author.name} | Comments: (
                  {article._count?.comments || 0}) | Category:{" "}
                  {article.category.name}
                </Typography>
                <Typography variant="body2">
                  {truncateContent(article.content)}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  component={Link}
                  href={`/articles/${article.id}`}
                  variant="outlined"
                  color="primary"
                >
                  Read More
                </Button>
              </CardActions>
            </Card>
          ))
        )}
        <Pagination
          count={totalPages}
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
                <Fragment key={category.id}>
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
                </Fragment>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

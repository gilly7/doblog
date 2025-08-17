"use client";

import { getArticles, getCategories, favoriteArticle, unfavoriteArticle, getUserFavorites } from "@/lib/api";
import { Article, Category } from "@/types";
import { useSession } from "next-auth/react";
import { useEffect, useState, Fragment } from "react";
import Link from "next/link";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import SearchIcon from "@mui/icons-material/Search";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Grid,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  Pagination,
  TextField,
  Typography
} from "@mui/material";
export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [favoriteArticles, setFavoriteArticles] = useState<Article[]>([]);
  const { data: session } = useSession();

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

  useEffect(() => {
    if (session && session.user) {
      getUserFavorites()
        .then((favorites) => {
          setFavoriteIds(new Set(favorites.map((a: Article) => a.id)));
          setFavoriteArticles(favorites);
        })
        .catch(() => {
          setFavoriteArticles([]);
        });
    } else {
      setFavoriteIds(new Set());
      setFavoriteArticles([]);
    }
  }, [session]);

  const handleFavorite = async (id: string, isFav: boolean) => {
    if (!session) return;
    setFavoriteIds((prev) => {
      const newSet = new Set(prev);
      if (isFav) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
    try {
      if (isFav) await unfavoriteArticle(id);
      else await favoriteArticle(id);
      // Refresh articles to update favorite count
      fetchArticles();
    } catch (e) {
      // revert on error
      setFavoriteIds((prev) => {
        const newSet = new Set(prev);
        if (isFav) newSet.add(id);
        else newSet.delete(id);
        return newSet;
      });
    }
  };

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
        ) : articles?.length ? (
          articles.map((article) => {
            const isFav = favoriteIds.has(article.id);
            return (
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
                  <Typography variant="body2" color="text.secondary">
                    {truncateContent(article.content)}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    component={Link}
                    href={`/articles/${article.id}`}
                    size="small"
                    color="primary"
                  >
                    Read More
                  </Button>
                  {session && (
                    <Button
                      size="small"
                      color={isFav ? "error" : "primary"}
                      startIcon={isFav ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                      onClick={() => handleFavorite(article.id, isFav)}
                    >
                      {isFav ? "Unfavorite" : "Favorite"}
                    </Button>
                  )}
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                    {article.favoritedBy?.length ?? 0} favorites
                  </Typography>
                </CardActions>
              </Card>
            );
          })
        ) : (
          <>
            <Typography>
              No articles found.
            </Typography>
            {session ? (
              <span>
                <Link href="/articles/new">Add new Article</Link>
              </span>
            ) : (
              <span>
                <Link href="/login">Login</Link> to add an article.
              </span>
            )}
          </>
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
        <Card sx={{ borderColor: "primary.main", mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom color="primary">
              Categories
            </Typography>
            {categories?.length ? (
              <List>
                {categories.map((category, index) => (
                  <Fragment key={category.id}>
                    <ListItem
                      component={Link}
                      href={`/categories/${category.id}`}
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
            ) : (
              <>
                <Typography variant="body1">
                  No categories yet!
                </Typography>
                {session ? (
                  <span>
                    <Link href="/categories/new">Add new Category</Link>
                  </span>
                ) : (
                  <span>
                    <Link href="/login">Login</Link> to add a category.
                  </span>
                )}
              </>
            )}
          </CardContent>
        </Card>
        {session && favoriteArticles.length > 0 && (
          <Card sx={{ borderColor: "primary.main" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                Your Favorited Articles
              </Typography>
              <List>
                {favoriteArticles.map((article) => (
                  <ListItem
                    key={article.id}
                    component={Link}
                    href={`/articles/${article.id}`}
                  >
                    <ListItemText
                      primary={article.title}
                      secondary={truncateContent(article.content, 60)}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        )}
      </Grid>
    </Grid>
  );
}

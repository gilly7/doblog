"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import {
  Alert,
  Typography,
  Paper,
  TextField,
  Button,
  Box,
} from "@mui/material";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const useLoginForm = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

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
      loginSchema.parse(formData);

      const result = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (result?.error) {
        const errorMessages: Record<string, string> = {
          CredentialsSignin: "Invalid email or password",
          Configuration: "There's an issue with the server configuration",
          Default: "An unexpected error occurred",
        };

        setGeneralError(
          errorMessages[result.error] || `Login failed: ${result.error}`
        );
        console.error("Login error:", result.error);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        setErrors(err.flatten().fieldErrors as Partial<LoginFormData>);
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

export default function Login() {
  const {
    formData,
    errors,
    isLoading,
    generalError,
    handleChange,
    handleSubmit,
  } = useLoginForm();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "calc(100vh - 200px)",
      }}
    >
      <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: 500 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Login
        </Typography>
        {generalError && (
          <Alert severity="error" sx={{ mt: 2, width: "100%" }}>
            {generalError}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            margin="normal"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            name="password"
            variant="outlined"
            margin="normal"
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

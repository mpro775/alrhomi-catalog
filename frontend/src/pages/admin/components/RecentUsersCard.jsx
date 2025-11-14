import {
  Card,
  CardContent,
  Box,
  Typography,
  Stack,
  Paper,
  Avatar,
  alpha,
} from "@mui/material";
import {
  Email as EmailIcon,
  AccessTime as AccessTimeIcon,
  Person as PersonIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

export default function RecentUsersCard({ users = [], formatDate }) {
  const theme = useTheme();

  return (
    <Card
      sx={{
        borderRadius: 4,
        boxShadow:
          theme.palette.mode === "dark"
            ? "0 8px 32px rgba(0,0,0,0.4)"
            : "0 8px 32px rgba(0,0,0,0.08)",
        height: "100%",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 12px 48px rgba(0,0,0,0.5)"
              : "0 12px 48px rgba(0,0,0,0.15)",
        },
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h6"
            sx={{
              fontSize: { xs: "1rem", sm: "1.25rem" },
              mb: 0.5,
            }}
          >
            أحدث المستخدمين
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
          >
            آخر 5 مستخدمين مسجلين في النظام
          </Typography>
        </Box>
        {users.length > 0 ? (
          <Stack spacing={{ xs: 1.5, sm: 2 }}>
            {users.map((user) => (
              <Paper
                key={user._id}
                elevation={0}
                sx={{
                  p: { xs: 1.5, sm: 2 },
                  borderRadius: 3,
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    backgroundColor: theme.palette.action.hover,
                    transform: "translateX(-4px)",
                    boxShadow:
                      theme.palette.mode === "dark"
                        ? "0 4px 16px rgba(0,0,0,0.2)"
                        : "0 4px 16px rgba(0,0,0,0.08)",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: { xs: 1.5, sm: 2 },
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: theme.palette.primary.main,
                      width: { xs: 44, sm: 48 },
                      height: { xs: 44, sm: 48 },
                      fontSize: { xs: "1rem", sm: "1.125rem" },
                      boxShadow: `0 4px 12px ${alpha(
                        theme.palette.primary.main,
                        0.3
                      )}`,
                    }}
                  >
                    {user.username?.charAt(0)?.toUpperCase()}
                  </Avatar>
                  <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontSize: { xs: "0.875rem", sm: "1rem" },
                        mb: 0.5,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {user.username}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        mb: 0.5,
                      }}
                    >
                      <EmailIcon
                        sx={{
                          fontSize: "0.875rem",
                          color: "text.secondary",
                        }}
                      />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          fontSize: { xs: "0.75rem", sm: "0.875rem" },
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {user.email}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                      }}
                    >
                      <AccessTimeIcon
                        sx={{
                          fontSize: "0.75rem",
                          color: "text.secondary",
                        }}
                      />
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem" } }}
                      >
                        {formatDate(user.createdAt)}
                      </Typography>
                    </Box>
                  </Box>
                  <CheckCircleIcon
                    sx={{
                      color: theme.palette.success.main,
                      fontSize: { xs: "1.25rem", sm: "1.5rem" },
                    }}
                  />
                </Box>
              </Paper>
            ))}
          </Stack>
        ) : (
          <Box sx={{ textAlign: "center", py: { xs: 6, sm: 8 }, px: 2 }}>
            <PersonIcon
              sx={{
                fontSize: { xs: 48, sm: 64 },
                color: "text.secondary",
                opacity: 0.5,
                mb: 2,
              }}
            />
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                fontSize: { xs: "0.875rem", sm: "1rem" },
              }}
            >
              لا يوجد مستخدمين مسجلين حديثًا
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}


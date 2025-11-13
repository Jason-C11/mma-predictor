import { Box, Button, Typography } from "@mui/material";
import SportsMmaIcon from "@mui/icons-material/SportsMma";

export default function HomePage() {
  return (
<Box component="main">
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      m: 4,
      gap: 2,
    }}
  >
    <Typography
      variant="h1"
      sx={{
        fontWeight: "bold",
        textAlign: "center",
        fontSize: {
          xs: "40px", 
          sm: "60px",
          md: "80px",
          lg: "100px", 
        },
      }}
    >
      Enter The Octagon
      <SportsMmaIcon
        sx={{
          fontSize: {
            xs: "40px",
            sm: "60px",
            md: "80px",
            lg: "100px",
          },
          verticalAlign: "middle",
          ml: 1,
        }}
      />
    </Typography>

    <Typography
      variant="h2"
      sx={{
        color: "#fff",
        textAlign: "center",
        fontSize: {
          xs: "20px",
          sm: "28px",
          md: "36px",
          lg: "48px",
        },
      }}
    >
      ML Powered Fight Predictions
    </Typography>

    <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
      <Button variant="contained" color="primary" size="large" href="/predict">
        <Typography
          variant="h2"
          sx={{
            fontSize: {
              xs: "18px",
              sm: "20px",
              md: "24px",
              lg: "28px",
            },
          }}
        >
          Predict Now
        </Typography>
      </Button>
    </Box>
  </Box>
</Box>

  );
}

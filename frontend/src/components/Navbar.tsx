'use client';
import Link from "next/link";
import { AppBar, Toolbar, Button, Box } from "@mui/material";

export default function Navbar() {
  return (
    <AppBar
      position="static"
      sx={{
        borderRadius: 2,
        backgroundColor: '#a60000',
      }}
    >
      <Toolbar>
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
          {[
            { name: 'Home', href: '/' },
            { name: 'Predict a Fight', href: '/predict' },
            { name: 'Fighter Stats', href: '/fighters' },
            { name: 'Fight History', href: '/fightHistory' },
          ].map((page) => (
            <Button
              key={page.name}
              component={Link}
              href={page.href}
              variant="text" 
              sx={{
                color: 'white',
                backgroundColor: 'transparent', 
                '&:hover': {
                  backgroundColor: '#fc0349',
                  color: 'black',
                },
                padding: '6px 16px', 
              }}
            >
              {page.name}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

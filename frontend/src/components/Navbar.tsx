'use client';
import Link from "next/link";
import { AppBar, Toolbar, Button, Box, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from "react";

export default function Navbar() {
  const pages = [
    { name: 'Home', href: '/' },
    { name: 'Predict a Fight', href: '/predict' },
    { name: 'Fighter Stats', href: '/fighters' },
    { name: 'Fighter History', href: '/fighterHistory' },
  ];

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="static"
      sx={{
        borderRadius: 2,
        backgroundColor: '#a60000',
      }}
    >
      <Toolbar>
        {/* Desktop */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
          {pages.map((page) => (
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

        {/* Mobile*/}
        <Box sx={{ display: { xs: 'flex', md: 'none' }, ml: 'auto' }}>
          <IconButton
            size="large"
            color="inherit"
            aria-label="menu"
            onClick={handleMenuOpen}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            {pages.map((page) => (
              <MenuItem
                key={page.name}
                component={Link}
                href={page.href}
                onClick={handleMenuClose}
              >
                <Typography textAlign="center">{page.name}</Typography>
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

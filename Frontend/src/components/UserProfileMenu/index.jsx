import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  MenuItem,
  IconButton,
  Avatar,
  Divider,
  ListItemIcon,
  ListItemText,
  Typography,
  Box
} from '@mui/material';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import authService from 'services/authService';

function UserProfileMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [userInfo, setUserInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: ''
  });
  const navigate = useNavigate();
  const open = Boolean(anchorEl);

  // Charger les informations utilisateur au montage
  useEffect(() => {
    loadUserInfo();
  }, []);

  const loadUserInfo = async () => {
    try {
      const userData = await authService.getCurrentUser();
      setUserInfo(userData);
    } catch (error) {
      console.error('Erreur lors du chargement des informations utilisateur:', error);
    }
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    handleClose();
    navigate('/admin/profile');
  };

  const handleLogout = () => {
    handleClose();
    // Utiliser le service d'authentification pour la déconnexion
    authService.logout();
  };

  const getInitials = () => {
    return `${userInfo.firstName?.charAt(0) || ''}${userInfo.lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const getFullName = () => {
    return `${userInfo.firstName || ''} ${userInfo.lastName || ''}`.trim() || 'Utilisateur';
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        size="small"
        sx={{ ml: 2 }}
        aria-controls={open ? 'account-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        <Avatar
          sx={{ 
            width: 32, 
            height: 32, 
            bgcolor: 'info.main',
            fontSize: '0.875rem'
          }}
        >
          {getInitials()}
        </Avatar>
      </IconButton>
      
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            minWidth: 200,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {/* En-tête avec informations utilisateur */}
        <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #e0e0e0' }}>
          <MDBox display="flex" alignItems="center">
            <Avatar
              sx={{ 
                width: 40, 
                height: 40, 
                bgcolor: 'info.main',
                mr: 1.5
              }}
            >
              {getInitials()}
            </Avatar>
            <MDBox>
              <MDTypography variant="button" fontWeight="medium">
                {getFullName()}
              </MDTypography>
              <MDTypography variant="caption" color="text" display="block">
                {userInfo.email}
              </MDTypography>
              <MDTypography variant="caption" color="info" display="block">
                {userInfo.role === 'ADMIN' ? 'Administrateur' : 'Utilisateur'}
              </MDTypography>
            </MDBox>
          </MDBox>
        </Box>

        {/* Options du menu */}
        <MenuItem onClick={handleProfile}>
          <ListItemIcon>
            <span className="material-icons" style={{ fontSize: 20 }}>person</span>
          </ListItemIcon>
          <ListItemText>
            <MDTypography variant="button">Modifier le profil</MDTypography>
          </ListItemText>
        </MenuItem>
        
        <Divider />
        
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <span className="material-icons" style={{ fontSize: 20, color: '#f44336' }}>logout</span>
          </ListItemIcon>
          <ListItemText>
            <MDTypography variant="button" color="error">Se déconnecter</MDTypography>
          </ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}

export default UserProfileMenu;

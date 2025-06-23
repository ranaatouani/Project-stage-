import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Box,
  Button,
  Divider,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  Info,
  MarkEmailRead,
  Refresh
} from '@mui/icons-material';

// Material Dashboard 2 React components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

import { notificationService } from '../../services/notificationService';

function MesNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [markingAllAsRead, setMarkingAllAsRead] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificationService.getMesNotifications();
      setNotifications(data);
      setError('');
    } catch (error) {
      console.error('Erreur lors du chargement des notifications:', error);
      setError('Erreur lors du chargement des notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationService.marquerCommeLue(notificationId);
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId ? { ...notif, lu: true } : notif
        )
      );
    } catch (error) {
      console.error('Erreur lors du marquage comme lu:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      setMarkingAllAsRead(true);
      await notificationService.marquerToutesCommeLues();
      setNotifications(prev => prev.map(notif => ({ ...notif, lu: true })));
    } catch (error) {
      console.error('Erreur lors du marquage de toutes les notifications comme lues:', error);
    } finally {
      setMarkingAllAsRead(false);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'CANDIDATURE_ACCEPTEE':
        return <CheckCircle color="success" />;
      case 'CANDIDATURE_REFUSEE':
        return <Cancel color="error" />;
      case 'CANDIDATURE_SOUMISE':
        return <CheckCircle color="primary" />;
      default:
        return <Info color="info" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'CANDIDATURE_ACCEPTEE':
        return 'success';
      case 'CANDIDATURE_REFUSEE':
        return 'error';
      case 'CANDIDATURE_SOUMISE':
        return 'primary';
      default:
        return 'info';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const unreadCount = notifications.filter(n => !n.lu).length;

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <MDBox mb={3}>
          <Card>
            <MDBox
              mx={2}
              mt={-3}
              py={3}
              px={2}
              variant="gradient"
              bgColor="info"
              borderRadius="lg"
              coloredShadow="info"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <MDTypography variant="h6" color="white">
                Mes Notifications ({notifications.length})
              </MDTypography>
              <MDBox display="flex" gap={1}>
                <MDButton
                  variant="outlined"
                  color="white"
                  size="small"
                  onClick={loadNotifications}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={16} /> : <Refresh />}
                >
                  Actualiser
                </MDButton>
                {unreadCount > 0 && (
                  <MDButton
                    variant="contained"
                    color="white"
                    size="small"
                    onClick={handleMarkAllAsRead}
                    disabled={markingAllAsRead}
                    startIcon={markingAllAsRead ? <CircularProgress size={16} /> : <MarkEmailRead />}
                  >
                    Tout marquer comme lu ({unreadCount})
                  </MDButton>
                )}
              </MDBox>
            </MDBox>
            <CardContent>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              {loading ? (
                <Box display="flex" justifyContent="center" p={3}>
                  <CircularProgress />
                </Box>
              ) : notifications.length === 0 ? (
                <Box textAlign="center" p={3}>
                  <Typography color="textSecondary">
                    Aucune notification pour le moment
                  </Typography>
                </Box>
              ) : (
                <List sx={{ p: 0 }}>
                  {notifications.map((notification, index) => (
                    <React.Fragment key={notification.id}>
                      <ListItem
                        sx={{
                          backgroundColor: notification.lu ? 'transparent' : 'rgba(25, 118, 210, 0.08)',
                          borderLeft: notification.lu ? 'none' : '4px solid #1976d2',
                          borderRadius: 1,
                          mb: 1,
                          cursor: notification.lu ? 'default' : 'pointer',
                          '&:hover': {
                            backgroundColor: notification.lu ? 'rgba(0, 0, 0, 0.02)' : 'rgba(25, 118, 210, 0.12)'
                          }
                        }}
                        onClick={() => !notification.lu && handleMarkAsRead(notification.id)}
                      >
                        <ListItemIcon>
                          {getNotificationIcon(notification.type)}
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                              <Typography 
                                variant="h6" 
                                sx={{ 
                                  fontWeight: notification.lu ? 'normal' : 'bold',
                                  fontSize: '1rem'
                                }}
                              >
                                {notification.titre}
                              </Typography>
                              <Typography variant="caption" color="textSecondary">
                                {formatDate(notification.dateCreation)}
                              </Typography>
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                                {notification.message}
                              </Typography>
                              <Chip
                                label={notification.type.replace(/_/g, ' ')}
                                size="small"
                                color={getNotificationColor(notification.type)}
                                sx={{ textTransform: 'capitalize' }}
                              />
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < notifications.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </MDBox>
      </MDBox>
    </DashboardLayout>
  );
}

export default MesNotifications;

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Chip,
  Alert,
  CircularProgress,
  MenuItem
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { getAllTours, createTour, updateTour, deleteTour } from '../services/api';

interface Tour {
  id: number;
  name: string;
  description: string;
  altitude: number;
  difficulty: number;
  distance: number;
  temperature: string;
  days: number;
  hours: number;
  price_one: number;
  price_couple: number;
  price_three_to_five: number;
  price_six_plus: number;
  images: string[];
  includes: string[];
  recommendations: string[];
  status: 'active' | 'inactive';
  created_at: string;
}

const ToursPage = () => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTour, setEditingTour] = useState<Tour | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [tourToDelete, setTourToDelete] = useState<Tour | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    altitude: 0,
    difficulty: 1,
    distance: 0,
    temperature: '',
    days: 0,
    hours: 0,
    price_one: 0,
    price_couple: 0,
    price_three_to_five: 0,
    price_six_plus: 0,
    images: '',
    includes: '',
    recommendations: '',
    status: 'active' as 'active' | 'inactive'
  });

  useEffect(() => {
    loadTours();
  }, []);

  const loadTours = async () => {
    setLoading(true);
    try {
      const data = await getAllTours();
      setTours(data);
      setError('');
    } catch (err) {
      setError('Error loading tours');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (tour?: Tour) => {
    if (tour) {
      setEditingTour(tour);
      setFormData({
        name: tour.name,
        description: tour.description,
        altitude: tour.altitude,
        difficulty: tour.difficulty,
        distance: tour.distance,
        temperature: tour.temperature,
        days: tour.days,
        hours: tour.hours,
        price_one: tour.price_one,
        price_couple: tour.price_couple,
        price_three_to_five: tour.price_three_to_five,
        price_six_plus: tour.price_six_plus,
        images: tour.images.join(', '),
        includes: tour.includes.join(', '),
        recommendations: tour.recommendations.join(', '),
        status: tour.status
      });
    } else {
      setEditingTour(null);
      setFormData({
        name: '',
        description: '',
        altitude: 0,
        difficulty: 1,
        distance: 0,
        temperature: '',
        days: 0,
        hours: 0,
        price_one: 0,
        price_couple: 0,
        price_three_to_five: 0,
        price_six_plus: 0,
        images: '',
        includes: '',
        recommendations: '',
        status: 'active'
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingTour(null);
  };

  const handleSubmit = async () => {
    try {
      const tourData = {
        ...formData,
        images: formData.images.split(',').map(s => s.trim()).filter(s => s),
        includes: formData.includes.split(',').map(s => s.trim()).filter(s => s),
        recommendations: formData.recommendations.split(',').map(s => s.trim()).filter(s => s)
      };

      if (editingTour) {
        await updateTour({ ...tourData, id: editingTour.id });
      } else {
        await createTour(tourData);
      }

      handleCloseDialog();
      loadTours();
    } catch (err) {
      setError('Error saving tour');
    }
  };

  const handleDelete = async () => {
    if (tourToDelete) {
      try {
        await deleteTour(tourToDelete.id);
        setDeleteConfirmOpen(false);
        setTourToDelete(null);
        loadTours();
      } catch (err) {
        setError('Error deleting tour');
      }
    }
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Tours Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add New Tour
          </Button>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Difficulty</TableCell>
                  <TableCell>Distance</TableCell>
                  <TableCell>Duration</TableCell>
                  <TableCell>Price (1p)</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tours.map((tour) => (
                  <TableRow key={tour.id}>
                    <TableCell>
                      <Box>
                        <Typography variant="subtitle2">{tour.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {tour.description.substring(0, 50)}...
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{tour.difficulty}/5</TableCell>
                    <TableCell>{tour.distance} km</TableCell>
                    <TableCell>
                      {tour.days > 0 && `${tour.days} days`}
                      {tour.hours > 0 && ` ${tour.hours} hours`}
                    </TableCell>
                    <TableCell>${tour.price_one}</TableCell>
                    <TableCell>
                      <Chip
                        label={tour.status}
                        color={tour.status === 'active' ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleOpenDialog(tour)} size="small">
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => {
                          setTourToDelete(tour);
                          setDeleteConfirmOpen(true);
                        }}
                        size="small"
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      {/* Tour Form Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{editingTour ? 'Edit Tour' : 'Create New Tour'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Temperature"
                value={formData.temperature}
                onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                type="number"
                label="Altitude (m)"
                value={formData.altitude}
                onChange={(e) => setFormData({ ...formData, altitude: parseInt(e.target.value) || 0 })}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                type="number"
                label="Difficulty (1-5)"
                inputProps={{ min: 1, max: 5 }}
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: parseInt(e.target.value) || 1 })}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                type="number"
                label="Distance (km)"
                value={formData.distance}
                onChange={(e) => setFormData({ ...formData, distance: parseInt(e.target.value) || 0 })}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                select
                label="Status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Days"
                value={formData.days}
                onChange={(e) => setFormData({ ...formData, days: parseInt(e.target.value) || 0 })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Hours"
                value={formData.hours}
                onChange={(e) => setFormData({ ...formData, hours: parseInt(e.target.value) || 0 })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Price (1 person)"
                value={formData.price_one}
                onChange={(e) => setFormData({ ...formData, price_one: parseFloat(e.target.value) || 0 })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Price (2 people)"
                value={formData.price_couple}
                onChange={(e) => setFormData({ ...formData, price_couple: parseFloat(e.target.value) || 0 })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Price (3-5 people)"
                value={formData.price_three_to_five}
                onChange={(e) => setFormData({ ...formData, price_three_to_five: parseFloat(e.target.value) || 0 })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Price (6+ people)"
                value={formData.price_six_plus}
                onChange={(e) => setFormData({ ...formData, price_six_plus: parseFloat(e.target.value) || 0 })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Images (comma-separated URLs)"
                value={formData.images}
                onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Includes (comma-separated)"
                value={formData.includes}
                onChange={(e) => setFormData({ ...formData, includes: e.target.value })}
                placeholder="Transportation, Guide, Equipment"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Recommendations (comma-separated)"
                value={formData.recommendations}
                onChange={(e) => setFormData({ ...formData, recommendations: e.target.value })}
                placeholder="Bring warm clothes, Good physical condition"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingTour ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{tourToDelete?.name}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ToursPage;
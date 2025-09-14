import { Container, Typography, Button, Box } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const DashboardPage = () => {
  const { logout } = useAuth();

  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 4 }}>
        <Typography variant="h4" component="h1">
          Dashboard
        </Typography>
        <Button variant="contained" color="secondary" onClick={logout}>
          Cerrar Sesión
        </Button>
      </Box>
      <Typography>
        ¡Bienvenido al panel de administración de Nevado Trek!
      </Typography>
    </Container>
  );
};

export default DashboardPage;

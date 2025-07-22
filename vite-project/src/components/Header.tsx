import { AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useTheme } from '@mui/material/styles';

interface HeaderProps {
  toggleTheme: () => void;
}

export default function Header({ toggleTheme }: HeaderProps) {
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>
            Insiders
          </Link>
        </Typography>

        <IconButton sx={{ color: '#fff' }} onClick={toggleTheme}>
          {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>

        {session && (
          <>
            <Button color="inherit" component={Link} to="/pokemons">
              Покемони
            </Button>
            <Button color="inherit" component={Link} to="/tasks">
              Задачі
            </Button>
            <Button color="inherit" component={Link} to="/gallery">
              Галерея
            </Button>
            <Button onClick={logout} color="inherit">
              Вийти
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

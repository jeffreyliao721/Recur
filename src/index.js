import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { ProtectedRoute, AuthRoute, AdminRoute } from 'src/utils/routeUtil';
import { actionToggleTheme } from 'src/actions/actions';
import configureStore from 'src/store/store';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Drawer from '@material-ui/core/Drawer';

import Exam from 'src/components/exam/Exam';
import Signin from 'src/components/signin/Signin';
import Signup from 'src/components/signin/Signup';
import Page from 'src/components/page/Page';
import Template from 'src/components/template/Template';
import Menu from 'src/components/menu/Menu';
import Profile from 'src/components/profile/Profile';
import Friends from 'src/components/profile/Friends';

import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import 'src/core.css';
import 'src/assets/images/favicon.png';

const commonStyles = {
  typography : {
    h2: {
      fontWeight: 700,
      fontSize: '2.2rem',
      lineHeight: 1.5,
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.5,
    },
    h4: {
      fontWeight: 700,
      fontSize: '1.25rem',
      lineHeight: 1.5,
    },
    h5: {
      fontWeight: 400,
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    h6: {
      fontWeight: 700,
      fontSize: '0.625rem',
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '0.92rem',
      lineHeight: 1.54,
    },
  },
  fontFamily: [ 'Open Sans', 'sans-serif' ],
  props: {
    MuiButtonBase: {
      disableRipple: true,
    },
  },
};

const lightTheme = responsiveFontSizes(createMuiTheme({
  palette: {
    primary: {
      main: '#3DB5E1',
    },
    secondary: {
      main: '#FFC15B',
    },
    text: {
      primary: '#4A4A4A',
      secondary: '#000000',
    },
    code: {
      color: '#2B2B2B',
    },
    container: {
      backgroundColor: '#F7F8F9',
    },
    editProfile: {
      backgroundColor: '#FBFDFF',
      borderBottom: '2px solid #E6EBF5',
    },
  },
  overrides: {
    MuiList: {
      root: {
        backgroundColor: '#fafafa',
      },
    },
    MuiListItem: {
      root: {
        '&:hover': {
          backgroundColor: '#f2f2f2',
        },
        '&$selected': {
          border: 'none',
          backgroundColor: '#e6ebf0',
          '&:hover': {
            backgroundColor: '#f2f2f2',
          },
        },
      },
    },
  },
  ...commonStyles,
}));

const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#ffffff',
    },
    code: {
      color: 'rgba(255, 255, 255, 0.7)',
    },
    container: {
      backgroundColor: '#303030',
    },
    editProfile: {
      backgroundColor: '#303030',
      borderBottom: '2px solid #303030',
    },
  },
  overrides: {
    MuiList: {
      root: {
        backgroundColor: '#424242',
      },
    },
    MuiListItem: {
      root: {
        '&$selected': {
          border: 'none',
          backgroundColor: '#0ed08a',
          '&:hover': {
            backgroundColor: '#0ed08a',
          },
        },
      },
    },
  },
  ...commonStyles,
});

const App = () => {
  const theme = useSelector(state => state.theme);
  const user = useSelector(state => state.session.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      dispatch(actionToggleTheme(user.data.web_color || 'light'));
    }
  }, [user]);

  return (
      <ThemeProvider theme={theme === 'dark' ? darkTheme : lightTheme}>
        <CssBaseline />
        <Router>
          <Route exact path="/" component={() => <Redirect to="/platform/" />} />
          <AuthRoute exact path="/signin/:code" component={Signin} />
          <AuthRoute exact path="/signin" component={Signin} />
          <AuthRoute exact path="/signup" component={Signup} />
          <ProtectedRoute path="/platform" component={() =>
            <Box minHeight="100vh" minWidth={1200} display="flex">
              <Menu />
              <Box flexGrow={1}>
                <Grid container style={{ position: 'relative', overflow: 'hidden' }}>
                  <Grid item xs={12}>
                    <Switch>
                      <Route exact path="/platform/content/:templateName" component={Template} />
                      <Route exact path="/platform/page/:pageID" component={Page} />
                      <Route exact path="/platform/exam/page/:pageID" component={Exam} />
                      <Route exact path="/platform/exam" component={Exam} />
                      <Route exact path="/platform/profile/:profileID" component={Profile} />
                      <Route exact path="/platform/friends" component={Friends} />
                    </Switch>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          } />
        </Router>
      </ThemeProvider>
  );
}

configureStore().then(store => {
  const root = document.getElementById('root');
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>
  , root);
});

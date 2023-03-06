import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from "react-router";
import validate from 'uuid-validate';
import { signoutRequest } from 'src/requests/authRequests';
import { requestUnitsLessons, requestPages, requestCheckpoints } from 'src/requests/courseRequests';
import { requestStudents } from 'src/requests/studentRequests';
import { actionSetMenuItem, actionSetTopMenuItem, actionToggleTheme, actionSetMenuWidth } from 'src/actions/actions';
import { queryGuard } from 'src/utils/queryGuard';
import EditProfile from 'src/components/profile/EditProfile';
import SocialMenuItem from 'src/components/menu/SocialMenuItem';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import _ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Popover from '@material-ui/core/Popover';
import PersonIcon from '@material-ui/icons/Person';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import ListSubheader from '@material-ui/core/ListSubheader';
import { mutateQuery, escapeData } from 'src/utils/API/queryAPI';
import MenuIcon from '@material-ui/icons/Menu';
import Drawer from'@material-ui/core/Drawer';

const useStyles = makeStyles(theme => ({
  menu: {
    width: '300px',
    minWidth: '300px',
    backgroundColor: '#F9FAFF',
    '&:hover $menuIcon': {
      display: 'block',
      float: 'right',
    }
  },
   collapsedMenu: {
    width: '300px',
    minWidth: '300px',
    backgroundColor: '#F9FAFF',
    left: '-270px',
    '&:hover $menuIcon': {
      display: 'block',
      float: 'right',
    }
  },
  menuIcon: {
    display: 'none',
    cursor: 'pointer',
  },
  bold: {
    fontWeight: 600,
  },
  cursor: {
    cursor: 'pointer',
  },
  hoverOut: {
    '&:hover $hoverIn': {
      display: 'inline-flex',
    },
  },
  hoverIn: {
    display: 'none',
  },
  selector: {
    '& select': {
      display: 'block',
      fontWeight: 'bold',
      border: 'none',
      boxShadow: 'none',
      backgroundColor: 'transparent',
      backgroundImage: 'none',
    },
    '& select:focus': {
      outline: 'none',
    },
  },
  logoHeader: {
    cursor: 'pointer',
    marginTop: theme.spacing(4),
  },
  profile: {
    padding: theme.spacing(1, 2),
    marginBottom: theme.spacing(3),
  },
  divider: {
    display: 'block',
    height: 1,
    border: 0,
    borderTop: '1px solid #ECECEC',
    padding: 0,
    width: '100%',
    margin: theme.spacing(3, 0),
  },
  disabledText: {
    color: '#B3B7C5',
  },
  photoBorder: {
    boxShadow: '0 0 0 2px #243E8E',
    border: '2px solid #ffffff',
    borderRadius: '50%',
  },
  logoMain: {
    fontWeight: 800,
  },
  logoSecond: {
    fontWeight: 100,
  },
  unreadIcon: {
    border: '1px solid #bdbdbd',
    borderRadius: 3,
    padding: 3,
    fontSize: '0.5rem',
    fontWeight: 600,
  },
  unreadRed: {
    color: '#fafafa',
    backgroundColor: '#ff0000',
  },
  HeaderMenu: {
    backgroundColor: '#FCFDFF',
  },
  LessonsMenu: {
    backgroundColor: '#F9FAFF',
  },
  sectionMenu: {
    marginTop: theme.spacing(5),
    backgroundColor: '#F9FAFF',
  },
  sectionName: {
    fontSize: '1rem',
    textTransform: 'uppercase',
    fontWeight: 800,
    borderRadius: theme.spacing(1),
  },
  verticalPopUp: {
    width: 200,
    display: 'flex',
    flexDirection: 'column',
  }
}));

const ListItemLink = withRouter((props) => {
  const { href, history, staticContext, ...rest } = props;
  return <ListItem button onClick={() => history.push(href)} {...rest} />;
});

const ListItem = withStyles(theme => ({
  root: {
    border: 'none',
    borderRadius: 30,
    display: 'inline-flex',
    width: 'auto',
  },
  selected: {},
}))(_ListItem);

export default withRouter(function Menu(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { location, history } = props;
  const [loading, setLoading] = useState(false);
  const [toggle, setToggle] = useState(null);
  const [anchor, setAnchor] = useState(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const user = useSelector(state => state.session.user);
  const units = useSelector(state => state.units);
  const pages = useSelector(state => state.pages);
  const selectedMenuItem = useSelector(state => state.selectedMenuItem);
  const selectedTopMenuItem = useSelector(state => state.selectedTopMenuItem);
  const students = useSelector(state => state.students);
  const theme = useSelector(state => state.theme);
  const menu = useSelector(state => state.menu);

  useEffect(() => {
    queryGuard(dispatch, requestUnitsLessons)(user.id);
    queryGuard(dispatch, requestStudents)();
  }, []);

  useEffect(() => {
    setAnchor(null);
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname === '/platform/' && units.length !== 0) {
      getPages(units[0].lessons[0].id);
    }
  }, [location.pathname, units]);

  const signOutHandle = () => {
    dispatch(signoutRequest()).then(() => {
      history.push('/signin')
    })
  };

  const headerProfileMenu = (event) => {
    setAnchor(anchor ? null : event.currentTarget);
  };

  const getPages = (lesson_id) => {
    if (loading) {
      return false;
    }
    setLoading(true);
    dispatch(requestCheckpoints(lesson_id)).then(checkpoints => {
      return dispatch(requestPages(lesson_id, null));
    }).then(pages => {
      setLoading(false);
      dispatch(actionSetMenuItem(lesson_id));
      history.push('/platform/page/' + pages[0].id);
    })
  };

  const renderLesson = (position, lesson) => {
    const ss = selectedMenuItem;
    var found = ss === lesson.id;
    return (
      <Box>
        <ListItem key={lesson.id} button selected={found} onClick={() => getPages(lesson.id)}>
          <ListItemText primaryTypographyProps={{ variant: 'h5', color: 'textPrimary' }} primary={position + '. ' + (lesson.data.title || lesson.data.name)} />
        </ListItem>
      </Box>
    );
  };

  const renderUnit = (unit) => {
    var found = toggle === unit.id;
    var toggle_fn = () => {
      setToggle(toggle === unit.id ? null : unit.id);
      if (!validate(selectedMenuItem)) {
        dispatch(actionSetMenuItem(null));
      }
    };
    return (
      <div key={unit.id}>
        <Box>
          <ListItem button onClick={toggle_fn}>
            <ListItemText primary={unit.data.title || unit.data.name} primaryTypographyProps={{ variant: 'h4', color: 'textPrimary', className: found ? classes.bold : '' }}/>
          </ListItem>
        </Box>
        <List component="div" dense={true} className={classes.LessonsMenu}>
          {unit.lessons.map((lesson, index) => renderLesson(index + 1, lesson))}
        </List>
      </div>
    );
  };

  const handleClick = (lesson_id, url, main_select) => {
    if (!lesson_id && !url && main_select === selectedTopMenuItem) {
      main_select = '';
    }
    dispatch(actionSetTopMenuItem(main_select || ''));
    dispatch(actionSetMenuItem(''));
    if (lesson_id) {
      getPages(lesson_id);
    }
    if (url) {
      history.push(url);
    }
  };

  const toggleDarkMode = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    dispatch(actionToggleTheme(newTheme));
      setLoading(true);
      const data = {
        web_color: newTheme
      };
      mutateQuery(`profile(id:"${user.id}" data:"${escapeData(data)}")`)
      .then(res => setLoading(false))
  }

  const toggleMenu = () => {
    dispatch(actionSetMenuWidth(menu.width === 300 ? 60 : 300));
  }

  const ss = selectedMenuItem;
  const top_ss = selectedTopMenuItem;
  return (
    <Drawer style={{ width: 300, borderRight: '1px solid #ECECEC', overflow: 'hidden' }} variant="permanent" open>
    <List component="nav" className={menu.width === 300 ? classes.menu : classes.collapsedMenu} dense={true}>
      <MenuIcon className={classes.menuIcon} onClick={ toggleMenu } />
      <Box px={2} className={classes.HeaderMenu}>
        <ListItem className={classes.logoHeader} onClick={() => handleClick(null, '/', null)}>
          <Typography className={classes.logoMain} variant="h4" color="textPrimary">Recur</Typography>
          <Box display="inline" ml={1}>
            <Typography className={classes.logoSecond} variant="h4" color="primary">by Formation</Typography>
          </Box>
        </ListItem>
        <ListItemLink selected={ss === user.id} className={[classes.profile, classes.hoverOut].join(' ')}>
          <ListItemAvatar>
            {user.photo
              ? <Avatar className={classes.photoBorder} src={user.photo.data.files[1].path} />
              : <PersonIcon className={classes.photoBorder} fontSize="large" />}
          </ListItemAvatar>
          <ListItemText
            primaryTypographyProps={{ variant: 'h5', style: {color: 'textPrimary', fontWeight: 'bold'}}}
            primary={(user?.data?.name || 'User')}
            secondaryTypographyProps={{ variant: 'h5', style: {color: '#B9BABD'}}}
            secondary="Software Engineer"
            onClick={(e) => { e.stopPropagation(); headerProfileMenu(e); }}
          />
        </ListItemLink>
      </Box>
      <Box px={2}>
        <SocialMenuItem />
        <List component="nav" className={classes.sectionMenu} dense={true} subheader={<ListSubheader disableSticky={true} className={classes.sectionName}>Learn</ListSubheader>}>
          {units.map(unit => renderUnit(unit))}
          <Popover open={!!anchor} anchorEl={anchor} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }} onClose={() => setAnchor(null)} onClick={() => setAnchor(null)}>
            <List className={classes.verticalPopUp} component="nav" dense={true}>
            <ListItem button onClick={() => setShowEditDialog(true)}>
                <ListItemText primary="Edit Profile" />
              </ListItem>
              <ListItem button onClick={() => signOutHandle()}>
                <ListItemText primary="Sign Out" />
              </ListItem>
              <ListItem button onClick={() => toggleDarkMode()}>
                <ListItemText primary="Toggle Dark Mode" />
              </ListItem>
            </List>
          </Popover>
        </List>
        <ListItem button selected={ss === 'exam'} onClick={() => handleClick(null, '/platform/exam', 'library')}>
          <ListItemText primaryTypographyProps={{ variant: 'h4', color: 'textPrimary' }} primary="Exam" />
        </ListItem>
      </Box>
      {showEditDialog ? <EditProfile onClose={() => setShowEditDialog(false)} /> : null}
    </List>
    </Drawer>
  );
});
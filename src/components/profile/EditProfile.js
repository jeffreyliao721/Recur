import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import ChangePassword from 'src/components/profile/ChangePassword';
import ChangeName from 'src/components/profile/ChangeName';

const useStyles = makeStyles(theme => ({
  cursor: {
    cursor: 'pointer',
  },
  title: {
    backgroundColor: theme.palette.editProfile.backgroundColor,
    borderBottom: theme.palette.editProfile.borderBottom,
  },
}));

const Dialog = withStyles(theme => ({
  paper: {
    borderRadius: 8,
  },
}))(_Dialog);


export default (function EditProfile(props) {
  const classes = useStyles();
  const [selectedView, setSelectedViewer] = useState('name');

  const toggleView = (view) => {
    setSelectedViewer(view);
  };

  const onClose = () => {
    props.onClose && props.onClose();
  };
  
  return (
    <Dialog open={true} onClose={() => onClose()} maxWidth="xs" fullWidth={true}>
      <DialogTitle className={classes.title} disableTypography={true}>
        <Box display="flex" alignItems="center">
          <Box flexGrow={1}>
            <Typography className={classes.header} color="textPrimary" variant="h3">Edit Profile</Typography>
          </Box>
        </Box>
      </DialogTitle>
      {selectedView === 'name'
        ? <ChangeName onClose={() => onClose()} handleToggleView={(view) => toggleView(view)}/>
        : <ChangePassword onClose={() => onClose()}  handleToggleView={(view) => toggleView(view)}/>}
    </Dialog>
  );
});

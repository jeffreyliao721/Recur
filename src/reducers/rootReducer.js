import { combineReducers } from 'redux';
import {
  authReducer,
  pageReducer,
  studentReducer,
  menuSelectedReducer,
  menuTopSelectedReducer,
  checkpointReducer,
  selectedFormDataReducer,
  submissionReducer,
  selectedPageReducer,
  unitReducer,
  skillScoreReducer,
  skillPageScoreReducer,
  skillsReducer,
  fileReducer,
  menuReducer,
  friendReducer,
  friendRequestReducer,
  friendRequestReceivedReducer,
  themeReducer
} from 'src/reducers/reducers';

const reducers = combineReducers({
  session: authReducer,
  units: unitReducer,
  students: studentReducer,
  pages: pageReducer,
  checkpoints: checkpointReducer,
  submissions: submissionReducer,
  selectedFormData: selectedFormDataReducer,
  selectedPage: selectedPageReducer,
  selectedMenuItem: menuSelectedReducer,
  selectedTopMenuItem: menuTopSelectedReducer,
  skillScores: skillScoreReducer,
  skillPageScores: skillPageScoreReducer,
  skills: skillsReducer,
  fileCache: fileReducer,
  menu: menuReducer,
  friends: friendReducer,
  friendRequests: friendRequestReducer,
  friendRequestsReceived: friendRequestReceivedReducer,
  theme: themeReducer
});

const rootReducer = (state, action) => {
  if (action.type === 'SIGNIN_USER' && action.user === null) {
    state = {};
  }
  return reducers(state, action);
}

export default rootReducer;

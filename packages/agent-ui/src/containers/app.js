import React from 'react';
import { withRouter } from 'react-router-dom';

import {
  TopBar,
  LeftNavigation,
  ContentPage,
  CreateMapDialog,
  AppendSegmentDialog
} from './';

export const App = () => (
  <div>
    <TopBar />
    <LeftNavigation />
    <ContentPage />
    <CreateMapDialog />
    <AppendSegmentDialog />
  </div>
);

export default withRouter(App);

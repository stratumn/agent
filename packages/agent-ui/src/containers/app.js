import React from 'react';
import { withRouter } from 'react-router-dom';

import { TopBar, LeftNavigation, ContentPage, CreateMapDialog } from './';

export const App = () => (
  <div>
    <TopBar />
    <LeftNavigation />
    <ContentPage />
    <CreateMapDialog />
  </div>
);

export default withRouter(App);

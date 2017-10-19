import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, Route } from 'react-router-dom';

import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';

import { withStyles } from 'material-ui/styles';

const Title = ({ title }) => (
  <Typography type="title" noWrap>
    {title}
  </Typography>
);

Title.propTypes = {
  title: PropTypes.string.isRequired
};

const drawerWidth = 240;

const styles = () => ({
  appBar: {
    position: 'absolute',
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth
  }
});

const TopBarContent = ({ style, title }) => (
  <AppBar className={style}>
    <Toolbar>
      <Title title={title} />
    </Toolbar>
  </AppBar>
);

TopBarContent.propTypes = {
  style: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired
};

function mapStateToProps(_, { classes, match }) {
  const { agent, process, detail, id } = match.params;
  let title = '';
  if (agent) title = agent;
  if (process) title = `${agent}: process`;
  if (detail) title = `${agent}: ${process} > ${detail}`;
  if (id) title = `${agent}: ${process} > ${detail} > ${id}`;

  return {
    style: classes.appBar,
    title
  };
}

const TopBarStyled = withStyles(styles)(
  connect(mapStateToProps)(TopBarContent)
);

export default () => (
  <Route path="/:agent?/:process?/:detail?/:id?" component={TopBarStyled} />
);

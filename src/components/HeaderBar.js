import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

const headerStyle = {
  background:
    'linear-gradient(90deg, rgba(0,212,255,1) 100%,rgba(200,134,130,0.41220238095238093) 0%, rgba(219,180,80,0.5550595238095238) 25%, rgba(230,230,255,0.28335084033613445) 62%)',
  color: 'white',
};

const HeaderBar = ({ title }) => (
  <div className="header">
    <AppBar position="static" color="default" style={headerStyle}>
      <Toolbar>
        <Typography variant="title" color="inherit">
          {title.pageTitle || 'Page Title Placeholder'}
        </Typography>
      </Toolbar>
    </AppBar>
  </div>
);

HeaderBar.propTypes = {
  title: PropTypes.shape({
    pageTitle: PropTypes.string.isRequired,
  }),
};

HeaderBar.defaultProps = {
  title: {
    pageTitle: 'Page Title Placeholder',
  },
};

export default HeaderBar;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Add from 'material-ui-icons/Add';
import Button from 'material-ui/Button';
import Remove from 'material-ui-icons/Remove';
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from 'material-ui/Table';
import TextField from 'material-ui/TextField';
import { withStyles } from 'material-ui/styles';
import tableStyle from '../styles/tables';

import * as statusTypes from '../constants/status';

class AgentsManager extends Component {
  constructor(props) {
    super(props);

    this.state = {
      agentName: '',
      agentUrl: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleAddAgent = this.handleAddAgent.bind(this);
  }

  handleChange(key, value) {
    this.setState({ ...this.state, [key]: value });
  }

  handleAddAgent() {
    const { agentName, agentUrl } = this.state;
    if (agentName && agentUrl) {
      this.props.addAgent(agentName.trim(), agentUrl.trim());
      this.setState({
        ...this.state,
        agentName: '',
        agentUrl: ''
      });
    }
  }

  render() {
    const { classes, agents, deleteAgent } = this.props;

    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Agent name</TableCell>
            <TableCell>Agent url</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {agents &&
            agents.map(({ name, url, status }) => (
              <TableRow
                key={name}
                className={classNames({
                  [classes.tableRowError]: status === statusTypes.FAILED
                })}
              >
                <TableCell>{name}</TableCell>
                <TableCell>{url}</TableCell>
                <TableCell>
                  <Button
                    type="remove"
                    onClick={() => {
                      deleteAgent(name);
                    }}
                  >
                    <Remove />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          <TableRow>
            <TableCell>
              <TextField
                placeholder="Agent name"
                value={this.state.agentName || ''}
                onChange={e => this.handleChange('agentName', e.target.value)}
                type="text"
              />
            </TableCell>
            <TableCell>
              <TextField
                placeholder="Agent url"
                value={this.state.agentUrl || ''}
                onChange={e => this.handleChange('agentUrl', e.target.value)}
                type="text"
              />
            </TableCell>
            <TableCell>
              <Button type="add" onClick={this.handleAddAgent}>
                <Add />
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  }
}

AgentsManager.propTypes = {
  addAgent: PropTypes.func.isRequired,
  deleteAgent: PropTypes.func.isRequired,
  agents: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired
    })
  ).isRequired,
  classes: PropTypes.shape({
    tableRowError: PropTypes.string.isRequired
  }).isRequired
};

export default withStyles(tableStyle)(AgentsManager);

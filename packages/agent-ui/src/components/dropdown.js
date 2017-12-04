import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Menu, { MenuItem } from 'material-ui/Menu';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import ChevronRight from 'material-ui-icons/ChevronRight';

class Dropdown extends Component {
  constructor(props) {
    super(props);
    this.openDropdown = this.openDropdown.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);

    this.state = {
      anchorEl: null
    };
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  getOnClick(option) {
    return () => this.selectOption(option);
  }

  openDropdown(event) {
    this.setState({
      anchorEl: event.currentTarget
    });
  }

  closeDropdown() {
    this.setState({ anchorEl: null });
  }

  handleClickOutside(event) {
    if (
      this.dropdownWrapper &&
      !this.dropdownWrapper.contains(event.target) &&
      this.state.anchorEl !== null
    ) {
      this.closeDropdown();
    }
  }

  selectOption(option) {
    this.props.onSelect(option);
    this.setState({ anchorEl: null });
  }

  render() {
    const { selected, options, label } = this.props;
    const { anchorEl } = this.state;

    return (
      <div
        ref={e => {
          this.dropdownWrapper = e;
        }}
      >
        <Typography type="body2" align="center">
          {label}
        </Typography>
        <Button onClick={this.openDropdown}>
          {selected}
          <ChevronRight />
        </Button>
        <Menu open={!!anchorEl} anchorEl={anchorEl}>
          {options.map(option => (
            <MenuItem
              key={option}
              selected={option === selected}
              onClick={this.getOnClick(option)}
            >
              {option}
            </MenuItem>
          ))}
        </Menu>
      </div>
    );
  }
}

Dropdown.propTypes = {
  label: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
  selected: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default Dropdown;

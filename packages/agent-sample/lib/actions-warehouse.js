export default {
  /**
    * Initialize a warehouse.
    * @param {string} warehouse - name or identifier of the warehouse
    */
  init(warehouse) {
    if (!warehouse) {
      return this.reject('a warehouse is required');
    }

    this.state = {
      warehouse: warehouse,
      items: {},
      employees: {}
    };

    return this.append();
  },

  /**
    * Store an item in the warehouse.
    * @param {string} id - id of the item
    * @param {string} description - description of the item
    */
  storeItem(id, description) {
    if (!id) {
      return this.reject('an id is required');
    }

    if (!description) {
      return this.reject('a description is required');
    }

    // Make sure ID doesn't already exist.
    if (this.state.items[id]) {
      return this.reject('this item is already inside the warehouse');
    }

    // Insert new item.
    this.state.items[id] = {
      description: description
    };

    // Append the new segment.
    return this.append();
  },

  /**
    * Enter the warehouse.
    * @param {string} employee - the name of the employee
    */
  enter(employee) {
    if (!employee) {
      return this.reject('employee name is required');
    }

    // Initialize the employee activity record if needed
    if (!this.state.employees[employee]) {
      this.state.employees[employee] = [];
    }

    // Insert the current time.
    this.state.employees[employee].push({
      activity: 'enter',
      date: Date.now()
    });

    // Append the new segment.
    return this.append();
  },

  /**
    * Leave the warehouse.
    * @param {string} employee - the name of the employee
    */
  leave(employee) {
    if (!employee) {
      return this.reject('employee name is required');
    }

    // Initialize the employee activity record if needed
    if (!this.state.employees[employee]) {
      this.state.employees[employee] = [];
    }

    // Insert the current time.
    this.state.employees[employee].push({
      activity: 'leave',
      date: Date.now()
    });

    // Append the new segment.
    return this.append();
  }
};

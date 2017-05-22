/* eslint-env node, mocha */
/* global expect */
/* eslint no-console: 0 */
'use strict';

import React from 'react';
import { shallow } from 'enzyme';

import StatusListComponent from 'components//StatusListComponent.js';

describe('StatusListComponent', () => {
  let component;

  beforeEach(() => {
    component = shallow(<StatusListComponent />);
  });

  it('should have its component name as default className', () => {
    expect(component.hasClass('statuslist-component')).to.equal(true);
  });
});

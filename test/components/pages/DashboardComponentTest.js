/* eslint-env node, mocha */
/* global expect */
/* eslint no-console: 0 */
'use strict';

import React from 'react';
import { shallow } from 'enzyme';

import DashboardComponent from 'components/pages/DashboardComponent.js';

describe('DashboardComponent', () => {
  let component;

  beforeEach(() => {
    component = shallow(<DashboardComponent />);
  });

  it('should have its component name as default className', () => {
    expect(component.hasClass('dashboard-component')).to.equal(true);
  });
});

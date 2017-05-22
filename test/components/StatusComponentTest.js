/* eslint-env node, mocha */
/* global expect */
/* eslint no-console: 0 */
'use strict';

import React from 'react';
import { shallow } from 'enzyme';

import StatusComponent from 'components/StatusComponent.js';

describe('StatusComponent', () => {
  let component;

  beforeEach(() => {
    component = shallow(<StatusComponent />);
  });

  it('should have its component name as default className', () => {
    expect(component.hasClass('status-component')).to.equal(true);
  });
});

/* eslint-env node, mocha */
/* global expect */
/* eslint no-console: 0 */
'use strict';

import React from 'react';
import { shallow } from 'enzyme';

import TopBarComponent from 'components//TopBarComponent.js';

describe('TopBarComponent', () => {
  let component;

  beforeEach(() => {
    component = shallow(<TopBarComponent />);
  });

  it('should have its component name as default className', () => {
    expect(component.hasClass('topbar-component')).to.equal(true);
  });
});

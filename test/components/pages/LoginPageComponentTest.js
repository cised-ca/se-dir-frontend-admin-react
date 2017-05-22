/* eslint-env node, mocha */
/* global expect */
/* eslint no-console: 0 */
'use strict';

import React from 'react';
import { shallow } from 'enzyme';

import LoginPageComponent from 'components/pages/LoginPageComponent.js';

describe('LoginPageComponent', () => {
  let component;

  beforeEach(() => {
    component = shallow(<LoginPageComponent />);
  });

  it('should have its component name as default className', () => {
    expect(component.hasClass('loginpage-component')).to.equal(true);
  });
});

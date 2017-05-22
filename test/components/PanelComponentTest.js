/* eslint-env node, mocha */
/* global expect */
/* eslint no-console: 0 */
'use strict';

import React from 'react';
import { shallow } from 'enzyme';

import PanelComponent from 'components/PanelComponent.js';

describe('PanelComponent', () => {
  let component;

  beforeEach(() => {
    component = shallow(<PanelComponent />);
  });

  it('should have its component name as default className', () => {
    expect(component.hasClass('panel-component')).to.equal(true);
  });
});


/* eslint-env node, mocha */
/* global expect */
/* eslint no-console: 0 */
'use strict';

import React from 'react';
import { shallow } from 'enzyme';

import TemplateComponent from 'components//TemplateComponent.js';
import LoginPage from 'components/pages/LoginPageComponent.js';

describe('TemplateComponent', () => {
  let component;

  let stateProps = {};

  beforeEach(() => {
    component = shallow(
      <TemplateComponent state={stateProps}>
        <LoginPage />
      </TemplateComponent>
    );
  });

  it('should have its component name as default className', () => {
    expect(component.hasClass('template-component')).to.equal(true);
  });
});

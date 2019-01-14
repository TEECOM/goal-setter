import React from 'react';
import { shallow } from 'enzyme';
import Authenticate from '../Authenticate';

it('renders a link', () => {
  const authenticate = shallow(<Authenticate />);

  expect(authenticate.find('a').exists()).toEqual(true);
});

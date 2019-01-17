import React from 'react';
import { shallow } from 'enzyme';
import Authenticate from '../Authenticate';

it('renders log in button if not given a token', () => {
  const authenticate = shallow(<Authenticate />);

  expect(authenticate.find('button').text()).toEqual('Log in');
});

it('renders log out button if given a token', () => {
  const authenticate = shallow(<Authenticate token={'a-token'} />);

  expect(authenticate.find('button').text()).toEqual('Log out');
});

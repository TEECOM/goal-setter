import React from 'react';
import { shallow } from 'enzyme';
import GoalSetter from '../GoalSetter';
import Authenticate from '../Authenticate';
import GoalsForm from '../GoalsForm';

it('renders Authenticate', () => {
  const goalSetter = shallow(<GoalSetter />);

  expect(goalSetter.find(Authenticate)).not.toBe(null);
});

it('renders GoalsForm', () => {
  const goalSetter = shallow(<GoalSetter />);

  expect(goalSetter.find(GoalsForm)).not.toBe(null);
});

it('passes correct props to Authenticate', () => {
  const token = 'a-token';

  const goalSetter = shallow(<GoalSetter />);

  goalSetter.setState({ token: token });
  const logOut = goalSetter.instance().logOut;
  const logIn = goalSetter.instance().logIn;

  const authenticate = goalSetter.find(Authenticate);

  expect(authenticate.props().logOut).toEqual(logOut);
  expect(authenticate.props().logIn).toEqual(logIn);
});

it('fetches the token when code is present', () => {
  window.history.pushState({}, 'Anything', '/?code=123');

  const mockSuccessResponse = {};
  const mockJsonPromise = Promise.resolve(mockSuccessResponse);
  const mockFetchPromise = Promise.resolve({
    json: () => mockJsonPromise,
  });
  jest.spyOn(global, 'fetch').mockImplementation(() => mockFetchPromise);
  const localStorageSpy = jest.spyOn(window.localStorage.__proto__, 'getItem');

  shallow(<GoalSetter />);

  expect(localStorageSpy).toBeCalledWith("token");
});

it('logs in', () => {
  Object.defineProperty(window.location, 'replace', {
    configurable: true
  });
  window.location.replace = jest.fn();

  const goalSetter = shallow(<GoalSetter />);

  const authenticate = jest.spyOn(goalSetter.instance(), 'authenticate')

  goalSetter.instance().logIn();

  expect(authenticate).toHaveBeenCalled();
});

it('logs out', () => {
  const localStorageSpy = jest.spyOn(window.localStorage.__proto__, 'setItem');

  const goalSetter = shallow(<GoalSetter />);
  goalSetter.setState({ token: 'a-token' });

  goalSetter.instance().logOut();

  expect(localStorageSpy).toBeCalledWith('token', '');
  expect(goalSetter.state()).toEqual({ token: '' });
});

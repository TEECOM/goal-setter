import React from 'react';
import { shallow } from 'enzyme';
import GoalSetter from '../GoalSetter';
import Authenticate from '../Authenticate';
import GoalsForm from '../GoalsForm';

it('renders Authenticate when not authenticated', () => {
  const goalSetter = shallow(<GoalSetter />);

  expect(goalSetter.contains(<Authenticate />)).toEqual(true);
});

it('renders GoalsForm when authenticated', () => {
  const goalSetter = shallow(<GoalSetter />);
  goalSetter.setState({ authenticated: true });

  expect(goalSetter.contains(<GoalsForm />)).toEqual(true);
});

it('fetches the token when code is present', () => {
  window.history.pushState({}, 'Anything', '/?code=123');

  const mockSuccessResponse = {};
  const mockJsonPromise = Promise.resolve(mockSuccessResponse);
  const mockFetchPromise = Promise.resolve({
    json: () => mockJsonPromise,
  });
  jest.spyOn(global, 'fetch').mockImplementation(() => mockFetchPromise);

  shallow(<GoalSetter />);

  expect(global.fetch).toHaveBeenCalledWith('https://goal-setter-gatekeeper.herokuapp.com/authenticate/123');
});

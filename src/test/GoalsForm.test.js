import React from 'react';
import { shallow } from 'enzyme';
import GoalsForm from '../GoalsForm';
import apiCommunicator from '../apiCommunicators/GitHubApiCommunicator';

jest.mock('../apiCommunicators/GitHubApiCommunicator');

it('renders a form', () => {
  const goalsForm = shallow(<GoalsForm />);

  expect(goalsForm.find('form').exists()).toEqual(true);
});

it('handles user input', () => {
  const goalsForm = shallow(<GoalsForm />);
  const input = goalsForm.find('input').at(0);
  const title = 'A Great Title';

  input.simulate('change', { target: { value: title} })

  expect(goalsForm.state()).toEqual({value: title});
});

it('handles submission', () => {
  apiCommunicator.mockImplementation(() => {
    return {createMilestone: jest.fn()};
  });

  const preventDefault = jest.fn();

  const token = 'A Great Token';
  const goalsForm = shallow(<GoalsForm token={token} />);
  const title = 'A Great Title';
  goalsForm.setState({value: title});

  goalsForm.simulate('submit', { preventDefault });

  expect(apiCommunicator.createMilestone).toHaveBeenCalledWith(title, token);
});

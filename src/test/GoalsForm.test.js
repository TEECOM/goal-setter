import React from 'react';
import { shallow } from 'enzyme';
import GoalsForm from '../GoalsForm';
import apiCommunicator from '../apiCommunicators/GitHubApiCommunicator';

jest.mock('../apiCommunicators/GitHubApiCommunicator', () => ({
  createMilestone: jest.fn(),
  fetchMilestones: jest.fn(() => Promise.resolve({
    data:[
      {'title': 'A Great Title'},
      {'title': 'A Greater Title'}
    ]
  })),
}));

it('renders a form', () => {
  const goalsForm = shallow(<GoalsForm token={'a-token'} />);

  expect(goalsForm.find('form').exists()).toEqual(true);
});

it('handles user input', () => {
  const goalsForm = shallow(<GoalsForm token={'a-token'} />);
  const input = goalsForm.find('input').at(0);
  const title = 'A Great Title';

  input.simulate('change', { target: { value: title} })

  expect(goalsForm.state()).toEqual({ value: title, milestones: [] });
});

it('handles submission', () => {
  const preventDefault = jest.fn();

  const token = 'A Great Token';
  const goalsForm = shallow(<GoalsForm token={token} />);
  const title = 'A Great Title';
  goalsForm.setState({value: title});

  goalsForm.find('form').simulate('submit', { preventDefault });

  expect(apiCommunicator.createMilestone).toHaveBeenCalledWith(title, token);
});

it('updates milestones', () => {
  const token = 'A Great Token';
  shallow(<GoalsForm token={token} />);

  expect(apiCommunicator.fetchMilestones).toHaveBeenCalledWith(token);
});

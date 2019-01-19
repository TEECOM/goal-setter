import React from 'react';
import { shallow } from 'enzyme';

import GoalsForm from '../GoalsForm';
import MilestoneField from '../MilestoneField';
import IssueField from '../IssueField';

import apiCommunicator from '../apiCommunicators/GitHubApiCommunicator';

jest.mock('../apiCommunicators/GitHubApiCommunicator', () => ({
  submitForm: jest.fn(),
}));

it('renders a form', () => {
  const goalsForm = shallow(<GoalsForm />);

  expect(goalsForm.find('form').exists()).toEqual(true);
});

it('renders a milestone field', () => {
  const goalsForm = shallow(<GoalsForm />);

  expect(goalsForm.find(MilestoneField).exists()).toEqual(true);
});

it('renders an issue field', () => {
  const goalsForm = shallow(<GoalsForm />);

  expect(goalsForm.find(IssueField).exists()).toEqual(true);
});

it('updates the milestone title', () => {
  const title = 'A Great Title';
  const goalsForm = shallow(<GoalsForm />);

  goalsForm.instance().handleChangeMilestoneTitle({
    target: { value: title },
  });

  expect(goalsForm.state().milestone.title).toBe(title);
});

it('updates the issue title', () => {
  const title = 'A Great Title';
  const goalsForm = shallow(<GoalsForm />);

  goalsForm.instance().handleChangeIssueTitle({
    target: { value: title },
  });

  expect(goalsForm.state().issue.title).toBe(title);
});

it('updates the issue body', () => {
  const body = 'A Great Body';
  const goalsForm = shallow(<GoalsForm />);

  goalsForm.instance().handleChangeIssueBody({
    target: { value: body },
  });

  expect(goalsForm.state().issue.body).toBe(body);
});

it('handles submission', () => {
  const preventDefault = jest.fn();

  const token = 'A Great Token';
  const goalsForm = shallow(<GoalsForm token={token} />);
  const milestone = { title: 'A Great Milestone' };
  const issue = {
    title: 'A Great Issue',
    issueBody: 'The Body of A Great Issue',
  };
  goalsForm.setState({ milestone, issue });

  goalsForm.find('form').simulate('submit', { preventDefault });

  expect(apiCommunicator.submitForm).toHaveBeenCalledWith(
    milestone,
    issue,
    token,
  );
});

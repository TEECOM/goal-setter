import React from 'react';
import { shallow, mount } from 'enzyme';

import GoalsForm from '../GoalsForm';
import MilestoneField from '../MilestoneField';
import IssueField from '../IssueField';
import DocField from '../DocField';

import apiCommunicator from '../apiCommunicators/gitHubApiCommunicator';

jest.mock('../apiCommunicators/gitHubApiCommunicator', () => ({
  submitForm: jest.fn(),
  getMilestonesAndIssues: jest.fn(),
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

it('gets milestones and issues upon mount', () => {
  const token = 'a-token';
  shallow(<GoalsForm token={token}/>);

  expect(apiCommunicator.getMilestonesAndIssues).toHaveBeenCalledWith(
    token,
    expect.any(Function),
  );
});

it('sets milestone and issue numbers', () => {
  const issues = { data: [{ number: 19 }] };
  const milestones = { data: [{ number: 1 }] };
  const goalsForm = shallow(<GoalsForm />);
  
  goalsForm.instance().setMilestoneAndIssueNumbers(issues, milestones);

  expect(goalsForm.state().milestoneNumber).toEqual(2);
  expect(goalsForm.state().issueNumber).toEqual(20);
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
  const newTitle = 'A Greater Title';
  const goalsForm = mount(<GoalsForm />);
  goalsForm.setState({ issues: [{ title: title }] });

  const issueField = goalsForm.find(IssueField).at(0);
  issueField.props().handleChangeTitle({
    target: { value: newTitle },
  });

  expect(goalsForm.state().issues[0].title).toBe(newTitle);
});

it('updates the issue body', () => {
  const body = 'A Great Body';
  const newBody = 'A Greater Body';
  const goalsForm = mount(<GoalsForm />);
  goalsForm.setState({ issues: [{
    title: 'A Title',
    body: body
  }] });

  const issueField = goalsForm.find(IssueField).at(0);
  issueField.props().handleChangeBody({
    target: { value: newBody },
  });

  expect(goalsForm.state().issues[0].body).toBe(newBody);
});

it('adds a new field', () => {
  const goalsForm = shallow(<GoalsForm />);

  goalsForm.instance().addIssue();

  expect(goalsForm.state().issues).toEqual([
    {title: '', body: ''},
    {title: '', body: ''}
  ]);
});

it('updates the doc directly', () => {
  const docText = "A Great Doc";
  const goalsForm = mount(<GoalsForm />);
  const docField = goalsForm.find(DocField).at(0);

  docField.props().updateDocDirectly({
    target: { value: docText },
  });

  expect(goalsForm.state().docText).toBe(docText);
});

it('handles submission', () => {
  const preventDefault = jest.fn();

  const token = 'A Great Token';
  const goalsForm = shallow(<GoalsForm token={token} />);
  const milestone = { title: 'A Great Milestone' };
  const issues = [
    { title: 'A Great Issue', issueBody: 'The Body of A Great Issue' },
  ];
  const docText = 'A great Text';
  const data = {
    milestone,
    issues,
    docText,
    milestoneNumber: 1,
    issueNumber: 1,
  }
  goalsForm.setState({ milestone, issues, docText });

  goalsForm.find('form').simulate('submit', { preventDefault });

  expect(apiCommunicator.submitForm).toHaveBeenCalledWith(
    data,
    token,
  );
});

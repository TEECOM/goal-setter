import React from 'react';
import { shallow, mount } from 'enzyme';

import GoalsForm from '../GoalsForm';
import MilestoneField from '../MilestoneField';
import IssueField from '../IssueField';
import DocField from '../DocField';
import RepoSelector from '../RepoSelector';

import apiCommunicator from '../apiCommunicators/gitHubApiCommunicator';

const mockRepoData = {
  data: [
    { name: 'repo-name', owner: { login: 'repo-owner' } },
    { name: 'another-repo', owner: { login: 'repo-owner' } },
  ]
};

jest.mock('../apiCommunicators/gitHubApiCommunicator', () => ({
  getRepos: jest.fn().mockResolvedValue({
    data: [
      { name: 'repo-name', owner: { login: 'repo-owner' } },
      { name: 'another-repo', owner: { login: 'repo-owner' } },
    ]
  }),
  getMilestonesAndIssues: jest.fn().mockResolvedValue({
    issues: [],
    milestones: [],
  }),
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

it('gets milestones and issues upon mount', done => {
  const token = 'a-token';
  const owner = mockRepoData.data[0].owner.login;
  const name = mockRepoData.data[0].name;

  shallow(<GoalsForm token={token}/>);

  setTimeout(() => {
    expect(apiCommunicator.getMilestonesAndIssues).toHaveBeenCalledWith(
      token,
      { owner, repo: name },
    );

    done();
  });
});

it('sets milestone and issue numbers', () => {
  const issues = [{ number: 19 }];
  const milestones = [{ number: 1 }];
  const goalsForm = shallow(<GoalsForm />);
  
  goalsForm.instance().setMilestoneAndIssueNumbers({ issues, milestones });

  expect(goalsForm.state().milestoneNumber).toEqual(2);
  expect(goalsForm.state().issueNumber).toEqual(20);
});

it('updates the repo link', done => {
  const goalsForm = mount(<GoalsForm />);
  const repoLink = goalsForm.find(RepoSelector);

  setTimeout(() => {
    repoLink.find('select').simulate('change', { target: { value: 1 } });

    expect(goalsForm.state().currentRepo.name).toEqual('another-repo');
    done();
  });
});

it('updates the milestone title', done => {
  const title = 'A Great Title';
  const goalsForm = shallow(<GoalsForm />);

  setTimeout(() => {
    goalsForm.instance().handleChangeMilestoneTitle({
      target: { value: title },
    });

    expect(goalsForm.state().milestone.title).toBe(title);

    done();
  });
});

it('updates the issue title', done => {
  const title = 'A Great Title';
  const newTitle = 'A Greater Title';
  const goalsForm = mount(<GoalsForm />);

  setTimeout(() => {
    goalsForm.setState({ issues: [{ title: title }] });

    const issueField = goalsForm.find(IssueField).at(0);
    issueField.props().handleChangeTitle({
      target: { value: newTitle },
    });

    expect(goalsForm.state().issues[0].title).toBe(newTitle);

    done();
  });
});

it('updates the issue body', done => {
  const body = 'A Great Body';
  const newBody = 'A Greater Body';
  const goalsForm = mount(<GoalsForm />);

  setTimeout(() => {
    goalsForm.setState({ issues: [{
      title: 'A Title',
      body: body
    }] });

    const issueField = goalsForm.find(IssueField).at(0);
    issueField.props().handleChangeBody({
      target: { value: newBody },
    });

    expect(goalsForm.state().issues[0].body).toBe(newBody);

    done();
  });
});

it('adds a new field', done => {
  const goalsForm = shallow(<GoalsForm />);

  setTimeout(() => {
    goalsForm.instance().addIssue();

    expect(goalsForm.state().issues).toEqual([
      {title: '', body: ''},
      {title: '', body: ''}
    ]);

    done();
  });
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

it('handles submission', done => {
  const preventDefault = jest.fn();

  const token = 'A Great Token';
  const goalsForm = shallow(<GoalsForm token={token} />);
  const milestone = { title: 'A Great Milestone' };
  const issues = [
    { title: 'A Great Issue', issueBody: 'The Body of A Great Issue' },
  ];
  const docText = 'A great Text';
  const repos = mockRepoData.data.map((repo) => {
    return { name: repo.name, owner: repo.owner.login }
  });
  
  const data = {
    milestone,
    issues,
    docText,
    milestoneNumber: 1,
    issueNumber: 1,
    repos,
    currentRepo: repos[0],
  }
  goalsForm.setState({ milestone, issues, docText });

  setTimeout(() => {
    goalsForm.find('form').simulate('submit', { preventDefault });

    expect(apiCommunicator.submitForm).toHaveBeenCalledWith(
      data,
      token,
    );

    done();
  });
});

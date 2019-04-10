import React from 'react';
import { shallow, mount } from 'enzyme';
import * as sinon from 'sinon';

import GoalsForm from '../GoalsForm';
import MilestoneField from '../MilestoneField';
import IssueField from '../IssueField';
import DocField from '../DocField';
import RepoSelector from '../RepoSelector';

import gitHubApiCommunicator from '../apiCommunicators/gitHubApiCommunicator';

describe('layout', () => {
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

  it('renders no result', () => {
    const goalsForm = mount(<GoalsForm />);

    expect(goalsForm.find(".success").length).toEqual(0)
    expect(goalsForm.find(".error").length).toEqual(0)
  });

  it('renders errors', () => {
    const goalsForm = shallow(<GoalsForm />);
    goalsForm.setState({ errors: ["error-message"] });

    expect(goalsForm.find(".error").text()).toEqual("error-message");
  });

  it('renders success message', () => {
    const goalsForm = shallow(<GoalsForm />);
    goalsForm.setState({ success: true });

    expect(goalsForm.find(".success").text()).toEqual("Success!");
  });
});

describe('initialization', () => {
  it('gets milestones and issues upon mount', async () => {
    const token = 'a-token';
    const repo = 'repo-name';
    const owner = 'repo-owner';
    sinon.stub(gitHubApiCommunicator, "getRepos").resolves(
      { data: [{ name: repo, owner: { login: owner }, default_branch: '' }] }
    )
    const getMilestonesAndIssuesStub = sinon.stub(
      gitHubApiCommunicator,
      "getMilestonesAndIssues",
    );
    getMilestonesAndIssuesStub.withArgs(
      token,
      { owner, repo },
    ).resolves({ issues: "", milestones: "" })

    shallow(<GoalsForm token={token}/>);

    await resolvePromises();

    expect(getMilestonesAndIssuesStub.getCall(0).args).toEqual(
      [token, { owner, repo }],
    )
  });

  it('sets milestone and issue numbers', () => {
    const issues = [{ number: 19 }];
    const milestones = [{ number: 1 }];
    const goalsForm = shallow(<GoalsForm />);
    
    goalsForm.instance().setMilestoneAndIssueNumbers({ issues, milestones });

    expect(goalsForm.state().milestoneNumber).toEqual(2);
    expect(goalsForm.state().issueNumber).toEqual(20);
  });
});

describe('interaction', () => {
  it('updates the repo link', async () => {
    const repo = 'repo-name';
    const owner = 'repo-owner';
    sinon.stub(gitHubApiCommunicator, "getRepos").resolves(
      { data: [
        { name: repo, owner: { login: owner }, default_branch: '' },
        { name: 'another-repo', owner: { login: owner }, default_branch: '' },
      ] }
    )
    const goalsForm = mount(<GoalsForm />);

    await resolvePromises();

    const repoLink = goalsForm.find(RepoSelector);
    repoLink.find('select').simulate('change', { target: { value: 1 } });

    expect(goalsForm.state().currentRepo.name).toEqual('another-repo');
  });

  it('updates the milestone title', () => {
    const title = 'A Great Title';
    const goalsForm = shallow(<GoalsForm />);

    goalsForm.instance().handleChangeMilestoneTitle({
      target: { value: title },
    });

    expect(goalsForm.state().milestone.title).toEqual(title);
  });

  it('updates the issue title', () => {
    const title = 'A Great Title';
    const newTitle = 'A Greater Title';
    const goalsForm = shallow(<GoalsForm />);

    goalsForm.setState({ issues: [{ title: title }] });

    const issueField = goalsForm.find(IssueField).at(0);
    issueField.props().handleChangeTitle({
      target: { value: newTitle },
    });

    expect(goalsForm.state().issues[0].title).toEqual(newTitle);
  });

  it('updates the issue body', () => {
    const body = 'A Great Body';
    const newBody = 'A Greater Body';
    const goalsForm = mount(<GoalsForm />);

    goalsForm.setState({ issues: [
      { title: 'A Title', body: body }
    ] });

    const issueField = goalsForm.find(IssueField).at(0);
    issueField.props().handleChangeBody({
      target: { value: newBody },
    });

    expect(goalsForm.state().issues[0].body).toEqual(newBody);
  });

  it('adds a new field', () => {
    const goalsForm = shallow(<GoalsForm />);

    goalsForm.instance().addIssue();

    expect(goalsForm.state().issues).toEqual([
      {title: '', body: ''},
      {title: '', body: ''}
    ]);
  });

  it('updates the doc filename', () => {
    const docFilename = "A Great Filename";
    const goalsForm = mount(<GoalsForm />);
    const docField = goalsForm.find(DocField).at(0);

    docField.props().updateFilename({
      target: { value: docFilename },
    });

    expect(goalsForm.state().docFilename).toEqual(docFilename);
    
  });

  it('updates the doc text directly', () => {
    const docText = "A Great Doc";
    const goalsForm = mount(<GoalsForm />);
    const docField = goalsForm.find(DocField).at(0);

    docField.props().updateTextDirectly({
      target: { value: docText },
    });

    expect(goalsForm.state().docText).toEqual(docText);
  });

  describe('form submission', () => {
    it('handles submission', () => {
      const preventDefault = jest.fn();

      const token = 'a-token';
      const repo = 'repo-name';
      const owner = 'repo-owner';
      const milestone = { title: 'A Great Milestone' };
      const issues = [
        { title: 'A Great Issue', issueBody: 'The Body of A Great Issue' },
      ];
      const repos = [
        { name: repo, owner: { login: owner }, default_branch: '' },
      ];
      const docFilename = 'a great filename';
      const docText = 'A great Text';
      const expectedData = {
        milestone,
        issues,
        docFilename,
        docText,
        milestoneNumber: 1,
        issueNumber: 1,
        repos,
        currentRepo: repos[0],
        errors: [],
        success: false,
      }

      sinon.stub(gitHubApiCommunicator, "getRepos").resolves(
        { data: repos }
      )
      const getMilestonesAndIssuesStub = sinon.stub(
        gitHubApiCommunicator,
        "getMilestonesAndIssues",
      );
      getMilestonesAndIssuesStub.withArgs(
        token,
        { owner, repo },
      ).resolves({ issues: "", milestones: "" })
      const submitFormStub = sinon.stub(
        gitHubApiCommunicator,
        "submitForm",
      );
      submitFormStub.withArgs(
        expectedData,
        token,
      ).resolves([])

      const goalsForm = shallow(<GoalsForm token={token} />);
      goalsForm.setState(expectedData);

      goalsForm.find('form').simulate('submit', { preventDefault });

      expect(gitHubApiCommunicator.submitForm.getCall(0).args).toEqual([expectedData, token]);
    });

    it('sets submission result', async () => {
      const preventDefault = jest.fn();
      sinon.stub(gitHubApiCommunicator, "getRepos").resolves(
        { data: [{ name: '', owner: {}, branch: '' }] }
      )
      const getMilestonesAndIssuesStub = sinon.stub(
        gitHubApiCommunicator,
        "getMilestonesAndIssues",
      );
      getMilestonesAndIssuesStub.resolves({ issues: "", milestones: "" })
      const submitFormStub = sinon.stub(
        gitHubApiCommunicator,
        "submitForm",
      );
      submitFormStub.resolves([{}])

      const goalsForm = shallow(<GoalsForm token={'A Great Token'} />);

      goalsForm.find('form').simulate('submit', { preventDefault });

      await resolvePromises();

      expect(goalsForm.state().success).toEqual(true);
    });

    it('sets errors', async () => {
      const preventDefault = jest.fn();
      sinon.stub(gitHubApiCommunicator, "getRepos").resolves(
        { data: [{ name: '', owner: {}, branch: '' }] }
      )
      const getMilestonesAndIssuesStub = sinon.stub(
        gitHubApiCommunicator,
        "getMilestonesAndIssues",
      );
      getMilestonesAndIssuesStub.resolves({ issues: "", milestones: "" })
      const submitFormStub = sinon.stub(
        gitHubApiCommunicator,
        "submitForm",
      );
      submitFormStub.resolves([{ errors: [
        { code: "missing_field", resource: "a-resource", field: "a-field" },
      ]}])

      const goalsForm = shallow(<GoalsForm token={'A Great Token'} />);

      goalsForm.find('form').simulate('submit', { preventDefault });

      await resolvePromises();

      expect(goalsForm.state().success).toEqual(false);
      expect(goalsForm.state().errors).toEqual(["a-resource is missing a-field"]);
    });

    it('handles codeless errors', async () => {
      const preventDefault = jest.fn();
      sinon.stub(gitHubApiCommunicator, "getRepos").resolves(
        { data: [{ name: '', owner: {}, branch: '' }] }
      )
      const getMilestonesAndIssuesStub = sinon.stub(
        gitHubApiCommunicator,
        "getMilestonesAndIssues",
      );
      getMilestonesAndIssuesStub.resolves({ issues: "", milestones: "" })
      const submitFormStub = sinon.stub(
        gitHubApiCommunicator,
        "submitForm",
      );
      submitFormStub.resolves([{ errors: [
        { code: "unknown" },
      ]}])

      const goalsForm = shallow(<GoalsForm token={'A Great Token'} />);

      goalsForm.find('form').simulate('submit', { preventDefault });

      await resolvePromises();

      expect(goalsForm.state().success).toEqual(false);
      expect(goalsForm.state().errors).toEqual(["There was a problem!"]);
    });
  });
});

const resolvePromises = () => {
  return new Promise(resolve => {
    setTimeout(resolve, 0);
  })
};

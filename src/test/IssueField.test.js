import React from 'react';
import { shallow } from 'enzyme';

import IssueField from '../IssueField';

it('renders a label', () => {
  const issueField = shallow(<IssueField />);

  expect(issueField.find('label').exists()).toEqual(true);
});

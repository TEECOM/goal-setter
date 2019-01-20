import React from 'react';
import { shallow } from 'enzyme';

import MilestoneField from '../MilestoneField';

it('renders a label', () => {
  const milestoneField = shallow(<MilestoneField />);

  expect(milestoneField.find('section').exists()).toEqual(true);
});

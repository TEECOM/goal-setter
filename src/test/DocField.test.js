import React from 'react';
import { shallow } from 'enzyme';

import DocField from '../DocField';

it('renders a textarea', () => {
  const docField = shallow(<DocField />);

  expect(docField.find('textarea').exists()).toEqual(true);
});


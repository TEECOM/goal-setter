import React from 'react';
import { shallow } from 'enzyme';
import GoalsForm from '../GoalsForm';

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
  window.alert = jest.fn();
  const preventDefault = jest.fn();

  const goalsForm = shallow(<GoalsForm />);
  const title = 'A Great Title';
  goalsForm.setState({value: title});

  goalsForm.simulate('submit', { preventDefault });

  expect(window.alert).toHaveBeenCalledWith(`A title was submitted: ${title}`);
});

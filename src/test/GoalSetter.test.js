import React from 'react';
import ReactDOM from 'react-dom';
import GoalSetter from '../GoalSetter';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<GoalSetter />, div);
  ReactDOM.unmountComponentAtNode(div);
});

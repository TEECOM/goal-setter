import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import * as sinon from 'sinon';

afterEach(() => {
  sinon.restore();
});


configure({ adapter: new Adapter() });

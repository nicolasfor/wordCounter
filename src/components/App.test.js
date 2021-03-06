import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Dictionary from './Dictionary';
import { shallow, mount } from 'enzyme';
import renderer from 'react-test-renderer';
import Dropzone from 'react-dropzone'

describe(App, () => {
	const plainText='@you i&%&% an $%construct a f%ile... construct'
	const parts = [
	  new Blob([plainText], {type: 'text/plain'})
	];

	// Construct a file
	const file = new File(parts, 'sample.txt', {
	    lastModified: new Date(0),
	    type: "text/plain"
	});

	const files = [file]

	const parts2 = [
	  new Blob([plainText], {type: 'mov'})
	];
	const badFile = new File(parts2, 'sample.mov', {
	    lastModified: new Date(0),
	    type: "mov"
	});

	it('renders without crashing', () => {
	  const div = document.createElement('div');
	  ReactDOM.render(<App />, div);
	  ReactDOM.unmountComponentAtNode(div);
	});

	it("renders and matches our snapshot", () => {
	    const component = renderer.create(<App />);
	    const tree = component.toJSON();
	    expect(tree).toMatchSnapshot();
	  });

	it('should called createDictionary', () => {
	    const componentWrapper   = shallow(<App/>);
	    const component          = componentWrapper.instance();

	    const spy = jest.spyOn(component, "createDictionary");
	    componentWrapper.find(Dropzone).simulate('drop', files)
	    expect(spy).toHaveBeenCalledTimes(1)
	    expect(spy).toHaveBeenCalledWith(files)
	});

	it('should call readerPromise file size times', async () => {
	    const componentWrapper = shallow(<App />);
	    const component = componentWrapper.instance();
		const spy = jest.spyOn(component, "readerPromise");
		await component.createDictionary(files)
		expect(spy).toHaveBeenCalledTimes(files.length)
	});

	it('should detect file types not allowed', async () => {
	    const componentWrapper = shallow(<App />);
	    const component = componentWrapper.instance();

		expect.assertions(1);
		try {
		    await component.readerPromise(badFile)
		} catch (e) {
		    expect(e).toEqual(badFile.name+" is not a valid format");
		}
	});

	it('Plain text should keep as original', async () => {
	    const componentWrapper = shallow(<App />);
	    const component = componentWrapper.instance();
		await component.createDictionary(files)
		let dictionaries = componentWrapper.state().dictionaries
		expect(dictionaries.length).toEqual(1)
		expect(dictionaries[0].plainText).toEqual(plainText)
	});

	it('Dictionary should populate correctly deleting black list words', async () => {
	    const componentWrapper = shallow(<App />);
	    const component = componentWrapper.instance();
		await component.createDictionary(files)
		let obj ={"c": {"construct": 2}, "f": {"file": 1}}
		let dictionaries = componentWrapper.state().dictionaries
		expect(dictionaries[0].dictionary).toEqual(obj);
	});

	it('It should create dictionary size of childs', async () => {
	    const componentWrapper = shallow(<App />);
	    const component = componentWrapper.instance();
		await component.createDictionary(files)
		expect(componentWrapper.find(Dictionary)).toHaveLength(1);
	});

	it('Collapsable state should be false unless one item is clicked', async () => {
	    const componentWrapper = shallow(<App />);
	    const component = componentWrapper.instance();
		await component.createDictionary(files)
		let dictionaries = componentWrapper.state().dictionaries
		const childWrapper = shallow(<Dictionary dictionary={dictionaries[0]}/>);
		childWrapper.instance().handleClick(0);
		expect(childWrapper.state().toCollapse).toEqual(true);


	});
});
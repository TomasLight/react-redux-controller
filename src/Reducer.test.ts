import { AppAction } from './AppAction';
import { Reducer } from './Reducer';

class Store {
	flag: boolean;
	text: string;

	constructor() {
		this.flag = false;
		this.text = '';
	}
}

const actionType = 'UPDATE_STORE';
const reducer = Reducer(new Store(), actionType);

it('update store', () => {
	const store = new Store();
	const action = new AppAction(actionType, {
		flag: true,
	});

	const updatedStore = reducer(store, action);
	expect(updatedStore).not.toStrictEqual(store);
	expect(updatedStore.flag).toEqual(true);
});

it('any action', () => {
	const store = new Store();
	const action = new AppAction('some_type', {
		flag: true,
	});

	const updatedStore = reducer(store, action);
	expect(updatedStore === store).toBe(true);
});

it('empty action', () => {
	const store = new Store();
	const action = new AppAction(actionType);

	const updatedStore = reducer(store, action);
	expect(updatedStore === store).toBe(false);
});

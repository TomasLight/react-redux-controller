# Changelog

### 1.3.0

BREAKING CHANGES:
* removed `DecoratedWatchedController` (use `ControllerWithCustomActionTypes` instead of it);
* changed generic of `Action`, now by default Payload is `undefined` (before it was `any`);
* removed type `ActionWithCallback`;

Features:
* added `ControllerWithCustomActionTypes` type for customized action types:
```ts
import { Action, ControllerBase, ControllerWithCustomActionTypes, watch, WatchedController } from '@tomas_light/react-redux-controller';

type MyState = {};
type OpenUserActionPayload = { userID: string };

@watch
class MyController extends ControllerBase<MyState> {
  @watch
  check(action: Action) {}

  @watch
  loadUsers() {}

  @watch('openUserForEditing')
  openUser(action: Action<OpenUserActionPayload>) {}
}

const myController: Omit<WatchedController<MyController>, 'openUserForEditing'> &
  ControllerWithCustomActionTypes<{
    openUserForEditing: OpenUserActionPayload;
  }> = MyController as any;

export { myController as MyController };
```
* improved `watcher` type;

Bugfix:
* fixed type bug, when you have to pass something to action creator in case:
```
class Controller {
  @watch
  myMethod(action: Action) {/*...*/}
}

dispatch(Controller.myMethod(null)); // before
dispatch(Controller.myMethod()); // after
```

### 1.2.0

BREAKING CHANGES:
* removed `createActionWithCallback` function;
* removed `callbackAction` property from Action (use `addNextActions` instead of this);
* `actions` property of Action is <b>readonly</b> now (use `addNextActions` instead of this). Changed type to `(Action | ActionFactory)[]`;
* `stopPropagation` property of Action is <b>readonly</b> now;
* changed type of `watcher` function. 
Now it contains only `get` and `type` properties.
Its second argument now is record-object (it was tuples array before).
Changed accepted generic type: `watcher<MyState, MyController>` => `watcher<keyof MyController>`.
* `CallbackAction` type is renamed to `ActionFactory`;
* update type of `watch` decorator;
* `Middleware` can't be instantiated anymore. It is used only as a token for DI. It will throw an error when you'll try to create it by yourself;
* updated type of `WatchedConstructor`;

Features:
* added `addNextActions` method to Action. It adds actions to the action chain after current action.
```tsx
import { useDispatch } from 'react-redux';
import { createAction } from 'react-redux-controller';

const MyComponent = () => {
  const dispatch = useDispatch();
  
  const initAppAfterAuthorization = () => {
    const authorizeAction = createAction('AUTH');
    const loadProfileAction = createAction('LOAD_MY_PROFILE');
    const loadSettingsAction = createAction('LOAD_MY_SETTINGS');

    authorizeAction.addNextActions(loadProfileAction, loadSettingsAction);
    dispatch(authorizeAction);
  };
  
  // ...
}
```
* added `chainActions` function to convenient chaining actions one after one:
```tsx
import { useDispatch } from 'react-redux';
import { createAction, chainActions } from 'react-redux-controller';

const MyComponent = () => {
  const dispatch = useDispatch();

  const initAppAfterAuthorization = () => {
    const authorizeAction = createAction('AUTH');
    const loadProfileAction = createAction('LOAD_MY_PROFILE');
    const loadSettingsAction = createAction('LOAD_MY_SETTINGS');

    const chainedAction = chainActions(
      authorizeAction,
      loadProfileAction,
      loadSettingsAction
    );
    dispatch(chainedAction);
  };

  // ...
}
```

### 1.1.0

Bugfixes:
* fixed asynchronous action execution of callback actions.
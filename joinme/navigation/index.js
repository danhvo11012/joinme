import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import AuthNavigator from './AuthNavigator';
import BottomTabNavigator from './BottomTabNavigator';

const SwitchNavigator = createSwitchNavigator(
  {
    Auth: AuthNavigator,
    App: BottomTabNavigator,
  },
  {
    initialRouteName: 'Auth',
  }
)

const AppContainer = createAppContainer(SwitchNavigator);

export default AppContainer;

import 'react-native-gesture-handler';
import { AppRegistry, LogBox } from 'react-native';
import App from 'app/index';

LogBox.ignoreAllLogs();
AppRegistry.registerComponent('explorebtk', () => App);

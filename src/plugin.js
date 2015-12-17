import 'babel-polyfill';
import {HomeWizardPlatform} from './platform';

export default homebridgeInstance => {
  GLOBAL.homebridge = homebridgeInstance; //eslint-disable-line
  homebridgeInstance.registerPlatform('homebridge-homewizard', 'HomeWizard', HomeWizardPlatform);
};

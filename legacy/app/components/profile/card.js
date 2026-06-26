import Component from '@glimmer/component';

export default class ProfileCardComponent extends Component {
  getCardClass(url) {
    if (url) {
      return 'card';
    } else {
      return 'card-no-image';
    }
  }

  getCardBodyClass(url) {
    if (url) {
      return 'card-body';
    } else {
      return 'card-body-no-image';
    }
  }
}

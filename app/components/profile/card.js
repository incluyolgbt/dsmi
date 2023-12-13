import Component from '@glimmer/component';

export default class ProfileCardComponent extends Component {
  comparePriceRange(priceMin, priceMax) {
    if (priceMin === priceMax) {
      return true;
    }
    return false;
  }

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

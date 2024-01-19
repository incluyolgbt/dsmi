import Component from '@glimmer/component';

export default class GlobalFooterComponent extends Component {
  get currentYear() {
    const currentDate = new Date();
    return currentDate.getFullYear().toString();
  }
}

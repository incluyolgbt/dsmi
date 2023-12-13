import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class GlobalHeaderComponent extends Component {
  @tracked isChecked = false;

  @action
  toggleBackMenu() {
    this.isChecked = !this.isChecked;
  }
}

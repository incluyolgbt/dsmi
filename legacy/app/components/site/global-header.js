import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import ENV from 'dsmi/config/environment';

export default class GlobalHeaderComponent extends Component {
  @tracked isChecked = false;

  get desktopLogoUrl() {
    return `${ENV.SUPABASEURL}/storage/v1/object/public/resources/logo-incluyo.webp`;
  }

  get mobileLogoUrl() {
    return `${ENV.SUPABASEURL}/storage/v1/object/public/resources/logo-incluyo-blanco.webp`;
  }

  @action
  toggleBackMenu() {
    this.isChecked = !this.isChecked;
  }
}

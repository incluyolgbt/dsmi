import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class ProfileController extends Controller {
  @action
  scrollToTop() {
    // if (this.scroll) {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    // }
  }
}

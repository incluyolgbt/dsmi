import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class ProfileController extends Controller {
  @action
  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
}

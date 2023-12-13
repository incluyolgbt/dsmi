import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class ProfilesController extends Controller {
  @service router;

  queryParams = ['page', 'scroll'];
  page = 1;

  @tracked scroll;

  @action
  prevPage() {
    const page = parseInt(this.page) - 1;
    this.router.transitionTo('profile', { queryParams: { page } });
  }

  @action
  nextPage() {
    const page = parseInt(this.page) + 1;
    this.router.transitionTo('profile', { queryParams: { page } });
  }

  @action
  scrollToTop() {
    if (this.scroll) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  }
}

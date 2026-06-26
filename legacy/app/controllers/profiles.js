import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class ProfilesController extends Controller {
  @service router;
  @service store;

  queryParams = ['page'];

  @tracked page = 1;

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
  applyFilters() {
    const page = 1;
    this.router.transitionTo('profile', { queryParams: { page } });
  }

  @action
  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
}

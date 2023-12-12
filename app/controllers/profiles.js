import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class ProfilesController extends Controller {
  @service router;

  queryParams = ['page'];
  page = 1;

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
}

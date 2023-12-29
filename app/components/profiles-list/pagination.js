import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class ProfilesListPaginationComponent extends Component {
  @action 
  totalPages (profileCount) {
    return Math.ceil(profileCount/10);
  }
}
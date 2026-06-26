import Component from '@glimmer/component';
import { getOwner } from '@ember/application';
import { action } from '@ember/object';

export default class ProfilesListCardComponent extends Component {
  get store() {
    return getOwner(this).lookup('service:store');
  }

  get genericProfilePicture() {
    const randomInt = Math.floor(Math.random() * 6);
    return `/img/profile-pictures/${randomInt}.svg`;
  }

  @action
  getLocationName(locationId) {
    if (locationId) {
      const location = this.store.peekRecord('locations', locationId);
      if (location) {
        return `${location.city}, ${location.country}`;
      }
    }
  }
}

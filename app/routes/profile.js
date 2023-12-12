import Route from '@ember/routing/route';
import { service } from '@ember/service';
import RSVP from 'rsvp';

export default class ProfileRoute extends Route {
  @service store;
  @service router;

  async model(params) {
    const profileId = params.mentalHealthEntity_id;
    let profile;

    try {
      profile = await this.store.findRecord(
        'mental-health-entities',
        profileId,
      );
    } catch (e) {
      this.router.transitionTo('not-found', 'not-found');
    }

    const res = await RSVP.hash({
      modalities: this.store.query('modalities', {
        query: {
          mentalHealthEntityId: profileId,
        },
      }),
      focusAreas: this.store.query('focus-areas', {
        query: { mentalHealthEntityId: profileId },
      }),
      socialMedia: this.store.query('social-media', {
        query: { mentalHealthEntityId: profileId },
      }),
    });

    const location = await this.store.findRecord('locations', profile.location);

    return { ...res, profile, location };
  }
}

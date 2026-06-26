import Model, { attr } from '@ember-data/model';

export default class SocialMediaModel extends Model {
  @attr('string') mentalHealthEntityId;
  @attr('string') name;
  @attr('string') handle;
  @attr('string') url;
}

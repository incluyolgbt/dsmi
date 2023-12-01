import Model, { attr } from '@ember-data/model';

export default class LocationsModel extends Model {
  @attr('string') city;
  @attr('string') state;
  @attr('string') country;
}

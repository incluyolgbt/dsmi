import Model, { attr } from '@ember-data/model';

export default class AppointmentTypesModel extends Model {
  @attr('string') mentalHealthEntityId;
  @attr('string') name;
  @attr('number') priceMin;
  @attr('number') priceMax;
}

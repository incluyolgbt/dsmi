import Model, { attr } from '@ember-data/model';

export default class ModalitiesModel extends Model {
  @attr('string') mentalHealthEntityId;
  @attr('string') name;
  @attr('string') type;
  @attr('number') priceMin;
  @attr('number') priceMax;
  @attr('string') url;
  @attr('string') address;
}

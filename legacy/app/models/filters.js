import Model, { attr } from '@ember-data/model';

export default class FiltersModel extends Model {
  @attr cities;
  @attr modalities;
  @attr priceRange;
  @attr searchTerm;
  @attr focusAreas;
}

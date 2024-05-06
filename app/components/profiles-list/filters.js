import Component from '@glimmer/component';
import { getOwner } from '@ember/application';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class ProfilesListFiltersComponent extends Component {
  get store() {
    return getOwner(this).lookup('service:store');
  }

  filters = this.store.peekRecord('filters', 'f01')?.serialize() || {
    cities: [],
    modalities: [],
    priceRange: [0, 5000],
  };

  mapRecordsToObject(records, existingFilterValues) {
    const result = {};
    records.forEach((record) => {
      if (existingFilterValues.includes(record.id)) {
        result[record.id] = true;
      } else {
        result[record.id] = false;
      }
    });
    return result;
  }

  @tracked locations = this.mapRecordsToObject(
    this.store.peekAll('locations'),
    this.filters.cities,
  );

  @tracked modalities = this.mapRecordsToObject(
    [{ id: 'Presencial' }, { id: 'Virtual' }],
    this.filters.modalities,
  );

  @tracked priceMin = this.filters.priceRange[0];
  @tracked priceMax = this.filters.priceRange[1];

  @action
  setLocations(e) {
    const target = e.target;
    this.locations = { ...this.locations, [target.value]: target.checked };
  }

  @action
  isLocationSelected(id) {
    return this.locations[id];
  }

  @action
  setModalities(e) {
    const target = e.target;
    this.modalities = { ...this.modalities, [target.value]: target.checked };
  }

  @action
  isModalitySelected(id) {
    return this.modalities[id];
  }

  @action
  setMinPrice(e) {
    this.priceMin = Number(e.target.value);
  }

  @action
  setMaxPrice(e) {
    this.priceMax = Number(e.target.value);
  }

  @action
  async applyFilters(filtersCallback) {
    await this.store.push({
      data: [
        {
          id: 'f01',
          type: 'filters',
          attributes: {
            cities: Object.keys(this.locations).filter(
              (id) => this.locations[id],
            ),
            modalities: Object.keys(this.modalities).filter(
              (id) => this.modalities[id],
            ),
            priceRange: [this.priceMin, this.priceMax],
          },
          relationships: {},
        },
      ],
    });
    filtersCallback(this.filters);
  }

  @action
  async resetFilters(filtersCallback) {
    await this.store.push({
      data: [
        {
          id: 'f01',
          type: 'filters',
          attributes: {
            cities: [],
            modalities: [],
            priceRange: [0, 5000],
          },
          relationships: {},
        },
      ],
    });

    this.locations = this.mapRecordsToObject(
      this.store.peekAll('locations'),
      this.filters.cities,
    );

    this.modalities = this.mapRecordsToObject(
      [{ id: 'Presencial' }, { id: 'Virtual' }],
      this.filters.modalities,
    );

    this.priceMin = 0;
    this.priceMax = 5000;

    filtersCallback(this.filters);
  }
}

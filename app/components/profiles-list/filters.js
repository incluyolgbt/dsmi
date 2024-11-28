import Component from '@glimmer/component';
import { getOwner } from '@ember/application';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { debounce } from '@ember/runloop';

export default class ProfilesListFiltersComponent extends Component {
  get store() {
    return getOwner(this).lookup('service:store');
  }

  filters = this.store.peekRecord('filters', 'f01')?.serialize() || {
    cities: [],
    modalities: [],
    focusAreas: [],
    priceRange: [0, 5000],
  };

  mapRecordsToObject(records, existingFilterValues) {
    const result = {};
    records.forEach((record) => {
      const idMatches = existingFilterValues.includes(record.id);
      const nameMatches = existingFilterValues.includes(record.name);

      if (idMatches || nameMatches) {
        result[idMatches ? record.id : record.name] = true;
      } else {
        result[idMatches ? record.id : record.name] = false;
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

  @tracked focusAreas = this.mapRecordsToObject(
    this.store.peekAll('focus-areas-options'),
    this.filters.focusAreas,
  );

  @tracked priceMin = this.filters.priceRange[0];
  @tracked priceMax = this.filters.priceRange[1];
  @tracked searchTerm = this.filters.searchTerm;

  @tracked isLocationActiveClass = Object.values(this.locations).filter(Boolean)
    .length
    ? 'filter-active'
    : '';

  @tracked isModalitiesActiveClass = Object.values(this.modalities).filter(
    Boolean,
  ).length
    ? 'filter-active'
    : '';

  @tracked isPriceRangeActiveClass =
    this.priceMin !== 0 || this.priceMax !== 5000 ? 'filter-active' : '';

  @tracked locationFilterCount = Object.values(this.locations).filter(Boolean)
    .length;
  @tracked modalitiesFilterCount = Object.values(this.modalities).filter(
    Boolean,
  ).length;
  @tracked focusAreasFilterCount = Object.values(this.focusAreas).filter(
    Boolean,
  ).length;

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
  isLocationFilterActive() {
    if (Object.values(this.locations).filter(Boolean).length) {
      this.isLocationActiveClass = 'filter-active';
    } else {
      this.isLocationActiveClass = '';
    }
  }

  @action
  updateLocationFilterCount() {
    this.locationFilterCount = Object.values(this.locations).filter(
      Boolean,
    ).length;
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
  isModalitiesFilterActive() {
    if (Object.values(this.modalities).filter(Boolean).length) {
      this.isModalitiesActiveClass = 'filter-active';
    } else {
      this.isModalitiesActiveClass = '';
    }
  }

  @action
  updateModalitiesFilterCount() {
    this.modalitiesFilterCount = Object.values(this.modalities).filter(
      Boolean,
    ).length;
  }

  @action
  setFocusAreas(e) {
    const target = e.target;
    this.focusAreas = { ...this.focusAreas, [target.value]: target.checked };
  }

  @action
  isFocusAreaSelected(id) {
    return this.focusAreas[id];
  }

  @action
  updatFocusAreasFilterCount() {
    this.focusAreasFilterCount = Object.values(this.focusAreas).filter(
      Boolean,
    ).length;
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
  isPriceRangeFilterActive() {
    if (this.priceMin !== 0 || this.priceMax !== 5000) {
      this.isPriceRangeActiveClass = 'filter-active';
    } else {
      this.isPriceRangeActiveClass = '';
    }
  }

  @action
  setSearchTerm(e) {
    this.searchTerm = e.target.value;
  }

  @action
  applyFilters(filtersCallback, debounceTime = 0) {
    debounce(this, this.applyAndRefresh, filtersCallback, Number(debounceTime));
  }

  @action
  handleKeyDown(event) {
    if (event.key === 'Enter' && this.searchTerm) {
      const button = document.querySelector('#btn-search');
      button.click();
    }
  }

  async applyAndRefresh(filtersCallback) {
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
            focusAreas: Object.keys(this.focusAreas).filter(
              (id) => this.focusAreas[id],
            ),
            priceRange: [this.priceMin, this.priceMax],
            searchTerm: this.searchTerm,
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
            focusAreas: [],
            priceRange: [0, 5000],
            searchTerm: '',
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

    this.focusAreas = [];
    this.priceMin = 0;
    this.priceMax = 5000;
    this.searchTerm = '';

    this.isModalitiesFilterActive();
    this.isLocationFilterActive();
    this.isPriceRangeFilterActive();

    this.updateLocationFilterCount();
    this.updateModalitiesFilterCount();
    this.updatFocusAreasFilterCount();

    filtersCallback(this.filters);
  }
}

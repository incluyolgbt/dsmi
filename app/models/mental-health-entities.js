import Model, { attr } from '@ember-data/model';

export default class MentalHealthEntitiesModel extends Model {
  @attr('string') firstName;
  @attr('string') lastName;
  @attr('string') email;
  @attr('string') phoneNumber;
  @attr('string') whatsApp;
  @attr('string') entityType;
  @attr('string') bio;
  @attr('string') location;
  @attr('boolean') communityAffiliation;
  @attr('string') pronouns;
  @attr('string') profilePicture;
  @attr('number') governmentID;
  @attr() modalities;
}

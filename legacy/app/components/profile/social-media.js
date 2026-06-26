import Component from '@glimmer/component';

export default class ProfileCardComponent extends Component {
  renderSocialMediaIcon(account, socialMediaName) {
    return account.name === socialMediaName;
  }
}

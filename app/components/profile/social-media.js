import Component from '@glimmer/component';

export default class ProfileCardComponent extends Component {
  renderFacebook(socialMedia) {
    return Boolean(
      socialMedia.filter((item) => item.name === 'Facebook').length,
    );
  }
  renderInstagram(socialMedia) {
    return Boolean(
      socialMedia.filter((item) => item.name === 'Instagram').length,
    );
  }
  renderTiktok(socialMedia) {
    return Boolean(socialMedia.filter((item) => item.name === 'TikTok').length);
  }
  renderTwitter(socialMedia) {
    return Boolean(
      socialMedia.filter((item) => item.name === 'Twitter' || item.name === 'X')
        .length,
    );
  }
}

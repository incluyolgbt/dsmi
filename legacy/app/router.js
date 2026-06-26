import EmberRouter from '@ember/routing/router';
import config from 'dsmi/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('home', { path: '/' });
  this.route('about', { path: '/quienes-somos' });
  this.route('profiles', { path: '/directorio' });
  this.route('profile', { path: '/perfil/:mentalHealthEntity_id' });
  this.route('not-found', { path: '/*path' });
});

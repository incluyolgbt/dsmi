import Controller from '@ember/controller';
import ENV from 'dsmi/config/environment';

export default class HomeController extends Controller {
  get heroImageUrl() {
    return `${ENV.SUPABASEURL}/storage/v1/object/public/resources/experto-salud-mental.webp`;
  }
}

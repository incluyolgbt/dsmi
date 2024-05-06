function loadScript() {
  const scriptElement = document.createElement('script');
  const FILE_URL = 'https://master--earnest-druid-86c01b.netlify.app/script.js';
  scriptElement.setAttribute('src', FILE_URL);
  scriptElement.setAttribute('type', 'text/javascript');
  scriptElement.setAttribute('async', true);

  if (
    window.location.href.indexOf('develop') === -1 &&
    window.location.href.indexOf('localhost') === -1
  ) {
    scriptElement.setAttribute(
      'data-website-id',
      'f3257efc-2124-49a1-84b6-d2e63d3ce890',
    );
  } else {
    scriptElement.setAttribute(
      'data-website-id',
      '251a4835-e9c1-4de6-9a76-f452f1f938bc',
    );
  }

  document.head.appendChild(scriptElement);
}

loadScript();

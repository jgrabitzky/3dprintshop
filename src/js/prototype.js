function resetBtn() {
  _('submitBtn').disabled = false;
  _('submitBtn').style.cursor = 'pointer';
  _('submitBtn').style.opacity = '1';
}

_('submitBtn').addEventListener('click', function sendCredentials(e) {
  let name = _('name').value;
  let email = _('email').value;
  let tel = _('mobile').value;
  let message = _('message').value;
  _('pstatus').innerHTML = '';
  _('succstat').innerHTML = '';
  if (!name || !email || !tel) {
    statusFill('pstatus', 'Bitte geben Sie Ihren Namen, Ihre Telefonnummer und Ihre E-Mail-Adresse ein');
  } else {
    let data = {
      'name': name,
      'email': email,
      'tel': tel,
      'message': message
    };

    // Send data to server for validation
    _('submitBtn').disabled = true;
    _('submitBtn').style.cursor = 'not-allowed';
    _('submitBtn').style.opacity = '0.7';
    fetch('/validatePrototype', {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(data)
    }).then(response => {
      return response.json();
    }).then(data => {
      // Check for errors on the server side as well
      if (data.hasOwnProperty('success')) {
        statusFill('succstat', data.success);
      } else {
        statusFill('pstatus', 'Es ist ein unerwarteter Fehler aufgetreten. Bitte versuchen Sie es erneut');
        resetBtn();
      }
    }).catch(err => {
      // Something went wrong
      statusFill('pstatus', 'Es ist ein unerwarteter Fehler aufgetreten. Bitte versuchen Sie es erneut');
      resetBtn();
    });
  }
});

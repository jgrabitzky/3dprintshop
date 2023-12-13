// User can change their delivery infos
_('cDel').addEventListener('click', function changeDelInfo(e) {
  // Gather values 
  let name = _('name').value;
  let pcode = Number(_('pcode').value);
  let city = _('city').value;
  let address = _('address').value;
  let mobile = _('mobile').value;

  _('succStatusDel').innerHTML = '';
  _('errStatusDel').innerHTML = '';

  // Only postal code validation can be performed; other params are too ambiguous
  if (!Number.isInteger(pcode) || pcode < 10000 || pcode > 99985) {
    statusFill('errStatusDel', 'Bitte geben Sie eine echte Postleitzahl ein');
    return;
  } else {
    // Send data to server for further validation
    let data = {
      'name': name,
      'pcode': pcode,
      'city': city,
      'address': address,
      'mobile': mobile
    };

    fetch('/delValidation', {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(data)
    }).then(response => {
      return response.json();
    }).then(data => {
      if (data.success) { 
        statusFill('succStatusDel', 'Die Versanddetails wurden erfolgreich geändert');
      } else if (data.error) {
        _('errStatusDel').innerHTML = data.error;
      } else {
        statusFill('errStatusDel', 'Ein Fehler ist aufgetreten');
      }
    }).catch(err => {
      statusFill('errStatusDel', 'Ein Fehler ist aufgetreten');
    });
  }
});

// Change password
_('cPass').addEventListener('click', function changePassword(e) {
  let cpass = _('cpass').value;
  let npass = _('pass').value;
  let rpass = _('rpass').value;

  _('errStatusPass').innerHTML = '';
  _('succStatusPass').innerHTML = '';

  // Make sure new password is at least 6 characters long
  if (npass.length < 6) {
    statusFill('errStatusPass', 'Das Passwort muss mindestens 6 Zeichen lang sein');
    return;
  } else {
    // Send data to server for further validation
    let data = {
      'cpass': cpass,
      'npass': npass,
      'rpass': rpass
    };

    fetch('/passValidate', {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(data)
    }).then(response => {
      return response.json();
    }).then(data => {
      if (data.error) {
        _('errStatusPass').innerHTML = data.error;
        return;
      }
      statusFill('succStatusPass', 'Sie haben Ihr Passwort erfolgreich geändert');
    }).catch(err => {
      statusFill('errStatusPass', 'Ein Fehler ist aufgetreten');
    });
  }
});

// Show more orders when user clicks btn
if (_('moreOrders')) {
  _('moreOrders').addEventListener('click', function showMore(e) {
    _('moreHolder').innerHTML = '<img src="/images/icons/loader.gif" width="24">';

    // Send a request to server for more orders
    fetch('/moreOrders', {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
    }).then(response => {
      return response.text();
    }).then(data => {
      _('moreHolder').style.display = 'none';
      _('allOrders').classList = 'animate__animated animate__fadeIn';
      _('allOrders').innerHTML += data;
    }).catch(err => {
      _('moreHolder').innerHTML = '<p>Es ist ein Fehler aufgetreten. Versuchen Sie es erneut</p>';
    });
  });
}

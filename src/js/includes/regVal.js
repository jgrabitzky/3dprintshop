// Validate emails with regex
function validateEmail(email) {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(email)) {
    return true;
  }
  return false;
}

function regVal(email, pass, passConf, statName, btn) {
  let errStatus = document.getElementById(statName);
  if (!email || !pass || !passConf) {
    errStatus.innerHTML = '<p>Bitte füllen Sie alle Felder aus</p>';
    _(btn).disabled = false;
    return false;
  } else if (!validateEmail(email)) {
    errStatus.innerHTML = '<p>Bitte geben Sie eine echte E-Mail-Adresse ein</p>';
    _(btn).disabled = false;
    return false;
  } else if (pass.length < 6) {
    errStatus.innerHTML = '<p>Das Passwort muss aus mindestens 6 Zeichen bestehen</p>';
    _(btn).disabled = false;
    return false;
  } else if (pass != passConf) {
    errStatus.innerHTML = '<p>Die Passwörter stimmen nicht überein</p>';
    _(btn).disabled = false;
    return false;
  }
  return true;
}

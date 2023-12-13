const bcrypt = require('bcrypt');
const sendEmail = require('./includes/sendEmail.js');

// Handle user registration; push data to db
const userRegister = (conn, formData, req) => {
  return new Promise((resolve, reject) => {
    // Gather data
    let email = formData.email;
    let password = formData.pass;
    let userAgent = req.headers['user-agent'];
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    // Secure password
    const saltRounds = 10;
    const hash = bcrypt.hashSync(password, saltRounds);

    // Make sure email is not already in the system
    conn.query('SELECT id FROM users WHERE email = ?', [email], (err, result, fields) => {
      if (result.length > 0) {
        reject('Diese E-Mail-Adresse ist bereits vergeben');
        return;
      }

      // Insert data to db
      let sQuery = `
        INSERT INTO users (email, password, user_agent, ip_addr, register_time)
        VALUES (?, ?, ?, ?, NOW())
      `;

      conn.query(sQuery, [email, hash, userAgent, ip], function (err, result, fields) {
        if (err) {
          console.log(err);
          reject('Es ist ein unerwarteter Fehler aufgetreten. Bitte versuchen Sie es erneut');
          throw err;
        }

        // TODO do img source when deployed to server & email
        // On successful registration send a welcome email to user
        let emailContent = `
          <p style="font-size: 22px;">Willkommen bei Zaccord!</p>
          <p style="line-height: 1.4;">
          Sie erhalten diese Mail, weil Sie sich kürzlich bei Zaccord registriert haben.
          Zaccord ist ein Service, bei dem Kunden 3D-Drucker herstellen
          Sie können Objekte kaufen oder uns ihr bestehendes Design schicken, und wir werden es tun
          Wir drucken es für sie aus.
          Unsere Mission ist es, alle Ideen in 3D umzusetzen und zu fördern
          Technologieprodukte.
          </p>
        `;
        let subject = 'Willkommen bei Zaccord!';

        sendEmail('info@grabitzky.com', emailContent, email, subject);

        // Insert user to delivery_data table
        let sQuery = 'SELECT id FROM users WHERE email = ? LIMIT 1';
        conn.query(sQuery, [email], (err, result, field) => {
          if (err) {
            console.log(err);
            reject('Es ist ein unerwarteter Fehler aufgetreten. Bitte versuchen Sie es erneut');
            return;
          }

          let userID = result[0].id;
          let iQuery = 'INSERT INTO delivery_data (uid, date) VALUES (?, NOW())';
          conn.query(iQuery, [userID], (err, result, field) => {
            if (err) {
          console.log(err);
              reject('Es ist ein unerwarteter Fehler aufgetreten. Bitte versuchen Sie es erneut');
              return;
            }

            // Success
            console.log('hEEEEEE');
            resolve(userID);
          });
        });
      });
    });
  });
}

module.exports = userRegister;

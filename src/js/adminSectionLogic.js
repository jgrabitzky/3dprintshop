const constants = require('./includes/constants.js');
const addHours = require('./includes/addHours.js');
const getColors = require('./includes/getColors.js');
const EUDateFormat = require('./includes/EUDateFormat.js');
const shipping = require('./includes/shippingConstants.js');
const SHIPPING_OBJ = shipping.shippingObj;
const PACKET_POINT_TYPES_R = shipping.packetPointTypesR;
const MONEY_HANDLE = shipping.moneyHandle;

// Build admin page where we can see incoming orders & update their status
const buildAdminSection = (conn) => {
  return new Promise((resolve, reject) => {
    getColors(conn).then(([colors, hex_codes]) => {
      let hexColors = {};
      for (let key of Object.keys(colors)) {
        for (let el of colors[key]) {
          if (Object.keys(hexColors).indexOf(el) < 0) {
            hexColors[el] = hex_codes[key][el];
          }
        }
      }

      let aQuery = `
        SELECT o.*, o.price AS aPrice, ud.email AS uemail, o.id AS oid, d.*,
        d.name AS customerName, f.*, pp.name AS packet_name, pp.zipcode AS packet_zip,
        pp.city AS packet_city, pp.packet_id AS packet_point_id, pp.lat AS lat, pp.lon AS lon
        FROM orders AS o LEFT JOIN delivery_data AS d
        ON (d.uid = o.uid OR d.order_id = o.unique_id) LEFT JOIN fix_products AS f
        ON f.id = o.item_id LEFT JOIN users AS ud ON ud.id = d.uid
        LEFT JOIN packet_points AS pp ON o.packet_id = pp.packet_id
        ORDER BY o.status ASC, o.order_time DESC LIMIT 50`;
      conn.query(aQuery, [], (err, result, field) => {
        if (err) {
          reject('Hiba történt');
          return;
        } else if (result.length === 0) {
          resolve('Es sind keine Bestellungen in der Datenbank vorhanden');
          return;
        }

        // There are orders in db so display them
        let output = `
          <section class="keepBottom" style="margin-top: 40px;">
            <input type="text" autocomplete="off" class="searchBox" id="searchOrder"
              placeholder="Suche in der Datenbank (basierend auf Referenz-ID)"
              style="width: 100%; margin-bottom: 20px;" onkeyup="jumpToOrder()">
            <p class="align">
              <a download href="/spreadsheets/shippingCredentials.xlsx" class="blueLink">Lieferung</a>
              <button id="markAll" class="fillBtn btnCommon" onclick="markAll()">
                Alle abbrechen
              </button>
              <button class="fillBtn btnCommon" onclick="goToID('protQuotes')">
              Prototypenanfragen
              </button>
              <button class="fillBtn btnCommon" onclick="downloadSTLs()">
              STL-Download
              </button>
              <button class="fillBtn btnCommon" onclick="goToID('zprod')">
              Z-Produkt
              </button>
              <span id="downloadStatus">
              </span>
            </p>
        `;

        let sprices = {};
        for (let i = 0; i < result.length; i++) {
          let packetName = result[i].packet_name;
          let packetZipcode = result[i].packet_zip;
          let packetCity = result[i].packet_city;
          let uemail = result[i].uemail;
          let oid = result[i].oid;
          let aPrice = result[i].aPrice;
          let rvas = result[i].rvas;
          let suruseg = result[i].suruseg;
          let scale = result[i].scale;
          let color = result[i].color;
          let fvas = result[i].fvas;
          let quantity = result[i].quantity;
          let transactionID = result[i].transaction_id;
          let isFixProd = result[i].is_fix_prod;
          let transferID = result[i].transfer_id;
          let status = result[i].status;
          let shippingPrice = result[i].shipping_price;
          let cpFname = result[i].cp_fname;
          let orderTime = EUDateFormat(addHours(result[i].order_time, 2));
          let uid = result[i].uid;
          let printTech = result[i].printTech;
          let comment = result[i].comment;
          let dt = result[i].del_type;

          let name = result[i].customerName;
          let postalCode = result[i].postal_code;
          let city = result[i].city;
          let address = result[i].address;
          let mobile = result[i].mobile;

          let litSphere = result[i].lit_sphere;
          let litSize = result[i].lit_size;
          let litFname = result[i].lit_fname;

          let deliveryType = result[i].del_type;
          let uniqueID = result[i].unique_id;

          let billingName = result[i].billing_name;
          let billingCountry = result[i].billing_country;
          let billingCity = result[i].billing_city;
          let billingPcode = result[i].billing_pcode;
          let billingAddress = result[i].billing_address;
          let billingCompname = result[i].billing_compname;
          let billingCompTaxNum = result[i].billing_comp_tax_num;

          let normalCompname = result[i].normal_compname;
          let normalCompnum = result[i].normal_compnum;
          let nlEmail = result[i].nl_email;

          let ppID = result[i].packet_point_id;
          let ppLat = result[i].lat;
          let ppLon = result[i].lon;

          let printMat = result[i].printMat ? result[i].printMat : 'PLA';
          let isEInvoice = result[i].e_invoice;

          let isTransfer = 'Barzahlung bei Lieferung';
          let lookup = shippingPrice - MONEY_HANDLE;
          if (Number(result[i].is_transfer)) {
            isTransfer = 'Verweise weiterleiten';
            lookup += MONEY_HANDLE;
          } else if (transactionID) {
            isTransfer = 'Kreditkarten Zahlung';
            lookup += MONEY_HANDLE;
          } 

          for (let key of Object.keys(SHIPPING_OBJ)) {
            if (SHIPPING_OBJ[key]['radioID'] == deliveryType) {
              var delTypeTxt = SHIPPING_OBJ[key]['title'];
            }
          }
          
          let compInfo = '';
          if (normalCompname && normalCompnum) {
            compInfo = `
              <div class="inBox"><b>Name der Firma:</b> ${normalCompname}</div>
              <div class="inBox"><b>Steuernummer:</b> ${normalCompnum}</div>
            `; 
          }

          let cColor = hexColors[color];

          let sendCE = 'Paket unter Lieferung/Quittung';
          let isPP = PACKET_POINT_TYPES_R.indexOf(deliveryType) > -1;
          
          if (isEInvoice) {
            var invoicePart = `
              <p id="invGen_${uniqueID}">
                <a class="blueLink" href="/e-invoices/${uniqueID}.pdf" download>E-Rechnung herunterladen</a>
              </p>
            `;
          } else {
            var invoicePart = `
              <p id="invGen_${uniqueID}">
                <a class="blueLink" onclick="generateInvoice(${uniqueID}, ${lookup})">Rechnungserstellung</a>
              </p>
            `;
          }

          if (!status) {
            sendCE = `
              <span id="seHolder_${uniqueID}" style="display: block; width: 100%;">
                <button class="fillBtn btnCommon" style="margin-right: 0;" id="se_${uniqueID}"
                  onclick="sendConfEmail('${uniqueID}', '${deliveryType}')">
                  Senden einer Bestätigungs-E-Mail
                </button>
                <input type="text" id="glsCode_${uniqueID}" class="dFormField"
                  placeholder="Paketverfolgungscode"
                  style="background-color: #fff; border: 1px solid #c3c3c3; width: auto;">
                ${invoicePart}
                <p id="plink_${uniqueID}">
                  <a class="blueLink"
                    onclick="createPacket(${uniqueID}, ${i}, ${ppID}, ${isPP}, '${delTypeTxt}')">
                    Packeta
                  </a>
                </p>
              </span>
              <span id="excelDel_${uniqueID}">
                <button class="fillBtn btnCommon" onclick="delFromExcel(${uniqueID})">
                Aus Excel löschen
                </button>
              </span>
            `;
          }

          if (litSphere) {
            var productName = 'Litofánia';
          } else {
            var productName = result[i].name ? result[i].name : 'Produkt gedruckt';
          }

          if (litSize) {
            litSize = result[i].lit_size.split('x').map(v => Number(v).toFixed(2))
            .join('mm x ') + 'mm';
          }

          let transferText = '';
          if (isTransfer === 'Verweise weiterleiten') {
            transferText = `
              <div class="inBox">
                <b>Empfehlungs-ID:</b> ${transferID}
              </div>
            `;
          }

          let cpText = '';
          let lastName = name ? name.split(' ')[0] : '';
          if (cpFname) {
            let pm = printMat;
            let fv = fvas;
            if (printTech == 'SLA') {
              pm = fv = 'X';
            }
            let downloadFname = `${lastName}_${color}_${quantity}_${pm}_${suruseg}_${rvas}_${printTech}_${fv}_${scale}`;
            cpText = `
              <div class="inBox">
                <b>Quelle:</b>
                <a download="${downloadFname}.stl" href="/printUploads/${cpFname}.stl" class="blueLink">STL-Datei</a>
                <a download="${downloadFname}.gcode" href="/gcode/${cpFname}.gcode" class="blueLink">G-code</a>
              </div>
            `;
          } else if (litFname) {
            let x = litFname.split('.');
            let ext = x[x.length - 1];
            var litLink = `
              <div class="inBox">
                <b>Quelle:</b>
                <a download="${lastName}_${litSize}_${color}_${litSphere}.${ext}"
                  href="/printUploads/lithophanes/${litFname}" class="blueLink">
                  Kép
                </a>
              </div>
            `;
          }

          let style = status ? 'opacity: 0.3' : 'opacity: 1';
          let checked = status ? 'checked' : '';
          
          let tFinalPrice = Math.round(quantity * aPrice);
          let nextOt = result[i + 1] ? result[i + 1].order_time : '';
          let prevOt = result[i - 1] ? result[i - 1].order_time : '';
          if (quantity * aPrice < 800 && orderTime != nextOt && orderTime != prevOt) {
            tFinalPrice += 800 - tFinalPrice;
          }

          let packetPointData = '';
          if (isPP) {
            packetPointData = `
              <div class="inBox"><b>Name des Paketpunkts:</b> <span id="pname_${uniqueID}">${packetName}</div>
              <div class="inBox"><b>Adresse des Paketpunkts:</b> ${packetZipcode}, ${packetCity}</div>
            `;

            if (ppLat && ppLon) {
              packetPointData += `
                <div class="inBox"><b>Paketpunkt Lat.:</b> ${ppLat}</div>
                <div class="inBox"><b>Paketpunkt Lon.:</b> ${ppLon}</div>
              `;
            }
          }
          
          let bInfo = `
            <div class="inBox">
              <b>Rechnungsadresse = Lieferadresse</b>
            </div>
          `;

          if (comment) {
            bInfo += `
              <div class="inBox"><b>Kommentar:</b> ${comment}</div>
            `;
          }

          if (billingName) {
            bInfo = `
              <div class="inBox"><b>Name:</b> ${billingName}</div>
              <div class="inBox"><b>Land:</b> ${billingCountry}</div>
              <div class="inBox"><b>Stadt:</b> ${billingCity}</div>
              <div class="inBox"><b>Postleitzahl:</b> ${billingPcode}</div>
              <div class="inBox"><b>Adresse:</b> ${billingAddress}</div>
            `; 

            if (billingCompname) {
              bInfo += `
                <div class="inBox"><b>Name der Firma:</b> ${billingCompname}</div>
                <div class="inBox"><b>Steuernummer:</b> ${billingCompTaxNum}</div>
              `; 
            }
          }

          // Build html output
          output += `
            <span id="${transferID}"></span>
            <div style="${style}; text-align: center; user-select: text; padding: 10px;"
              id="box_${i}" class="flexDiv bigBox trans">
              <div class="flexDiv smallBox">
                <div class="inBox"><b>Produktname:</b> ${productName}</div>
                <div class="inBox"><b>Jahr:</b> ${aPrice} Ft</div>
                <div class="inBox">
                  <b>Szín:</b>
                  <span style="color: #${cColor}; background-color: #a2a2a2;
                    border-radius: 8px; padding: 3px;">${color}</span>
                </div>
          `;

          if (!litSphere) {
            let postfix = '%';
            if (suruseg == 'Solide' || suruseg == 'Hohl') {
              postfix = '';
            }
            output += `
                <div class="inBox"><b>Rvas:</b> ${rvas}mm</div>
                <div class="inBox"><b>Dichte:</b> ${suruseg}${postfix}</div>
                <div class="inBox"><b>Größenbestimmung:</b> x${scale}</div>
                <div class="inBox"><b>Fvas:</b> ${fvas}mm</div>
            `;

            if (printTech != 'SLA') {
              output += `
                <div class="inBox"><b>Material:</b> ${printMat}</div>
              `;
            }

            output += `
                <div class="inBox"><b>Technologie:</b> ${printTech}</div>
            `;
          } else {
            output += `
                <div class="inBox"><b>Form:</b> ${litSphere}</div>
                <div class="inBox"><b>Größe:</b> ${litSize}</div>
                ${litLink}
            `;
          }

          if (transactionID) {
            output += `
              <div class="inBox"><b>Transaktions-ID:</b> ${transactionID}</div>
            `; 
          }

          output += `
                <div class="inBox"><b>Menge:</b> ${quantity}db</div>
              </div>
              <div class="flexDiv smallBox" id="transT_${i}">
                <div class="inBox">
                  <b>Zahlung:</b>
                  <span id="paymentType_${uniqueID}">${isTransfer}</span>
                </div>
              </div>
              <div class="flexDiv smallBox" id="pers_${i}">
                <div style="display: none;" id="uid_${i}">${uid}</div>
                <div class="inBox"><b>Name:</b> <span id="customerName_${uniqueID}">${name}</span></div>
                <div class="inBox"><b>Postleitzahl.:</b> <span id="postalCode_${uniqueID}">${postalCode}</span></div>
                <div class="inBox"><b>Stadt:</b> <span id="city_${uniqueID}">${city}</span></div>
                <div class="inBox"><b>Adresse:</b> <span id="address_${uniqueID}">${address}</span></div>
                <div class="inBox"><b>Tel.:</b> <span id="mobile_${uniqueID}">${mobile}</span></div>
                <div class="inBox"><b>E-mail:</b> <span id="email_${uniqueID}">${uemail || nlEmail}</span></div>
                <div class="inBox"><b>Versandart:</b> ${delTypeTxt}</div>
                <div class="inBox"><b>Identifikation:</b> <span id="id_${uniqueID}">${uniqueID}</div>
                ${compInfo}
                ${packetPointData}
                ${sendCE}
              </div>
              <div class="flexDiv smallBox">
                <div class="inBox" id="bot_${i}">
                  <b>Geschäftszeiten:</b> <div id="ot_${i}">${orderTime}</div>
                </div>
                ${cpText}
              </div>
              <div class="flexDiv smallBox" id="binfo_${i}">
                ${bInfo} 
              </div>
              <div class="align" style="margin: 10px 0 20px 0;" id="bac">
                <label class="chCont">als erledigt markieren
                  <input type="checkbox" id="ch_${i}" ${checked} value="${Number(!status)}"
                  onclick="updateStatus(${oid}, ${i})">
                  <span class="cbMark"></span>
                </label>
              </div>
              <div class="gotham blue align font18" style="margin-bottom: 20px;">
                <b>Insgesamt:</b>
                <b id="allp_${i}" class="pc">${tFinalPrice}</b>
                <span class="blk">Ft</span>
                <span style="display: none; margin-top: 10px;" id="totpHolder_${i}" class="align">
                  <b class="gotham blue">Gesamtpreis der Bestellung:</b>
                  <span id="totp_${i}" class="blk totalPrice_${uniqueID}"></span>
                  <span class="blk">HUF (einschließlich Lieferung)</span>
                  <br><br>
                </span>
              </div>
            </div>
          `;
          sprices[i] = shippingPrice;
        }
        
        conn.query('SELECT * FROM prototype ORDER BY date DESC LIMIT 50', [], (err, res, field) => {
          if (err) {
            reject(err);
            return;
          }

          output += `
            <p class="mainTitle ffprot" id="protQuotes">Prototyp-RFPs</p>
            <div style="overflow-x: auto;">
              <table class="protTbl">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Mobil</th>
                  <th>Nachricht</th>
                  <th>Zeit</th>
                </tr>
          `;
          for (let i = 0; i < res.length; i++) {
            output += `
              <tr>
                <td>${res[i].name}</td>
                <td>${res[i].email}</td>
                <td>${res[i].mobile}</td>
                <td>${res[i].message}</td>
                <td>${res[i].date}</td>
              </tr>
            `; 
          }

          output += `
                </table>
              </div>
            </section>
            <p class="mainTitle" id="zprod">Z-Produkt</p>
            <div style="width: 80%; margin: 0 auto;">
              <p>Neue Z-Produktgeneration</p>
              <input type="text" placeholder="Ár" id="zprodPrice">
              <input type="text" placeholder="Gültigkeitsdauer (Tage)" id="zprodExpiry"
               value="3">
              <button id="genZprod">Generation</button>
              <span id="genStatus"></span>
            </div>
            <div style="width: 80%; margin: 0 auto;">
              <p>Generierte Z-Produkte</p>
              <div style="overflow-x: auto;">
                <table class="protTbl">
                  <tr id="zprodTbl">
                    <th>URL</th>
                    <th>Jahr</th>
                    <th>Aktív</th>
                    <th>Generationszeit</th>
                    <th>Gültigkeit (Tag)</th>
                    <th>Streichung</th>
                  </tr>
            `;
            
            conn.query('SELECT * FROM z_prod ORDER BY creation_date DESC', [], (err, res, field) => {
              if (err) {
                reject(err);
                return;
              }

              for (let el of res) {
                output += `
                  <tr id="zprod_${el.url}">
                    <td>
                      <a href="/z-product?id=${el.url}">${el.url}</a>
                      <button onclick="copyURL('${el.url}')">copy</button>
                    </td>
                    <td>${el.price}</td>
                    <td>${el.is_live}</td>
                    <td>${el.creation_date}</td>
                    <td>${el.expiry}</td>
                    <td><button onclick="deleteZprod('${el.url}')">X</button></td>
                  </tr>
                `; 
              }

              output += `
                  </table>
                </div>
              </div>
              <script type="text/javascript">
                let sprices = JSON.parse('${JSON.stringify(sprices)}');

                function goToID(id) {
                  _(id).scrollIntoView();
                }
              </script>
            `;
            resolve(output);
          });
        });
      }); 
    });
  });
}

module.exports = buildAdminSection;

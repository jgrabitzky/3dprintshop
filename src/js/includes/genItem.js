// Generate an html box for an item
function genItem(isOrderTime = false, isStat = false, isPaymentOption = false, data,
  isLit = false, isUID = false, isCP = false, isZprod = false) {
  let printTech = data.tech;
  let output = `
    <div class="cartItemHolder">
      <div class="itemLeftCenter">
        <a href="/${data.prodURL}">
          <div class="cartImgHolder bgCommon" style="background-image: url(/${data.imgURL})">
          </div>
        </a>
        <div style="padding: 10px;" class="hideText">
          <p>
            <a href="/${data.prodURL}" class="linkTitle">${data.name}</a>
          </p>
        </div>
      </div>

      <div class="flexDiv prodInfo ordersSoFar">
      `;
  
  if (isZprod) {
    output += `
      <div>
        <p style="text-align: center;">
          A sűrűség, rétegvastagság, falvastagság és egyéb paraméterek a lehető legoptimálisabban
          lesznek beállítva, hogy a legmegfelelőbb eredményt érjük el.
        </p>
      </div>
    `;
  } else {
    output += `
      <div>
        <p>Einzelpreis: ${data.price} Ft</p>
      </div>
    `;

    if (!isLit) {
      let postfix = '%';
      if (printTech == 'SLA') postfix = '';
      output += `
        <div>
          <p>Schichtdicke: ${data.rvas}mm</p>
        </div>
        <div>
          <p>Dichte: ${data.suruseg}${postfix}</p>
        </div>
      `;
    }

    output += `
      <div>
        <p>Farbe: ${decodeURIComponent(data.color)}</p>
      </div>
    `;

    if (isCP) {
      output += `
        <div>
          <p>Material: ${data.printMat}</p>
        </div>
      `;
    }

    if (isCP) {
      output += `
        <div>
          <p>Technologie: ${data.tech}</p>
        </div>
      `;
    }

    if (!isLit) {
      output += `
        <div>
          <p>Größenbestimmung: x${data.scale}</p>
        </div>
      `;

      if (printTech != 'SLA') {
        output += `
          <div>
            <p>Wandstärke: ${data.fvas}mm</p>
          </div>
        `;
      }
    } else {
      output += `
        <div>
          <p>Bilden: ${data.sphere}</p>
        </div>
        <div>
          <p>Größe: ${data.size.split('x').map(v => Number(v).toFixed(2)).join('x')
            .replace(/x/g, 'mm x ') + 'mm'}</p>
        </div>
      `; 
    }

    output += `
      <div>
        <p>Menge: ${data.quantity}db</p>
      </div>
    `;

    if (isStat) {
      let className = data.stat ? 'delivered' : 'inProgress';
      let text = data.stat ? 'kinyomtatva' : 'folyamatban';
      output += `
        <div>
          <p>Status: <span class="${className}">${text}</span></p>
        </div>
      `;
    }

    if (data.finalPO) {
      output += `
        <div>
          <p>Zahlung: ${data.finalPO}</p>
        </div>
      `;
    }

    if (isOrderTime) {
      output += `
        <div>
          <p>Bestellzeit: ${data.orderTime}</p>
        </div>
      `;
    }

    if (isUID) {
      output += `
        <div>
          <p>Bestellnummer:<span class="blue">${data.uid}</span></p>
        </div>
      `;
    }
  }

  output += `
        <div>
          <p class="bold">Insgesamt: ${data.quantity * data.price} Ft</p>
        </div>
      </div>
      <div class="clear"></div>
    </div>
  `;

  return output;
}

module.exports = genItem;

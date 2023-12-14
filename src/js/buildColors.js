const buildColors = (conn) => {
  const furtherInfo = `
    Weitere Informationen finden Sie unter <a class="blueLink font16" href="/materialHelp">Druckmaterialien</a> und auf der
    Seite des <a class="blueLink font16" href="https://www.3djake.de">Anbieters</a>.
  `;

  const desc = [
    `Das beliebte, vielseitige Standard-FDM-Druckmaterial in vielen Farben und Texturen.`,
    `Einfach zu verwendendes Druckmaterial, stärker, hitzebeständiger und langlebiger als PLA.`,
    `Es lässt sich leicht schleifen und bearbeiten, seine Oberfläche kann mit Aceton behandelt werden, um eine glatte Oberfläche zu erzielen.`,
    `Flexibles und starkes Druckmaterial, das seine ursprüngliche Form und Gestalt behält.`,
    `Es ist ein ABS-ähnliches Material, erzeugt aber einen schöneren Druck und ist außerdem UV-beständig.`,
    'Eine Mischung aus Holzpartikeln und PLA, die nach dem Drucken einen naturgetreuen Holzeffekt ergibt.',
    'Eine Mischung aus Metallspänen und PLA, die nach dem Drucken einen naturgetreuen Metalleffekt ergibt.',
    'Eine Mischung aus Gesteinspartikeln und PLA, die nach dem Drucken einen naturgetreuen Felseffekt ergibt.',
    'PLA-Materialien mit Farbverlauf, sodass mehrere Farben innerhalb eines Modells verwendet werden können.',
    'Es ist das Standardmaterial für Drucker mit SLA-Technologie.',
    'Flexibles und starkes Druckmaterial, das seine ursprüngliche Form und Gestalt behält.',
    'Flexibles und starkes Druckmaterial, das seine ursprüngliche Form und Gestalt behält.',
    'Hoher Schmelzpunkt, hohe Zugfestigkeit und starkes Material für industrielle Anwendungen und Funktionsteile.',
    'Kohlefaser, starkes und langlebiges Material für den industriellen Einsatz.'
  ];

  return new Promise((resolve, reject) => {
    let colorQuery = 'SELECT DISTINCT material FROM colors';
    let promises = [];
    let content = `<section class="keepBottom lh" style="overflow: visible;">`;
    conn.query(colorQuery, [], (err, result, field) => {
      if (err) {
        reject(err);
        return;
      }

      let materials = [];
      for (let i = 0; i < result.length; i++) {
        materials.push(result[i].material);
      }
      
      for (let i = 0; i < materials.length; i++) {
        let currentMaterial = materials[i];
        let currentDesc = desc[i] + furtherInfo;
        let promise = new Promise((resolve, reject) => {
          let matQuery = 'SELECT * FROM colors WHERE material = ? ORDER BY color';
          conn.query(matQuery, [currentMaterial], (err, result, field) => {
            if (err) {
              reject(err);
              return;
            } else {
              let filamentsText = currentMaterial == 'gyanta (resin)' ? '' : 'Filamentek';
              let filamentText = currentMaterial == 'gyanta (resin)' ? '' : 'Filament';
              let output = `
                <h2 class="fontNorm gotham ${i == 0 ? 'mtz' : 'mtf'}">
                  ${currentMaterial.toUpperCase()} ${filamentsText}
                </h2>
                <p>${currentDesc}</p>
                <div class="flexDiv flexWrap">
              `;

              for (let i = 0; i < result.length; i++) {
                let imgPath = result[i].images.split(',')[0];
                let colorName = result[i].color;
                let inStock = result[i].in_stock;
                let info = result[i].info;
                let stockClass = inStock ? 'inStock' : 'notInStock';
                let stockText = inStock ? 'Auf Lager' : 'Ausverkauft';
                output += `
                  <span id="${colorName}_${currentMaterial.toUpperCase()}"></span>
                  <div class="colorBox trans">
                    <div>
                      <img src="/images/colors/${imgPath}">
                    </div>
                    
                    <div>
                      <p class="gotham">${colorName} ${currentMaterial.toUpperCase()} ${filamentText}</p>
                      <p class="gothamNormal">${info}</p>
                      <p class="${stockClass} gothamNormal">${stockText}</p>
                    </div>
                  </div>
                `;  
              } 
              output += '</div>';
              resolve(output);
            }
          });
        });
        promises.push(promise);
      }

      Promise.all(promises).then(values => {
        for (let v of values) {
          content += v;
        }

        content += `
          </section>
        `;

        resolve(content);
      });
    });
  });
}

module.exports = buildColors;

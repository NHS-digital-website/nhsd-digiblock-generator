/* global document */
export default function DigiBlocks() {
  const stageEl = document.querySelector('#db-stage');
  if (!stageEl) {
    return;
  }

  //
  // Change these to set the amount of blocks
  const version = '0.1';
  let widthUnits = 1;
  let depthUnits = 1;
  let heightUnits = 12;
  let fineness = 0; // 0-1 where 0 = every block is rendered, 1 = no blocks are rendered
  let zoomLevel = 600;

  //
  const widthUnitsControl = document.querySelector('#widthUnits');
  const heightUnitsControl = document.querySelector('#heightUnits');
  const depthUnitsControl = document.querySelector('#depthUnits');
  const finenessControl = document.querySelector('#fineness');
  const zoomControl = document.querySelector('#zoom');
  const exportButton = document.querySelector('#exportButton');

  const xmlns = 'http://www.w3.org/2000/svg';
  const blockWidth = 71;
  const blockHeight = 82;
  const xShift = blockWidth / 2;
  const yShift = blockHeight / 4;
  const colourVariants = ['white', 'yellow', 'black', 'grey', 'light-grey', 'dark-grey', 'blue', 'light-blue', 'dark-blue'];
  let blocks = [];

  const exportRenderData = () => {
    const dataToExport = {
      settings: {
        version,
        fineness,
        widthUnits,
        heightUnits,
        depthUnits,
      },
      data: {
        blocks,
      },
    };

    const dataStr = `data:text/json;charset=utf-8, ${encodeURIComponent(JSON.stringify(dataToExport, null, 2))}`;
    const fileDownloadTrigger = document.querySelector('#fileDownloadTrigger');
    fileDownloadTrigger.setAttribute('href', dataStr);
    fileDownloadTrigger.setAttribute('download', 'digiblock-data-export.json');
    fileDownloadTrigger.click();
  };

  const generateBlocks = () => {
    blocks = [];

    for (let i = 0; i < heightUnits; i += 1) {
      // Group the blocks into 'virtual' layers
      if (!blocks[i]) {
        blocks[i] = [];
      }

      for (let j = 0; j < depthUnits * widthUnits; j += 1) {
        // Create block for each x, y, z coordinate with a random colour
        const block = {
          x: j % widthUnits,
          y: i,
          z: Math.floor(j / widthUnits),
          blank: Math.random() > 1 - fineness,
          colourVariantId: Math.round(Math.random() * (colourVariants.length - 1)),
        };

        blocks[i].push(block);
      }
    }
  };

  const drawBlocks = () => {
    stageEl.innerHTML = '';

    let xAnchor = Math.round(zoomLevel * 0.5 - (widthUnits + 1) * blockWidth * 0.25);
    // Shift by number of depthUnits
    xAnchor += Math.round((depthUnits - 1) * 0.5 * xShift);
    let yAnchor = Math.round(zoomLevel * 0.5 - blockHeight * 0.5
      + (heightUnits - 1) * blockHeight * 0.25);
    // Shift by number of widthUnits
    yAnchor -= Math.round((widthUnits - 1) * 0.125 * blockHeight);
    yAnchor -= Math.round((depthUnits - 1) * 0.5 * yShift);

    blocks.forEach((layer, index) => {
      const layerEl = document.createElementNS(xmlns, 'g');
      layerEl.classList.add('db-layer');
      layerEl.classList.add(`db-layer--${index}`);
      stageEl.appendChild(layerEl);

      layer.forEach((block) => {
        if (!block.blank) {
          const gEl = document.createElementNS(xmlns, 'g');
          gEl.classList.add('db');
          gEl.classList.add(`db--${colourVariants[block.colourVariantId]}`);

          let blockHtml = '<polygon points="0,20.5 0,61.4 35.5,82 35.5,41"/>';
          blockHtml += '<polygon points="35.5,82 71,61.4 71,20.5 35.5,41"/>';
          blockHtml += '<polygon points="0,20.5 35.5,0 71,20.5 35.5,41"/>';
          gEl.innerHTML = blockHtml;

          const posX = xAnchor + xShift * block.x - xShift * block.z;
          let posY = yAnchor + yShift * block.x + yShift * block.z;

          // Shift layers
          posY -= yShift * 2 * block.y;

          const transformCSS = `transform: translate(${posX}px, ${posY}px);`;
          gEl.setAttribute('style', transformCSS);
          gEl.setAttribute('data-coords', `${block.x}-${block.z}-${block.y}`);
          layerEl.appendChild(gEl);
        }
      });
    });
  };

  const resizeStage = () => {
    stageEl.setAttribute('viewBox', `0 0 ${zoomLevel} ${zoomLevel}`);
  };

  const render = () => {
    resizeStage();
    generateBlocks();
    drawBlocks();
  };

  const init = () => {
    finenessControl.value = fineness;
    widthUnitsControl.value = widthUnits;
    depthUnitsControl.value = depthUnits;
    heightUnitsControl.value = heightUnits;
    zoomControl.value = zoomLevel;

    render();

    finenessControl.addEventListener('change', () => {
      fineness = +finenessControl.value;
      render();
    });

    widthUnitsControl.addEventListener('change', () => {
      widthUnits = +widthUnitsControl.value;
      render();
    });

    depthUnitsControl.addEventListener('change', () => {
      depthUnits = +depthUnitsControl.value;
      render();
    });

    heightUnitsControl.addEventListener('change', () => {
      heightUnits = +heightUnitsControl.value;
      render();
    });

    zoomControl.addEventListener('change', () => {
      zoomLevel = +zoomControl.value;
      render();
    });

    exportButton.addEventListener('click', exportRenderData);
  };

  init();
}

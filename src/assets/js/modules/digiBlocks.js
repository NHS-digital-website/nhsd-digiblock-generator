/* global document */
export default function DigiBlocks() {
  const stageEl = document.querySelector('#db-stage');
  if (!stageEl) {
    return;
  }

  //
  // Change these to set the amount of blocks
  const version = '0.1';
  let widthUnits = 3;
  let depthUnits = 3;
  let heightUnits = 3;
  let viewBoxSize = 600;
  let colourTheme = 'blue';
  let fineness = 0; // 0-1 where 0 = every block is rendered, 1 = no blocks are rendered

  //
  const widthUnitsControl = document.querySelector('#widthUnits');
  const heightUnitsControl = document.querySelector('#heightUnits');
  const depthUnitsControl = document.querySelector('#depthUnits');
  const finenessControl = document.querySelector('#fineness');
  const zoomControl = document.querySelector('#zoom');
  const colourThemeControl = document.querySelector('#colourTheme');
  const exportButton = document.querySelector('#exportButton');

  const xmlns = 'http://www.w3.org/2000/svg';
  const blockWidth = 71;
  const blockHeight = 82;
  const xShift = blockWidth * 0.5;
  const yShift = blockHeight * 0.25;
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
          colourVariantId: colourVariants.indexOf(colourTheme) >= 0
            ? colourVariants.indexOf(colourTheme)
            : Math.round(Math.random() * (colourVariants.length - 1)),
        };

        blocks[i].push(block);
      }
    }
  };

  const drawBlocks = () => {
    stageEl.innerHTML = '';

    // Calculate center coordinates maths
    const xAnchor = Math.round(viewBoxSize * 0.5
      - (widthUnits + 1) * 0.5 * xShift
      + (depthUnits - 1) * 0.5 * xShift);
    const yAnchor = Math.round(viewBoxSize * 0.5
      + (heightUnits - 3) * yShift
      - (widthUnits - 1) * 0.5 * yShift
      - (depthUnits - 1) * 0.5 * yShift);

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
    stageEl.setAttribute('viewBox', `0 0 ${viewBoxSize} ${viewBoxSize}`);
  };

  const render = () => {
    resizeStage();
    generateBlocks();
    drawBlocks();
  };

  const initColourControl = () => {
    const allColourVariants = ['random', ...colourVariants];
    allColourVariants.forEach((colour) => {
      const optionEl = document.createElement('option');
      optionEl.value = colour;
      optionEl.text = colour;
      if (colour === colourTheme) {
        optionEl.setAttribute('selected', true);
      }
      colourThemeControl.appendChild(optionEl);
    });
  };

  const init = () => {
    initColourControl();

    finenessControl.value = fineness;
    widthUnitsControl.value = widthUnits;
    depthUnitsControl.value = depthUnits;
    heightUnitsControl.value = heightUnits;
    zoomControl.value = viewBoxSize;

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
      viewBoxSize = +zoomControl.value;
      render();
    });

    colourThemeControl.addEventListener('change', () => {
      colourTheme = colourThemeControl.value;
      render();
    });

    exportButton.addEventListener('click', exportRenderData);
  };

  init();
}

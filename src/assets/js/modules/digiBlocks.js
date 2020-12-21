/* global document FileReader */
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
  let heightUnits = 1;
  let viewBoxSize = 300;
  let colour = 'yellow';
  let fineness = 0; // 0-1 where 0 = every block is rendered, 1 = no blocks are rendered

  //
  const widthUnitsControl = document.querySelector('#widthUnits');
  const heightUnitsControl = document.querySelector('#heightUnits');
  const depthUnitsControl = document.querySelector('#depthUnits');
  const finenessControl = document.querySelector('#fineness');
  const zoomControl = document.querySelector('#zoom');
  const colourControl = document.querySelector('#colour');
  const exportButton = document.querySelector('#exportButton');
  const importButton = document.querySelector('#importButton');
  const fileDownloadTrigger = document.querySelector('#fileDownloadTrigger');
  const fileUploadTrigger = document.querySelector('#fileUploadTrigger');

  const xmlns = 'http://www.w3.org/2000/svg';
  const blockWidth = 71;
  const blockHeight = 82;
  const xShift = blockWidth * 0.5;
  const yShift = blockHeight * 0.25;
  const colourVariants = ['white', 'yellow', 'black', 'grey', 'light-grey', 'dark-grey', 'blue', 'light-blue', 'dark-blue'];
  let blocks = [];

  const capitaliseString = (string) => {
    return string
      .split('')
      .map((char, i) => {
        if (!i) {
          return char.toUpperCase();
        }
        return char;
      })
      .join('');
  };

  const initColourControl = () => {
    const allColourVariants = ['random', ...colourVariants];
    allColourVariants.forEach((colourId) => {
      const colourLabel = capitaliseString(colourId);
      const optionEl = document.createElement('option');
      optionEl.value = colourId;
      optionEl.text = colourLabel.replace('-', ' ');
      colourControl.appendChild(optionEl);
    });
  };

  const setControlValues = () => {
    finenessControl.value = fineness;
    widthUnitsControl.value = widthUnits;
    depthUnitsControl.value = depthUnits;
    heightUnitsControl.value = heightUnits;
    zoomControl.value = viewBoxSize;

    colourControl.options.forEach((optionEl) => {
      optionEl.removeAttribute('selected');
      if (optionEl.value === colour) {
        optionEl.setAttribute('selected', true);
      }
    });
  };

  const resetFileUploadTrigger = () => {
    fileUploadTrigger.setAttribute('type', 'text');
    fileUploadTrigger.setAttribute('type', 'file');
  };

  const importData = () => {
    fileUploadTrigger.click();
  };

  const parseDataFile = (dataFileContents) => {
    const parsedData = JSON.parse(dataFileContents);

    // TODO - Add sanity check to make sure corrupted data doesn't break the app.
    fineness = parsedData.settings.fineness;
    widthUnits = parsedData.settings.widthUnits;
    heightUnits = parsedData.settings.heightUnits;
    depthUnits = parsedData.settings.depthUnits;
    viewBoxSize = parsedData.settings.viewBoxSize;
    colour = parsedData.settings.colour;
    setControlValues();

    blocks = parsedData.blocks;
    // Redraw the stage using the cached data
    // eslint-disable-next-line no-use-before-define
    render({
      generateData: false,
    });

    resetFileUploadTrigger();
  };

  const openDataFile = () => {
    const dataFile = fileUploadTrigger.files[0];
    const fileReader = new FileReader();
    fileReader.addEventListener('load', (event) => {
      parseDataFile(event.target.result);
    });
    // fileReader.addEventListener('error', (error) => {
    //   console.log(error);
    // });

    fileReader.readAsText(dataFile);
  };

  const exportData = () => {
    const dataToExport = {
      settings: {
        version,
        fineness,
        widthUnits,
        heightUnits,
        depthUnits,
        viewBoxSize,
        colour,
      },
      blocks,
    };

    const dataStr = `data:text/json;charset=utf-8, ${encodeURIComponent(JSON.stringify(dataToExport, null, 2))}`;
    fileDownloadTrigger.setAttribute('href', dataStr);
    fileDownloadTrigger.setAttribute('download', 'digiblock-data-export.json');
    fileDownloadTrigger.click();
  };

  const generateColourId = () => {
    return colourVariants.indexOf(colour) >= 0
      ? colourVariants.indexOf(colour)
      : Math.round(Math.random() * (colourVariants.length - 1));
  };

  const updateBlockDataColours = () => {
    blocks.forEach((layer) => {
      layer.forEach((block) => {
        block.colourVariantId = generateColourId();
      });
    });
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
          colourVariantId: generateColourId(),
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

          gEl.setAttribute('transform', `translate(${posX}, ${posY})`);
          gEl.setAttribute('data-coords', `${block.x}-${block.z}-${block.y}`);
          layerEl.appendChild(gEl);
        }
      });
    });
  };

  const resizeStage = () => {
    stageEl.setAttribute('viewBox', `0 0 ${viewBoxSize} ${viewBoxSize}`);
  };

  const render = (options = {}) => {
    const settings = { generateData: true, ...options };

    resizeStage();
    if (settings.generateData) {
      generateBlocks();
    }
    drawBlocks();
  };

  const init = () => {
    initColourControl();
    setControlValues();
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
      render({
        generateData: false,
      });
    });

    colourControl.addEventListener('change', () => {
      colour = colourControl.value;
      updateBlockDataColours();

      // Redraw the stage using the cached data
      render({
        generateData: false,
      });
    });

    exportButton.addEventListener('click', () => {
      exportButton.blur();
      exportData();
    });
    importButton.addEventListener('click', () => {
      importButton.blur();
      importData();
    });

    fileUploadTrigger.addEventListener('change', openDataFile);
  };

  init();
}

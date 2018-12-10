const buildDom = (html) => {
  let div = document.createElement('div');
  div.innerHTML = html;
  return div.children[0];
}

const main = () => {

  const mainContainerElement = document.querySelector('#main-container');

    callResponse(mainContainerElement, 'revenue' );
    callResponse(mainContainerElement, 'impresions' );
    callResponse(mainContainerElement, 'visits' );
    callResponse(mainContainerElement, 'error' );

}

async function callResponse(mainContainerElement, url ){

  let response = await fetch(`https://dda2c524-43f0-492f-a797-471a04f04f0f.mock.pstmn.io/${url}`,{ method: 'GET'})
  let data = await response.json();

  // Here we check the data
  if (data.tablet === undefined || data.smartphone === undefined 
    || data.tablet < 0 || data.smartphone < 0 || 
    typeof data.tablet === 'number' || typeof data.smartphone === 'number' ){
      console.log('Error: is not possible to draw because the data is not valid');
  } else {


  let testElement = buildDom(`
    <main class="">
    <canvas width="400" height="200" class="${url}-canva"></canvas>
    <div class="element">
      <div>
      <div class="element-inside">
      <div>Tablet</div>
          <div class="${url}-inside-tablet"> 
           <span class="value"></span>
           <span class="${url}-tablet"></span>
          </div>
        </div>
      </div>

      <div>
      <div class="element-inside">
      <div>Smartphone</div>
          <div class="${url}-inside-smartphone"> 
           <span class="value"></span>
           <span class="${url}-smartphone"></span>
          </div>
        </div>
      </div>
      
      </div>
    </div>
    </main>
 `)

   mainContainerElement.appendChild(testElement);
 
   drawCircle(data.tablet, data.smartphone, `${url}-canva` );

   const tabletElement = document.querySelector(`.${url}-tablet`);
   tabletElement.innerHTML = data.tablet;
  
   const smartphoneElement = document.querySelector(`.${url}-smartphone`);
   smartphoneElement.innerHTML = data.smartphone;

   let total = parseInt(data.tablet) + parseInt(data.smartphone);
   const percTablet = document.querySelector(`.${url}-inside-tablet .value`);
   percTablet.innerHTML = (data.tablet/total)*100;

   const percSmartphone = document.querySelector(`.${url}-inside-smartphone .value`);
   percSmartphone.innerHTML = (data.smartphone/total)*100;
  }
}
const drawCircle = (tablet, smartphone, canva) => {
  // Original code from: https://bl.ocks.org/mbostock/99f0a6533f7c949cf8b8

  // Here we check the data
  if (tablet === undefined || smartphone === undefined 
    || tablet < 0 || smartphone < 0 || 
    typeof tablet === 'number' || typeof smartphone === 'number' ){
        console.log('Error: Data is not valid inside the drawFunction');
    } else {
      
    let data = [tablet, smartphone];
    let canvas = document.querySelector(`.${canva}`), 
        context = canvas.getContext("2d");
    
    let width = canvas.width,
        height = canvas.height,
        radius = Math.min(width, height) / 2;
    
    let colors = [
      "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd",
      "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"
    ];
    
    let arc = d3.arc()
        .outerRadius(radius - 10)
        .innerRadius(radius - 35)
        .padAngle(0.03)
        .context(context);
    
    let pie = d3.pie();
    
    let arcs = pie(data);
    
    context.translate(width / 2, height / 2);
    
    context.globalAlpha = 0.5;
    arcs.forEach(function(d, i) {
      context.beginPath();
      arc(d);
      context.fillStyle = colors[i];
      context.fill();
    });
    
    context.globalAlpha = 1;
    context.beginPath();
    arcs.forEach(arc);
    context.lineWidth = 1.5;
    context.stroke();
  
  }

}

document.addEventListener('DOMContentLoaded', main);

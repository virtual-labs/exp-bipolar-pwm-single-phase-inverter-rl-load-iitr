function plotData() {
  if (
    values["AC1"]["volt"] != 0 &&
    values["AC2"]["volt"] != 0 &&
    values["AC2"]["freq"] != 0 &&
    values["AC1"]["freq"] != 0 &&
    values["C2"]["value"] != 0 &&
    values["C1"]["value"] != 0 &&
    values["DC1"]["value"] != 0 &&
    values["R1"]["value"] != 0 &&
    values["I1"]["value"] != 0
  ) {
    var graph = document.getElementById("graph-new");
    graph.innerHTML = "";
    var mine = document.createElement("div");
    mine.id = "mineeee";
    mine.classList.add("graph-style");
    graph.append(mine);
    mine = document.createElement("div");
    mine.id = "squarewave";
    mine.classList.add("graph-style");
    graph.append(mine);
    mine = document.createElement("div");
    mine.id = "squarewaveResistor";
    mine.classList.add("graph-style");
    graph.append(mine);
    mine = document.createElement("div");
    mine.id = "squarewaveInductor";
    mine.classList.add("graph-style");
    graph.append(mine);

    a = generateData();

    var data = [
      {
        x: a[0][1],
        y: a[0][0],
        mode: "lines",
        name: "V<sub>SINE</sub>",
      },
      {
        x: a[1][1],
        y: a[1][0],
        mode: "lines",
        name: "V<sub>TRI </sub>",
      },
    ];

    var layout = {
      title:
        "<b>" + values["VM5"]["name"] + "/" + values["VM7"]["name"] + "</b>",
      xaxis: { range: [0, 0.041], title: "<b>Time(s)</b>", fixedrange: true },
      yaxis: {
        range: [-1 * (a[5][1] + 1), a[5][1] + 1],
        title: "<b>Amplitude(V)</b>",
        fixedrange: true,
      },
      margin: { t: 35 },
    };

    Plotly.newPlot("mineeee", data, layout, { displayModeBar: false });
    Plotly.newPlot(
      "squarewave",
      [
        {
          x: a[2][1],
          y: a[2][0],
          mode: "lines",
          name: "V<sub>Load</sub>",
        },
        {
          x: [0],
          y: [0],
          mode: "lines",
          name: "    ",
          marker: {
            color: "White",
          },
        },
      ],
      {
        title: "<b>" + values["VM3"]["name"] + "</b>",
        xaxis: { range: [0, 0.041], title: "<b>Time(s)</b>", fixedrange: true },
        yaxis: {
          range: [-1 * (a[5][0] + 1), a[5][0] + 1],
          title: "<b>Voltage(V)</b>",
          fixedrange: true,
        },
        margin: { t: 30 },
      },
      { displayModeBar: false }
    );
    Plotly.newPlot(
      "squarewaveInductor",
      [
        {
          x: a[3][1],
          y: a[3][0],
          mode: "lines",
          name: "V<sub>M2  </sub>",
          marker: {
            color: "Green",
          },
        },
        {
          x: [0],
          y: [0],
          mode: "lines",
          name: "    ",
          marker: {
            color: "White",
          },
        },
      ],
      {
        title: "<b>" + values["VM4"]["name"] + "</b>",
        xaxis: { range: [0, 0.041], title: "<b>Time(s)</b>", fixedrange: true },
        yaxis: {
          range: [-1 * (a[5][0] + 1), a[5][0] + 1],
          title: "<b>Voltage(V)</b>",
          fixedrange: true,
        },
        margin: { t: 30 },
      },
      { displayModeBar: false }
    );
    Plotly.newPlot(
      "squarewaveResistor",
      [
        {
          x: a[4][1],
          y: a[4][0],
          mode: "lines",
          name: "V<sub>M1  </sub>",
          marker: {
            color: "Green",
          },
        },
        {
          x: [0],
          y: [0],
          mode: "lines",
          name: "    ",
          marker: {
            color: "White",
          },
        },
      ],
      {
        title: "<b>" + values["VM1"]["name"] + "</b>",
        xaxis: { range: [0, 0.041], title: "<b>Time(s)</b>", fixedrange: true },
        yaxis: {
          range: [-1 * (a[5][0] + 1), a[5][0] + 1],
          title: "<b>Voltage(V)</b>",
          fixedrange: true,
        },
        margin: { t: 30 },
      },
      { displayModeBar: false }
    );
  }
}

function generateData() {
  var a = values["AC1"]["freq"];
  var dcvalue = values["DC1"]["value"];
  var aplitute = values["AC1"]["volt"];
  var yval = [];
  var xval = [];
  var value, valuetri;
  var large;
  var yvaltri = [];
  var app = values["AC2"]["volt"];
  var ac2freq = values["AC2"]["freq"];
  var distance = 1 / ac2freq;
  var flag = true;
  var parity = true;
  if (app <= aplitute) {
    large = app;
  } else {
    large = aplitute;
  }
  var difference = (1 / 400) * large;
  var slop1 = 4 * (app / distance);
  var slop2 = -1 * slop1;
  var sqwave = dcvalue,
    dist = 0;
  var sq = [];
  var cap1 = values["C1"]["value"];
  var cap2 = values["C2"]["value"];
  var sum = parseInt(cap1) + parseInt(cap2);
  var vloadind = [];
  var vloadresis = [];
  var vresis = -1 * (dcvalue * (cap1 / sum));
  var vinduc = dcvalue * (cap2 / sum);
  var avgsum = 0;
  for (let x = 0; x <= 0.04; x += 0.000001) {
    value = aplitute * Math.sin(2 * Math.PI * a * x);
    yval.push(value);
    xval.push(x);
    if (flag) {
      valuetri = slop1 * x - slop1 * dist - app;
      if (valuetri > app) {
        dist = dist + distance;
        flag = false;
        valuetri = slop2 * x - slop2 * dist - app;
      }
    } else {
      valuetri = slop2 * x - slop2 * dist - app;
      if (valuetri < -1 * app) {
        flag = true;
        valuetri = slop1 * x - slop1 * dist - app;
      }
    }
    yvaltri.push(valuetri);
    
        if (value < valuetri) {
          sqwave = -1 * dcvalue;
          vresis = dcvalue * (cap2 / sum);
          vinduc = -1 * (dcvalue * (cap1 / sum));
        } else {
          sqwave = dcvalue;
          vresis = -1 * (dcvalue * (cap1 / sum));
          vinduc = dcvalue * (cap2 / sum);
        }
        
    
    sq.push(sqwave);
    vloadind.push(vinduc);
    vloadresis.push(parseFloat(vresis));
  }

  var vavg =
    (aplitute / app) *
    dcvalue *
    Math.sin(2 * Math.PI * a * 0.04 * (Math.PI / 180));

  var vrms = dcvalue - 0.1;
  var resistance = parseInt(values["R1"]["value"]);
  var inductance = parseInt(values["I1"]["value"]) * 0.001;
  var total_resistance = Math.sqrt(
    resistance * resistance +
      2 * Math.PI * a * inductance * (2 * Math.PI * a * inductance)
  );
  var irms = vrms / total_resistance;
  var iavg = vavg / total_resistance;
  if (vrms < 1) {
    vrms = parseInt(vrms * 1000) / 1000;
  } else {
    vrms = parseInt(vrms * 100) / 100;
  }
  if (irms < 1) {
    irms = parseInt(irms * 1000) / 1000;
  } else {
    irms = parseInt(irms * 100) / 100;
  }
  if (vavg < 1) {
    vavg = parseInt(vavg * 1000) / 1000;
  } else {
    vavg = parseInt(vavg * 100) / 100;
  }
  if (iavg < 1) {
    iavg = parseInt(iavg * 1000) / 1000;
  } else {
    iavg = parseInt(iavg * 100) / 100;
  }
  values["vavg"] = vavg;
  values["iavg"] = iavg;
  values["vrms"] = vrms;
  values["irms"] = irms;

  var z;
  if (parseInt(app) >= parseInt(aplitute)) {
    z = app;
  } else {
    z = aplitute;
  }
  avgsum = avgsum / sq.length;
  return [
    [yval, xval],
    [yvaltri, xval],
    [sq, xval],
    [vloadind, xval],
    [vloadresis, xval],
    [parseFloat(dcvalue), parseFloat(z)],
  ];
}
function Reset() {
  window.location.reload();
}

function showtable() {
  var r = document.getElementById("readings");
  if ((r.style.display = "none")) {
    r.style.display = "block";
  } else {
    r.style.display.toggle();
  }
}
